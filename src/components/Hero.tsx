import { siteContent } from '../data/siteContent'

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__ornament" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="eyebrow">{siteContent.hero.eyebrow}</p>
          <h1 id="hero-title">{siteContent.hero.title}</h1>
          <p className="hero__description">{siteContent.hero.description}</p>
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

        <div className="hero__visual" aria-label={siteContent.hero.imagePlaceholder}>
          <div className="hero__frame">
            <div className="hero__placeholder" role="img" aria-label={siteContent.hero.imagePlaceholder}>
              <span className="hero__placeholder-mark">M</span>
              <span className="hero__placeholder-copy">
                Fotografía
                <small>próximamente</small>
              </span>
            </div>
          </div>
          <div className="hero__note">
            <span>Fotografía oficial</span>
            <strong>Espacio preparado</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
