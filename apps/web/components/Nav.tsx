'use client';
import { useEffect, useState } from 'react';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById('nav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className="nav" id="nav">
        <div className="container nav-inner">
          <a className="brand" href="#top" aria-label="FPtech">
            <img className="brand-logo" src="/fptech-logo.png" alt="FPtech" />
          </a>
          <div className="nav-links">
            <a href="#product">Продукт</a>
            <a href="#sources">Источники</a>
            <a href="#numbers">В цифрах</a>
            <a href="#features">Возможности</a>
            <a href="#contacts">Контакты</a>
          </div>
          <button
            className="nav-cta"
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Оставить заявку</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      <div className={`nav-mobile${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Навигация">
        <div className="nav-mobile-head">
          <a className="brand" href="#top" aria-label="FPtech" onClick={close}>
            <img className="brand-logo" src="/fptech-logo.png" alt="FPtech" />
          </a>
          <button className="nav-mobile-close" onClick={close} aria-label="Закрыть меню">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="nav-mobile-links">
          <a href="#product" onClick={close}>Продукт</a>
          <a href="#sources" onClick={close}>Источники</a>
          <a href="#numbers" onClick={close}>В цифрах</a>
          <a href="#features" onClick={close}>Возможности</a>
          <a href="#contacts" onClick={close}>Контакты</a>
        </nav>
        <div className="nav-mobile-cta">
          <a className="btn btn-primary" href="#cta" onClick={close}>
            Оставить заявку
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
