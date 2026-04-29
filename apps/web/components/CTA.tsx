'use client';
import { useState, useCallback, useRef } from 'react';
import PhoneField from './PhoneField';
import CaptchaModal from './CaptchaModal';

interface FormState {
  name: string;
  email: string;
}

const FIELD_PREPOSITIONAL: Record<keyof FormState, string> = {
  name: 'имени',
  email: 'email',
};

function formatMissing(keys: (keyof FormState)[]): string {
  const labels = keys.map((k) => FIELD_PREPOSITIONAL[k]);
  if (labels.length === 1) return labels[0]!;
  const last = labels.at(-1)!;
  return `${labels.slice(0, -1).join(', ')} и ${last}`;
}

const LS_KEY = 'fptech_last_sub';

interface LastSub {
  ts: number;
  email: string;
  phone: string;
}

function needsCaptcha(email: string, phone: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    const last = JSON.parse(raw) as LastSub;
    if (Date.now() - last.ts >= 5 * 60 * 1_000) return false;
    return last.email !== email.toLowerCase() || last.phone !== phone.replace(/\D/g, '');
  } catch {
    return false;
  }
}

function saveLastSub(email: string, phone: string) {
  try {
    const entry: LastSub = {
      ts: Date.now(),
      email: email.toLowerCase(),
      phone: phone.replace(/\D/g, ''),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(entry));
  } catch {}
}

export default function CTA() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [error, setError] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [phoneValid, setPhoneValid] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const pendingRef = useRef<{ data: FormState; phone: string } | null>(null);

  const handlePhoneValidChange = useCallback((valid: boolean) => setPhoneValid(valid), []);

  function handleEmailBlur(e: React.FocusEvent<HTMLInputElement>) {
    const val = e.target.value.trim();
    if (val.length > 0) {
      setEmailError(!val.includes('@') || !val.includes('.'));
    }
  }

  function handleEmailChange() {
    if (emailError) setEmailError(false);
  }

  async function doSubmit(data: FormState, phone: string, captchaToken: string | null) {
    setSubmitting(true);
    setError(false);
    setCaptchaError(false);

    try {
      const body: Record<string, string> = { ...data, phone };
      if (captchaToken) body.captchaToken = captchaToken;

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 429) {
        setDuplicate(true);
        return;
      }

      if (res.status === 403) {
        const json = await res.json().catch(() => ({}));
        if (json.captchaRequired) {
          pendingRef.current = { data, phone };
          setShowCaptcha(true);
        } else {
          setCaptchaError(true);
        }
        return;
      }

      if (!res.ok) throw new Error('Server error');

      const json = await res.json().catch(() => ({}));
      if (json.duplicate) {
        setDuplicate(true);
      } else {
        saveLastSub(data.email, phone);
        setSuccess(true);
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data: FormState = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
    };
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;

    const consent = (form.elements.namedItem('consent') as HTMLInputElement).checked;
    if (!consent) {
      setValidationError('Пожалуйста, примите соглашение на обработку персональных данных');
      return;
    }

    const missing = (Object.keys(data) as (keyof FormState)[]).filter((k) => !data[k]);
    if (missing.length > 0) {
      setValidationError(
        `Чтобы отправить заявку, пожалуйста заполните данные об ${formatMissing(missing)}`
      );
      return;
    }

    if (!phoneValid) {
      setSubmitAttempted(true);
      setValidationError('Введите корректный номер телефона');
      return;
    }

    setSubmitAttempted(false);
    setValidationError(null);

    if (needsCaptcha(data.email, phone)) {
      pendingRef.current = { data, phone };
      setShowCaptcha(true);
      return;
    }

    await doSubmit(data, phone, null);
  }

  async function handleCaptchaVerify(token: string) {
    setShowCaptcha(false);
    if (!pendingRef.current) return;
    const { data, phone } = pendingRef.current;
    pendingRef.current = null;
    await doSubmit(data, phone, token);
  }

  function handleCaptchaClose() {
    setShowCaptcha(false);
    pendingRef.current = null;
  }

  return (
    <>
      {showCaptcha && (
        <CaptchaModal onVerify={handleCaptchaVerify} onClose={handleCaptchaClose} />
      )}
      <section id="cta">
        <div className="cta-block">
          <div className="container">
            <div className="cta-grid">
              <div className="cta-head reveal">
                <div className="eyebrow">
                  <span className="dot" />
                  Свяжемся в течение рабочего дня
                </div>
                <h2 className="cta-h">
                  Проверьте FPtech <em>в работе.</em>
                </h2>
                <p className="cta-lead">
                  Оставьте заявку — покажем сервис на примере реального контрагента, разберём
                  интеграцию с вашими системами и рассчитаем экономику внедрения.
                </p>
                <div className="cta-perks">
                  <span className="perk">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    демо за 30 минут
                  </span>
                  <span className="perk">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    пилот за 2 недели
                  </span>
                  <span className="perk">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    без обязательств
                  </span>
                </div>
              </div>

              <form className="form reveal" onSubmit={handleSubmit} noValidate>
                {duplicate ? (
                  <div className="success on">
                    <div className="check">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3>Заявка принята</h3>
                    <p>Ваша заявка уже в обработке, менеджер свяжется с вами в течение рабочего дня.</p>
                  </div>
                ) : !success ? (
                  <div className="form-body">
                    <h3 className="form-title">Заявка на обратную связь</h3>
                    <p className="form-sub">
                      Менеджер по работе с финансовыми организациями свяжется в течение рабочего дня.
                    </p>

                    <div className="field">
                      <input id="f-name" name="name" type="text" placeholder=" " required />
                      <label htmlFor="f-name">Имя</label>
                    </div>

                    <div className={`field${emailError ? ' field--error' : ''}`}>
                      <input
                        id="f-email"
                        name="email"
                        type="email"
                        placeholder=" "
                        required
                        onBlur={handleEmailBlur}
                        onChange={handleEmailChange}
                      />
                      <label htmlFor="f-email">Рабочий email</label>
                      {emailError && <p className="field-hint">Неправильно набрана почта</p>}
                    </div>

                    <PhoneField
                      onValidChange={handlePhoneValidChange}
                      submitAttempted={submitAttempted}
                    />

                    <label className="consent">
                      <input type="checkbox" name="consent" defaultChecked />
                      <span>
                        Отправляя заявку, вы соглашаетесь на обработку персональных данных в
                        соответствии с{' '}
                        <a href="/privacy">политикой конфиденциальности</a>.
                      </span>
                    </label>

                    <button className="submit" type="submit" disabled={submitting}>
                      {submitting ? 'Отправляем…' : 'Отправить заявку'}
                      {!submitting && (
                        <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>

                    {validationError && (
                      <div className="form-error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                        <span>{validationError}</span>
                      </div>
                    )}

                    {captchaError && (
                      <div className="form-error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                        <span>Проверка не пройдена — попробуйте ещё раз.</span>
                      </div>
                    )}

                    {error && (
                      <div className="form-error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                        <span>Ошибка отправки — попробуйте ещё раз или напишите нам напрямую.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="success on">
                    <div className="check">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3>Заявка отправлена</h3>
                    <p>Менеджер свяжется с вами в течение рабочего дня.</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
