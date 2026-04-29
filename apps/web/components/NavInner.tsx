'use client';
import { useEffect } from 'react';

export default function NavInner() {
  useEffect(() => {
    const nav = document.getElementById('nav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="nav" id="nav">
      <div className="container nav-inner">
        <a className="brand" href="/" aria-label="FPtech">
          <img className="brand-logo" src="/fptech-logo.png" alt="FPtech" />
        </a>
        <div className="nav-links">
          <a href="/#product">Продукт</a>
          <a href="/#sources">Источники</a>
          <a href="/#numbers">В цифрах</a>
          <a href="/#features">Возможности</a>
          <a href="/#contacts">Контакты</a>
        </div>
      </div>
    </nav>
  );
}
