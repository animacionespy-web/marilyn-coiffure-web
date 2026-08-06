import { usePublicContent } from '../hooks/usePublicContent'
import { PublicContentState } from './PublicContentState'

export function ProfessionalsPreview() {
  const { professionals, loading, error, retry } = usePublicContent()
  const visibleProfessionals = professionals
    .filter((professional) => professional.active)
    .sort((first, second) => Number(second.featured) - Number(first.featured) || first.order - second.order)
    .slice(0, 3)

  return (
    <section className="home-professionals section" aria-labelledby="home-professionals-title">
      <div className="container">
        <div className="section-heading home-professionals__heading">
          <p className="eyebrow">Especialistas</p>
          <h2 id="home-professionals-title">Conocé a cada profesional</h2>
          <p>Elegí a la profesional ideal según el servicio que buscás.</p>
        </div>

        {visibleProfessionals.length === 0 ? (
          <PublicContentState loading={loading} error={error} empty="No hay profesionales publicadas todavía." onRetry={retry} />
        ) : (
          <div className="home-professionals__grid">
            {visibleProfessionals.map((professional) => (
              <article className="home-professional-card" key={professional.id}>
                <div className="home-professional-card__image">
                  <img src={professional.image} alt={professional.imageAlt} loading="lazy" width="640" height="760" />
                </div>
                <div className="home-professional-card__body">
                  <p>{professional.specialties[0] || professional.role}</p>
                  <h3>{professional.name}</h3>
                  <a className="button button--dark" href="/profesionales">Elegir profesional</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
