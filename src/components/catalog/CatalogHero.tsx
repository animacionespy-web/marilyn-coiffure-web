export function CatalogHero() {
  return (
    <section className="catalog-hero" aria-labelledby="catalog-title">
      <div className="container catalog-hero__grid">
        <div>
          <a className="catalog-back-link" href="/">
            <span aria-hidden="true">←</span> Volver al inicio
          </a>
          <p className="eyebrow">Catálogo de estilos</p>
          <h1 id="catalog-title">Elegí el estilo ideal para vos</h1>
        </div>
        <div className="catalog-hero__copy">
          <p>
            Explorá cortes, colores, peinados y tratamientos. Seleccioná el estilo que te interesa y luego consultá disponibilidad.
          </p>
          <small>
            Las imágenes son referencias. El resultado puede variar según el tipo, estado y largo del cabello.
          </small>
        </div>
      </div>
    </section>
  )
}
