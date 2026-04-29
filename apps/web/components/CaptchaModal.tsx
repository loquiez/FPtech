'use client';
import { useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface Props {
  onVerify: (token: string) => void;
  onClose: () => void;
}

const SITEKEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ?? '10000000-ffff-ffff-ffff-000000000001';

export default function CaptchaModal({ onVerify, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="captcha-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="captcha-modal" role="dialog" aria-modal="true" aria-labelledby="captcha-title">
        <div className="captcha-modal-header">
          <div className="captcha-shield">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="captcha-modal-titles">
            <h3 id="captcha-title" className="captcha-modal-title">
              Подтвердите, что вы не бот
            </h3>
            <p className="captcha-modal-sub">Требуется при повторной отправке заявки</p>
          </div>
          <button className="captcha-modal-close" onClick={onClose} aria-label="Закрыть">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="captcha-modal-body">
          <HCaptcha sitekey={SITEKEY} onVerify={onVerify} theme="dark" />
        </div>
        <p className="captcha-modal-hint">
          Пройдите проверку — и ваша заявка будет отправлена автоматически.
        </p>
      </div>
    </div>
  );
}
