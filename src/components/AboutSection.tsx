import { siteContent } from '../data/siteContent'
import { usePublicContent } from '../hooks/usePublicContent'
import { AboutImageVisual } from './AboutImageVisual'

export function AboutSection() {
  const { settings } = usePublicContent()
  const paragraphs = settings.aboutText.split(/\n{2,}/).filter(Boolean)
  return (
    <section className="about section" id="salon" aria-labelledby="about-title">
      <div className="container about__grid">
        <div aria-hidden="true">
          <AboutImageVisual
            imageUrl={settings.footerImageUrl}
            imageAlt="Imagen del salón Marilyn Coiffure"
            position={{ zoom: settings.footerImageZoom, positionX: settings.footerImagePositionX, positionY: settings.footerImagePositionY }}
          />
        </div>

        <div className="about__content">
          <p className="eyebrow">{siteContent.about.eyebrow}</p>
          <h2 id="about-title">{settings.aboutTitle}</h2>
          {(paragraphs.length ? paragraphs : siteContent.about.paragraphs).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className="quality-list" aria-label="Valores del salón">
            {siteContent.about.qualities.map((quality) => (
              <li key={quality}>
                <span aria-hidden="true">✦</span>
                {quality}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
