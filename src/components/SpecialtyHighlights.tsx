import { siteContent } from '../data/siteContent'
import { usePublicContent } from '../hooks/usePublicContent'

export function SpecialtyHighlights() {
  const { settings } = usePublicContent()
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
          {(settings.specialties.length ? settings.specialties : siteContent.specialties).map((specialty, index) => (
            <article className="specialty-card" key={`${specialty.title}-${index}`}>
              <span className="specialty-card__number">{String(index + 1).padStart(2, '0')}</span>
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
