import { siteContent } from '../data/siteContent'
import { usePublicContent } from '../hooks/usePublicContent'

export function Hero() {
  const { settings } = usePublicContent()
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__ornament" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="eyebrow">{siteContent.hero.eyebrow}</p>
          <h1 id="hero-title">{settings.heroTitle}</h1>
          <p className="hero__description">{settings.heroDescription}</p>
          <div className="hero__actions">
            <a className="button button--dark" href={siteContent.actions.availability.href}>
              {siteContent.actions.availability.label}
            </a>
            <a className="text-link" href={siteContent.actions.styles.href}>
              {siteContent.actions.styles.label}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero__signature" aria-hidden="true">
            <span />
            Cuidado que se nota
          </div>
        </div>

        <div className="hero__visual" aria-label="Fotografía de portada de Marilyn Coiffure">
          <div className="hero__frame">
            {settings.heroImageUrl ? <img className="hero__photo" src={settings.heroImageUrl} alt="Fotografía de portada de Marilyn Coiffure" width="854" height="1280" fetchPriority="high" /> : <div className="hero__placeholder" role="img" aria-label={siteContent.hero.imagePlaceholder}>
              <span className="hero__placeholder-mark">M</span>
              <span className="hero__placeholder-copy">
                Fotografía
                <small>próximamente</small>
              </span>
            </div>}
          </div>
          <div className="hero__note">
            <span>Fotografía oficial</span>
            <strong>Imagen de portada</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
