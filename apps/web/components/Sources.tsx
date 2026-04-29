export default function Sources() {
  return (
    <section id="sources">
      <div className="dark-block">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-num">
              <span className="bar" />02 / Источники
            </div>
            <h2 className="h2">
              Контроль санкционных и&nbsp;<em>международных рисков</em> — в&nbsp;одном окне.
            </h2>
          </div>

          <p className="reveal" style={{ maxWidth: 720, color: 'var(--on-inverse-muted)', fontSize: 18, lineHeight: 1.6, margin: '0 0 32px' }}>
            FPtech собирает данные из российских и зарубежных источников: международные санкционные
            списки, реестры аффилированных лиц, иностранные структуры собственности и связи между
            юрисдикциями.
          </p>

          <div className="sanctions-grid reveal">
            <div className="sanc-cell">
              <div className="sanc-num">01</div>
              <div className="sanc-title">Международные санкционные списки</div>
              <div className="sanc-desc">
                OFAC, ЕС, ООН, UK HMT и национальные реестры — единый поиск по всем спискам одновременно.
              </div>
            </div>
            <div className="sanc-cell">
              <div className="sanc-num">02</div>
              <div className="sanc-title">Аффилированность</div>
              <div className="sanc-desc">
                Цепочки бенефициаров и связанных лиц — в том числе через зарубежные юрисдикции.
              </div>
            </div>
            <div className="sanc-cell">
              <div className="sanc-num">03</div>
              <div className="sanc-title">Иностранные структуры</div>
              <div className="sanc-desc">
                Связи с офшорами и трансграничные владельческие схемы — с прозрачным аудитом источников.
              </div>
            </div>
            <div className="sanc-cell">
              <div className="sanc-num">04</div>
              <div className="sanc-title">Риски обхода ограничений</div>
              <div className="sanc-desc">
                Подсветка непрямых связей и схем, которые могут указывать на обход санкционных режимов.
              </div>
            </div>
          </div>

          <div className="sources reveal">
            <div className="source"><span className="name">Контур.Фокус</span><span className="tag">коммерч.</span></div>
            <div className="source"><span className="name">Контур.Призма</span><span className="tag">AML</span></div>
            <div className="source"><span className="name">Контур.Компас</span><span className="tag">B2B</span></div>
            <div className="source"><span className="name">Seldon Basis</span><span className="tag">коммерч.</span></div>
            <div className="source"><span className="name">Ирбис&nbsp;Аналитика</span><span className="tag">аналитика</span></div>
            <div className="source"><span className="name">НБКИ</span><span className="tag">бюро</span></div>
            <div className="source"><span className="name">Чёрные списки&nbsp;банков</span><span className="tag">risk</span></div>
            <div className="source"><span className="name">Регрессные требования</span><span className="tag">risk</span></div>
            <div className="source"><span className="name">Реестр ТБ-ФЗ</span><span className="tag">гос.</span></div>
            <div className="source"><span className="name">Санкционные реестры</span><span className="tag">AML</span></div>
            <div className="source"><span className="name">Залоги&nbsp;и&nbsp;обременения</span><span className="tag">гос.</span></div>
            <div className="source"><span className="name">+&nbsp;ваши&nbsp;внутренние базы</span><span className="tag">custom</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
