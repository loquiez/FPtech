export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid-lines" />
        <div className="hero-glow" />
      </div>

      <div className="container hero-inner">
        <div className="eyebrow reveal">
          <span className="dot" />
          Для банков и финансовых организаций
        </div>

        <h1 className="h1 reveal">
          <span className="line"><span>Система выявления рисков</span></span>
          <span className="line"><span>на <em>международном</em> уровне</span></span>
        </h1>

        <p className="hero-sub reveal">
          Проверка контрагентов и физических лиц не только в России, но и за её пределами.
          Санкционные риски, трансграничные связи и скрытые зависимости — в одном отчёте.
        </p>

        <div className="hero-cta reveal">
          <a className="btn btn-primary" href="#cta">
            Запросить демо
            <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a className="btn btn-ghost" href="#product">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="6,4 20,12 6,20" />
            </svg>
            Как это работает
          </a>
        </div>

        <div className="hero-stats reveal">
          <div className="hero-stat">
            <div>
              <div className="hs-val">Глобальный</div>
              <div className="hs-unit">охват</div>
            </div>
            <div className="hs-lbl">компании и физлица по всему миру</div>
          </div>
          <div className="hero-stat">
            <div>
              <div className="hs-val">Десятки</div>
              <div className="hs-unit">источников</div>
            </div>
            <div className="hs-lbl">коммерческие, государственные, бюро, внутренние базы</div>
          </div>
          <div className="hero-stat">
            <div>
              <div className="hs-val" style={{ fontFamily: 'var(--font-display), sans-serif' }}>24 / 7</div>
              <div className="hs-unit">мониторинг</div>
            </div>
            <div className="hs-lbl">непрерывное отслеживание и оперативное информирование о рисках</div>
          </div>
          <div className="hero-stat">
            <div>
              <div className="hs-val">Один</div>
              <div className="hs-unit">отчёт</div>
            </div>
            <div className="hs-lbl">вся проверка — в одном документе</div>
          </div>
        </div>
      </div>
    </header>
  );
}
