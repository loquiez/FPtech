export default function Contacts() {
  return (
    <section className="contacts" id="contacts">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-num">
            <span className="bar" />07 / Контакты
          </div>
          <h2 className="h2">Связаться <em>напрямую.</em></h2>
        </div>

        <div className="contacts-grid contacts-grid--two">
          <div className="contact-col reveal">
            <h4>Поддержка клиентов</h4>
            <a className="line-val" href="mailto:ceofp@pharmapi.net">ceofp@pharmapi.net</a>
            <p>Круглосуточно, приоритет по SLA для действующих клиентов.</p>
          </div>

          <div className="contact-col reveal">
            <h4>Офис</h4>
            <p>г. Москва, муниципальный округ Пресненский, наб. Пресненская, д. 12</p>
            <p className="addr-small">Встречи по предварительной записи.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
