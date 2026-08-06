export function ProfessionalsHero() {
  return (
    <section className="professionals-hero" aria-labelledby="professionals-title">
      <div className="container professionals-hero__grid">
        <div>
          <a className="catalog-back-link" href="/">
            <span aria-hidden="true">←</span> Volver al inicio
          </a>
          <p className="eyebrow">Nuestro equipo</p>
          <h1 id="professionals-title">Elegí tu profesional</h1>
        </div>
        <div className="professionals-hero__copy">
          <p>Conocé a nuestras especialistas y consultá disponibilidad.</p>
        </div>
      </div>
    </section>
  )
}
