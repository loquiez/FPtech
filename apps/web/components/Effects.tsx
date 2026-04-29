'use client';
import { useEffect } from 'react';

export default function Effects() {
  useEffect(() => {
    const revealEls = document.querySelectorAll<HTMLElement>('.reveal');
    revealEls.forEach((el, i) => {
      el.style.setProperty('--rd', (i % 4) * 80 + 'ms');
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            if (e.target.classList.contains('doc-stack')) e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    revealEls.forEach((el) => io.observe(el));

    const docStacks = document.querySelectorAll('.doc-stack');
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io2.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    docStacks.forEach((el) => io2.observe(el));

    const counters = document.querySelectorAll<HTMLElement>('.count, .hvcount');
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const target = parseFloat(el.dataset.target ?? '0');
          const suffix = el.dataset.suffix ?? '';
          const dur = 1800;
          const start = performance.now();
          function step(t: number) {
            const p = Math.min((t - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target >= 100 ? Math.round(target * eased) : (target * eased).toFixed(1)) + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((c) => cio.observe(c));

    return () => {
      io.disconnect();
      io2.disconnect();
      cio.disconnect();
    };
  }, []);

  return null;
}
