import { usePublicContent } from '../hooks/usePublicContent'
import { PositionedImage } from './PositionedImage'

export function SpecialtyHighlights() {
  const { settings } = usePublicContent()
  return (
    <section className="home-visual-services section" id="servicios" aria-labelledby="specialties-title">
      <div className="container">
        <div className="section-heading section-heading--split" data-reveal>
          <div>
            <p className="eyebrow">Servicios</p>
            <h2 id="specialties-title">Todo lo que hacemos, hecho con criterio.</h2>
          </div>
          <p>Cada área tiene su propio diagnóstico, su técnica y una recomendación pensada para tu cabello.</p>
        </div>

        <div className="home-visual-services__grid">
          {settings.homeVisualBlocks.map((block, index) => (
            <article className={`home-visual-service home-visual-service--${index + 1}`} key={block.id} data-reveal>
              <a className="home-visual-service__image" href={block.href} aria-label={`Ver ${block.title}`}>
                <PositionedImage src={block.imageUrl} alt={`Referencia visual de ${block.title}`} loading="lazy" width="900" height="1080" position={block.imagePosition} />
                <div className="home-visual-service__content">
                  <p>{String(index + 1).padStart(2, '0')}</p>
                  <h3>{block.title}</h3>
                  <span>{block.text}</span>
                  <strong>Explorar <span aria-hidden="true">→</span></strong>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
