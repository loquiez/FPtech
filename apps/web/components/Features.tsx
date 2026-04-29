export default function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-num">
            <span className="bar" />06 / Возможности
          </div>
          <h2 className="h2">Спроектировано <em>под банк.</em></h2>
        </div>

        <div className="features">
          <div className="feature reveal">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M12 2l3 4 5 1-3.5 4 1 5-5.5-3-5.5 3 1-5L4 7l5-1z" />
              </svg>
            </div>
            <h3 className="feature-title">Индивидуальные настройки моделей</h3>
            <p className="feature-desc">
              Скоринговые модели и правила принятия решений — под политику вашего банка.
            </p>
          </div>

          <div className="feature reveal">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
            </div>
            <h3 className="feature-title">Постоянный мониторинг</h3>
            <p className="feature-desc">
              Непрерывное отслеживание десятков показателей. Оперативное информирование о рисках
              при отклонениях.
            </p>
          </div>

          <div className="feature reveal">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M4 7h16M4 12h16M4 17h10" />
                <path d="M17 14v6M14 17h6" />
              </svg>
            </div>
            <h3 className="feature-title">Быстрая интеграция с АБС</h3>
            <p className="feature-desc">
              REST API, готовые коннекторы для ЦФТ, Диасофт и других АБС. Пилот — за 2 недели.
            </p>
          </div>

          <div className="feature reveal">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="feature-title">Соответствие требованиям ИБ</h3>
            <p className="feature-desc">
              Локальное развёртывание, ФЗ-152, аттестация по требованиям безопасности банка.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
