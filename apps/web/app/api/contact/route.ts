import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface LeadData {
  name: string;
  email: string;
  phone: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeMarkdown(str: string): string {
  return str.replace(/[[\]()_*~`>#+=|{}.!\\-]/g, '\\$&');
}

// Max 3 submissions per IP per 60 seconds
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// 1 submission per unique contact set (email+phone) per 3-hour window.
const submissionMap = new Map<string, { cooldownUntil: number }>();
const COOLDOWN_MS = 3 * 60 * 60 * 1_000;

function isDuplicateSubmission(data: LeadData): boolean {
  const key = `${data.email.toLowerCase()}|${data.phone.replace(/\s+/g, '')}`;
  const now = Date.now();
  const entry = submissionMap.get(key);

  if (entry && now < entry.cooldownUntil) return true;

  submissionMap.set(key, { cooldownUntil: now + COOLDOWN_MS });
  return false;
}

// Per-IP captcha window: track last submission within 5-minute window.
interface CaptchaEntry {
  submitAt: number;
  email: string;
  phone: string;
}
const captchaWindowMap = new Map<string, CaptchaEntry>();
const CAPTCHA_WINDOW_MS = 5 * 60 * 1_000;

function needsCaptcha(ip: string, email: string, phone: string): boolean {
  const now = Date.now();
  const entry = captchaWindowMap.get(ip);
  if (!entry || now > entry.submitAt + CAPTCHA_WINDOW_MS) return false;
  return entry.email !== email.toLowerCase() || entry.phone !== phone.replace(/\D/g, '');
}

function recordSubmission(ip: string, email: string, phone: string) {
  captchaWindowMap.set(ip, {
    submitAt: Date.now(),
    email: email.toLowerCase(),
    phone: phone.replace(/\D/g, ''),
  });
}

async function validateHCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) return true; // no secret → skip validation in dev

  try {
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), 5_000);
    const res = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ response: token, secret }).toString(),
      signal: ac.signal,
    });
    clearTimeout(timeout);
    const json = await res.json();
    return json.success === true;
  } catch {
    return true; // fail open on network error
  }
}

async function notifyEmail(data: LeadData) {
  if (!process.env.SMTP_HOST) return;

  const port = Number(process.env.SMTP_PORT ?? 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE !== 'false',
    requireTLS: port === 587,
    connectionTimeout: 8000,
    socketTimeout: 8000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone);

  await transport.sendMail({
    from: `"FPtech Leads" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `Новая заявка — ${data.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px">
        <h2 style="margin:0 0 24px;color:#0A1A3C">Новая заявка с сайта FPtech</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="padding:10px 20px 10px 0;color:#6B7A99;white-space:nowrap">Имя</td>
            <td style="padding:10px 0"><strong>${name}</strong></td>
          </tr>
          <tr>
            <td style="padding:10px 20px 10px 0;color:#6B7A99;white-space:nowrap">Email</td>
            <td style="padding:10px 0"><a href="mailto:${email}" style="color:#2B6CFF">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 20px 10px 0;color:#6B7A99;white-space:nowrap">Телефон</td>
            <td style="padding:10px 0">${phone || '—'}</td>
          </tr>
        </table>
      </div>
    `,
  });
}

async function notifyMax(data: LeadData) {
  const token = process.env.MAX_BOT_TOKEN;
  const userId = process.env.MAX_USER_ID;
  if (!token || !userId) return;

  const text = [
    '**Новая заявка — FPtech**',
    '',
    `**Имя:** ${escapeMarkdown(data.name)}`,
    `**Email:** ${escapeMarkdown(data.email)}`,
    `**Телефон:** ${data.phone ? escapeMarkdown(data.phone) : '—'}`,
  ].join('\n');

  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 5_000);
  try {
    await fetch('https://platform-api.max.ru/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ user_id: Number(userId), text, format: 'markdown' }),
      signal: ac.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function notifyTelegram(data: LeadData) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) return;

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone);

  const text = [
    '📋 <b>Новая заявка — FPtech</b>',
    '',
    `👤 <b>Имя:</b> ${name}`,
    `✉️ <b>Email:</b> ${email}`,
    `📞 <b>Телефон:</b> ${phone || '—'}`,
  ].join('\n');

  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 5_000);
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      signal: ac.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  // CSRF: reject explicitly cross-origin requests
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
  }

  // Rate limiting by client IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'too many requests' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
  }

  const { name, email, phone } = body as Partial<LeadData>;

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: 'all fields are required' }, { status: 400 });
  }

  const phoneStr = phone.trim();
  if (name.trim().length > 200 || email.trim().length > 254 || phoneStr.length > 30) {
    return NextResponse.json({ error: 'field too long' }, { status: 400 });
  }

  if (phoneStr.replace(/\D/g, '').length < 6) {
    return NextResponse.json({ error: 'invalid phone' }, { status: 400 });
  }

  if (!isValidEmail(email.trim())) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  }

  const data: LeadData = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
  };

  // Captcha check: required when a different contact set is submitted within 5 minutes from same IP
  if (needsCaptcha(ip, data.email, data.phone)) {
    const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : null;

    if (!captchaToken) {
      return NextResponse.json({ captchaRequired: true }, { status: 403 });
    }

    const valid = await validateHCaptcha(captchaToken);
    if (!valid) {
      return NextResponse.json({ error: 'captcha_failed' }, { status: 403 });
    }
  }

  if (isDuplicateSubmission(data)) {
    return NextResponse.json({ duplicate: true });
  }

  // Fire-and-forget: return success immediately, send notifications in background
  void Promise.allSettled([notifyEmail(data), notifyTelegram(data), notifyMax(data)]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`FPtech contact notification[${i}] failed: ${msg}`);
      } else {
        console.log(`FPtech contact notification[${i}] ok`);
      }
    });
  });

  recordSubmission(ip, data.email, data.phone);

  return NextResponse.json({ ok: true });
}
