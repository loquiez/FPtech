function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 8v5M12 17h.01M4 20h16L12 4z" />
    </svg>
  );
}

export default function CrossCheck() {
  return (
    <section className="section xcheck-section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head reveal">
          <div className="section-num">
            <span className="bar" />04 / Перекрёстная проверка
          </div>
          <h2 className="h2">Сверяем источники между собой — <em>и находим несоответствия.</em></h2>
        </div>

        <div className="split">
          <div className="xcheck reveal" aria-hidden="true">
            <div className="xc-head">
              <div className="xc-head-row">
                <span className="xc-tag">cross-check</span>
                <span className="xc-title">ООО «Атлант-Трейд» · ИНН 7701234567</span>
                <span className="xc-live">
                  <span className="xc-live-dot" />live
                </span>
              </div>
              <div className="xc-progress">
                <span className="xc-progress-fill" />
              </div>
            </div>

            <div className="xc-rows">
              <div className="xc-row ok">
                <div className="xc-param">Наименование</div>
                <div className="xc-sources">
                  <span className="xc-chip">Контур.Фокус</span>
                  <span className="xc-chip">ЕГРЮЛ</span>
                  <span className="xc-chip">НБКИ</span>
                </div>
                <div className="xc-status"><CheckIcon /><span>совпадение</span></div>
              </div>

              <div className="xc-row ok">
                <div className="xc-param">Адрес регистрации</div>
                <div className="xc-sources">
                  <span className="xc-chip">ЕГРЮЛ</span>
                  <span className="xc-chip">ФНС</span>
                  <span className="xc-chip">Фокус</span>
                </div>
                <div className="xc-status"><CheckIcon /><span>совпадение</span></div>
              </div>

              <div className="xc-row warn">
                <div className="xc-param">Выручка 2024</div>
                <div className="xc-sources">
                  <span className="xc-chip">Фокус <b>4.2 млрд</b></span>
                  <span className="xc-chip">НБКИ <b>3.9 млрд</b></span>
                </div>
                <div className="xc-status"><WarnIcon /><span>расхождение</span></div>
              </div>

              <div className="xc-row ok">
                <div className="xc-param">Санкционные списки</div>
                <div className="xc-sources">
                  <span className="xc-chip">OFAC</span>
                  <span className="xc-chip">ЕС</span>
                  <span className="xc-chip">Призма</span>
                </div>
                <div className="xc-status"><CheckIcon /><span>чисто</span></div>
              </div>

              <div className="xc-row warn">
                <div className="xc-param">Регрессные требования</div>
                <div className="xc-sources">
                  <span className="xc-chip">Реестр ТБ-ФЗ <b>1 запись</b></span>
                  <span className="xc-chip muted">НБКИ <b>нет данных</b></span>
                </div>
                <div className="xc-status"><WarnIcon /><span>пропуск</span></div>
              </div>

              <div className="xc-row ok">
                <div className="xc-param">Бенефициары</div>
                <div className="xc-sources">
                  <span className="xc-chip">ЕГРЮЛ</span>
                  <span className="xc-chip">Компас</span>
                  <span className="xc-chip">Ирбис</span>
                </div>
                <div className="xc-status"><CheckIcon /><span>совпадение</span></div>
              </div>
            </div>

            <div className="xc-foot">
              <div className="xc-summary">
                <span className="xc-metric"><b>6</b> параметров</span>
                <span className="xc-metric"><b style={{ color: '#29C76F' }}>4</b> совпадений</span>
                <span className="xc-metric"><b style={{ color: '#FFB547' }}>2</b> требуют внимания</span>
              </div>
              <div className="xc-time">обновлено&nbsp;·&nbsp;00:04</div>
            </div>
          </div>

          <div className="split-copy reveal">
            <p>
              Каждая запись сопоставляется с аналогом из других баз. FPtech выявляет и
              классифицирует расхождения — от ошибок в ИНН до скрытых санкционных попаданий —
              и формирует достоверную картину по контрагенту.
            </p>
            <ul className="split-list">
              <li>
                <span className="idx">→</span>
                <span>Выявление несоответствий между коммерческими и государственными источниками</span>
              </li>
              <li>
                <span className="idx">→</span>
                <span>Детекция потенциальных рисков до их попадания в отчёт</span>
              </li>
              <li>
                <span className="idx">→</span>
                <span>Полный аудит: откуда пришли данные, когда обновлены, что изменилось</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
