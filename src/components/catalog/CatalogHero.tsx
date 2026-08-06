export function CatalogHero() {
  return (
    <section className="catalog-hero" aria-labelledby="catalog-title">
      <div className="container catalog-hero__grid">
        <div>
          <a className="catalog-back-link" href="/">
            <span aria-hidden="true">←</span> Volver al inicio
          </a>
          <p className="eyebrow">Catálogo</p>
          <h1 id="catalog-title">Elegí tu estilo</h1>
        </div>
        <div className="catalog-hero__copy">
          <p>Explorá cortes, coloración, peinados y tratamientos.</p>
        </div>
      </div>
    </section>
  )
}
