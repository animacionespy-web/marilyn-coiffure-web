import { siteContent } from '../data/siteContent'
import { usePublicContent } from '../hooks/usePublicContent'
import { PositionedImage } from './PositionedImage'

export function Hero() {
  const { settings } = usePublicContent()
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__ornament" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__content">
          <div className="hero__intro">
            <p className="eyebrow">Marilyn Coiffure · Villarrica</p>
            <h1 id="hero-title">{settings.heroTitle}</h1>
          </div>
          <div className="hero__details">
            <p className="hero__description hero__description--desktop">{settings.heroDescription}</p>
            <p className="hero__description hero__description--mobile">{siteContent.hero.mobileDescription}</p>
            <div className="hero__actions">
              <a className="button button--dark" href={siteContent.actions.availability.href}>
                {siteContent.actions.availability.label}
              </a>
              <a className="button hero__styles-button" href={siteContent.actions.styles.href}>
                {siteContent.actions.styles.label}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="hero__signature" aria-hidden="true">
              <span />
              Belleza que evoluciona con vos
            </div>
          </div>
        </div>

        <div className="hero__visual" aria-label="Fotografía de portada de Marilyn Coiffure">
          <div className="hero__frame">
            {settings.heroImageUrl ? <PositionedImage className="hero__photo" src={settings.heroImageUrl} alt="Fotografía de portada de Marilyn Coiffure" width="854" height="1280" fetchPriority="high" position={{ zoom: settings.heroImageZoom, positionX: settings.heroImagePositionX, positionY: settings.heroImagePositionY }} /> : <div className="hero__placeholder" role="img" aria-label={siteContent.hero.imagePlaceholder}>
              <span className="hero__placeholder-mark">M</span>
              <span className="hero__placeholder-copy">
                Fotografía
                <small>próximamente</small>
              </span>
            </div>}
          </div>
          <div className="hero__note">
            <span>Dueña</span>
            <strong>Marilyn</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
