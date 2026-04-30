'use client';

import { useEffect } from 'react';

const STATUS_ENDPOINT = '/api/vpn-status/';
const POLL_MS = 15000;
const MIN_CHECK_INTERVAL_MS = 3000;

// Client-side watcher that complements the server middleware. The middleware
// only re-evaluates VPN status on a real page navigation; this hook adds two
// triggers that don't involve a navigation:
//   1. On `visibilitychange` to "visible" / window `focus` — covers the case
//      where the user was on the site, switched tabs, enabled a VPN, and
//      came back (no navigation, middleware never sees it).
//   2. On the /vpn-blocked/ page only — periodically poll while the tab is
//      visible so disabling the VPN auto-recovers the page without forcing
//      the user to click "Try again".
export default function VpnWatcher() {
  useEffect(() => {
    const onBlockedPage = window.location.pathname.startsWith('/vpn-blocked');
    let pollId: number | null = null;
    let lastCheck = 0;
    let cancelled = false;

    const check = async () => {
      const now = Date.now();
      if (now - lastCheck < MIN_CHECK_INTERVAL_MS) return;
      lastCheck = now;
      try {
        const res = await fetch(STATUS_ENDPOINT, { cache: 'no-store' });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { blocked?: boolean };
        if (cancelled) return;
        if (onBlockedPage && data.blocked === false) {
          window.location.replace('/');
        } else if (!onBlockedPage && data.blocked === true) {
          window.location.replace('/vpn-blocked/');
        }
      } catch {
        // network error — silently retry on next trigger
      }
    };

    const startPolling = () => {
      if (pollId === null && onBlockedPage) {
        pollId = window.setInterval(check, POLL_MS);
      }
    };
    const stopPolling = () => {
      if (pollId !== null) {
        window.clearInterval(pollId);
        pollId = null;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        check();
        startPolling();
      } else {
        stopPolling();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', check);

    if (document.visibilityState === 'visible') startPolling();

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', check);
      stopPolling();
    };
  }, []);

  return null;
}
