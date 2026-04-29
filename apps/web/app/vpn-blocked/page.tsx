import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Доступ ограничен — FPtech',
  robots: { index: false, follow: false },
}

export default function VpnBlocked() {
  return (
    <div className="vpn-page">
      <div className="vpn-page-bg" aria-hidden="true">
        <div className="vpn-grid" />
        <div className="vpn-glow" />
      </div>

      <div className="vpn-card">
        <div className="vpn-icon-wrap">
          <svg className="vpn-icon" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="48" cy="48" r="38" stroke="var(--line-strong)" strokeWidth="1.5" />
            <ellipse cx="48" cy="48" rx="19" ry="38" stroke="var(--line-strong)" strokeWidth="1.5" />
            <line x1="10" y1="48" x2="86" y2="48" stroke="var(--line-strong)" strokeWidth="1.5" />
            <path d="M14 30 Q48 24 82 30" stroke="var(--line-strong)" strokeWidth="1" opacity=".5" />
            <path d="M14 66 Q48 72 82 66" stroke="var(--line-strong)" strokeWidth="1" opacity=".5" />
<circle cx="48" cy="48" r="3.5" fill="var(--accent)" opacity=".7" />
            <circle cx="34" cy="28" r="2" fill="var(--accent)" opacity=".4" />
            <circle cx="68" cy="38" r="2" fill="var(--accent)" opacity=".4" />
            <line x1="36" y1="28" x2="46" y2="46" stroke="var(--accent)" strokeWidth="1" opacity=".3" />
            <line x1="66" y1="39" x2="51" y2="47" stroke="var(--accent)" strokeWidth="1" opacity=".3" />
          </svg>

          <div className="vpn-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h1 className="vpn-title">Похоже, вы используете VPN</h1>

        <p className="vpn-subtitle">
          С VPN зайти не получится из-за действующих ограничений.
          Отключите его и попробуйте снова.
        </p>

        <div className="vpn-actions">
          <p className="vpn-actions-title">Что можно сделать</p>

          <div className="vpn-action-item">
            <div className="vpn-action-check">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="4,12 9,17 20,6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="vpn-action-text">
              <strong>Отключить VPN</strong>
              <span>Если он работает на вашем устройстве</span>
            </div>
          </div>

          <div className="vpn-action-item">
            <div className="vpn-action-check">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="4,12 9,17 20,6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="vpn-action-text">
              <strong>Выбрать другую сеть Wi-Fi</strong>
              <span>Если VPN настроен на уровне роутера</span>
            </div>
          </div>
        </div>

        <a href="/api/vpn-retry/" className="btn btn-primary vpn-retry">
          Попробовать ещё раз
          <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}
