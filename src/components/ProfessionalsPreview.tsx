import { usePublicContent } from '../hooks/usePublicContent'
import { PublicContentState } from './PublicContentState'
import { PositionedImage } from './PositionedImage'

export function ProfessionalsPreview() {
  const { professionals, loading, error, retry } = usePublicContent()
  const visibleProfessionals = professionals
    .filter((professional) => professional.active)
    .sort((first, second) => Number(second.featured) - Number(first.featured) || first.order - second.order)
    .slice(0, 4)

  return (
    <section className="home-professionals section" id="equipo" aria-labelledby="home-professionals-title">
      <div className="container">
        <div className="section-heading home-professionals__heading" data-reveal>
          <p className="eyebrow">Equipo Marilyn</p>
          <h2 id="home-professionals-title">Las manos detrás de cada servicio.</h2>
          <p>Un equipo formado en conjunto, que trabaja con los mismos criterios.</p>
        </div>

        {visibleProfessionals.length === 0 ? (
          <PublicContentState loading={loading} error={error} empty="No hay profesionales publicadas todavía." onRetry={retry} />
        ) : (
          <div className="home-professionals__grid">
            {visibleProfessionals.map((professional) => (
              <article className="home-professional-card" key={professional.id} data-reveal>
                <div className="home-professional-card__image">
                  <PositionedImage src={professional.image} alt={professional.imageAlt} loading="lazy" width="640" height="760" position={professional.imagePosition} />
                </div>
                <div className="home-professional-card__body">
                  <p>{professional.specialties[0] || professional.role}</p>
                  <h3>{professional.name}</h3>
                  <div className="home-professional-card__actions">
                    <a className="button button--outline" href={`/profesionales/${encodeURIComponent(professional.slug)}`}>Ver trabajos</a>
                    <a className="button button--dark" href={`/profesionales?profesional=${encodeURIComponent(professional.slug)}`}>Elegir profesional</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="home-professionals__footer"><a className="button button--outline" href="/profesionales">Ver profesionales</a></div>
      </div>
    </section>
  )
}
