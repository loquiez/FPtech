# FPtech

Landing page for FPtech — a B2B SaaS platform for counterparty risk detection, built for banks and financial institutions.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Turborepo** monorepo (`apps/web`)
- Form API: nodemailer (SMTP) + Telegram Bot

## Getting started

```bash
npm install
npm run dev        # starts apps/web at localhost:3000
```

## Environment

Copy `apps/web/.env.local.example` to `apps/web/.env.local` and fill in SMTP and Telegram credentials before running the contact form.

## Structure

```
apps/
  web/
    app/          # Next.js App Router pages & API routes
    components/   # UI components (Nav, Hero, Features, etc.)
    public/       # Static assets
```
