import { siteContent } from '../data/siteContent'

export function SpecialtyHighlights() {
  return (
    <section className="specialties section" id="servicios" aria-labelledby="specialties-title">
      <div className="container">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Nuestra esencia</p>
            <h2 id="specialties-title">Belleza pensada en cada detalle</h2>
          </div>
          <p>
            Servicios creados para acompañarte con sensibilidad, técnica y una mirada personalizada.
          </p>
        </div>

        <div className="specialty-grid">
          {siteContent.specialties.map((specialty) => (
            <article className="specialty-card" key={specialty.number}>
              <span className="specialty-card__number">{specialty.number}</span>
              <div>
                <h3>{specialty.title}</h3>
                <p>{specialty.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
