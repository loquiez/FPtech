export default function Aggregation() {
  return (
    <section className="section" id="product">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-num">
            <span className="bar" />03 / Агрегация
          </div>
          <h2 className="h2">Печатные формы отчётов — <em>в одном окне.</em></h2>
        </div>

        <div className="split">
          <div className="split-copy reveal">
            <p>
              Сотрудники банка больше не собирают отчёты вручную. FPtech формирует печатные формы:
              данные централизованно консолидируются и проходят контроль целостности из всех
              подключённых источников, шаблон заполняется одним кликом.
            </p>
            <ul className="split-list">
              <li><span className="idx">01</span><span>Заключение службы безопасности</span></li>
              <li><span className="idx">02</span><span>Профессиональное суждение о контрагенте</span></li>
              <li><span className="idx">03</span><span>Форма проверки физических лиц</span></li>
              <li><span className="idx">04</span><span>Отчёт по результатам мониторинга</span></li>
              <li><span className="idx">05</span><span>Отчёты по санкциям, залогам и реестрам</span></li>
            </ul>
          </div>

          <div className="doc-stack reveal" aria-hidden="true">
            <div className="doc doc-3" />
            <div className="doc doc-2" />
            <div className="doc doc-1">
              <div className="doc-head">
                <div className="doc-title">Профессиональное суждение</div>
                <div className="doc-meta">FP-PS-0284</div>
              </div>
              <div className="doc-row">
                <span className="lbl">Контрагент</span>
                <span className="val">ООО «Атлант-Трейд»</span>
              </div>
              <div className="doc-row">
                <span className="lbl">ИНН</span>
                <span className="val">7701234567</span>
              </div>
              <div className="doc-row">
                <span className="lbl">Проверка в реестре ТБ-ФЗ</span>
                <span className="val ok">✓ пройдена</span>
              </div>
              <div className="doc-row">
                <span className="lbl">Санкционные списки</span>
                <span className="val ok">✓ чисто</span>
              </div>
              <div className="doc-row">
                <span className="lbl">Регрессные требования</span>
                <span className="val warn">! 1 позиция</span>
              </div>
              <div className="doc-row">
                <span className="lbl">НБКИ — скоринг</span>
                <span className="val">742 / 1000</span>
              </div>
              <div className="doc-row">
                <span className="lbl">Аффилированные лица</span>
                <span className="val">12 связей</span>
              </div>
              <div className="doc-stamp">Готово 00:04</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
