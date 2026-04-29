import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevent clickjacking — site cannot be embedded in iframes
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Don't send full URL as Referer to third-party sites
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable access to sensitive browser features not used by this site
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Force HTTPS for 2 years (enable only after confirming HTTPS is stable)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-inline' and 'unsafe-eval' are required by Next.js for hydration and styles
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.hcaptcha.com https://*.hcaptcha.com",
      "style-src 'self' 'unsafe-inline' https://*.hcaptcha.com",
      "img-src 'self' data: blob: https://*.hcaptcha.com",
      "font-src 'self' data:",
      "frame-src https://*.hcaptcha.com",
      "connect-src 'self' https://*.hcaptcha.com",
      // Blocks the page from being framed by any origin (defense-in-depth with X-Frame-Options)
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const config: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default config;
