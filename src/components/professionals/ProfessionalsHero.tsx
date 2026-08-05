export function ProfessionalsHero() {
  return (
    <section className="professionals-hero" aria-labelledby="professionals-title">
      <div className="container professionals-hero__grid">
        <div>
          <a className="catalog-back-link" href="/">
            <span aria-hidden="true">←</span> Volver al inicio
          </a>
          <p className="eyebrow">Nuestro equipo</p>
          <h1 id="professionals-title">Elegí la profesional ideal para vos</h1>
        </div>
        <div className="professionals-hero__copy">
          <p>
            Conocé a nuestras especialistas y seleccioná la profesional con la que querés consultar disponibilidad.
          </p>
          <small>
            La elección de una profesional no confirma el turno. La disponibilidad será consultada por WhatsApp.
          </small>
        </div>
      </div>
    </section>
  )
}
