import { siteContent } from '../data/siteContent'
import { usePublicContent } from '../hooks/usePublicContent'
import { PositionedImage } from './PositionedImage'

export function Hero() {
  const { settings } = usePublicContent()
  const titleParts = settings.heroTitle.split(/(evoluciona)/i)

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__background" aria-hidden={!settings.heroImageUrl}>
        {settings.heroImageUrl ? (
          <PositionedImage className="hero__photo" src={settings.heroImageUrl} alt="" width="854" height="1280" fetchPriority="high" position={{ zoom: settings.heroImageZoom, positionX: settings.heroImagePositionX, positionY: settings.heroImagePositionY }} />
        ) : (
          <div className="hero__placeholder" role="img" aria-label={siteContent.hero.imagePlaceholder} />
        )}
      </div>
      <div className="hero__content">
        <img className="hero__logo" src="/images/brand/marilyn-coiffure-logo-white-clean.png" alt="Marilyn Coiffure" width="706" height="218" />
        <h1 id="hero-title">
          {titleParts.map((part, index) => part.toLocaleLowerCase('es') === 'evoluciona' ? <em key={`${part}-${index}`}>{part}</em> : part)}
        </h1>
        <p className="hero__description">{settings.heroDescription}</p>
        <div className="hero__actions">
          <a className="button button--dark" href={siteContent.actions.availability.href}>
            {siteContent.actions.availability.label} <span aria-hidden="true">→</span>
          </a>
          <a className="button hero__styles-button" href="/#servicios">
            Conocer nuestros servicios
          </a>
        </div>
      </div>
      <div className="hero__scroll-cue" aria-hidden="true"><i /> Deslizá</div>
    </section>
  )
}
