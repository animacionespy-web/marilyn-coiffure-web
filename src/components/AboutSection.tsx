import { siteContent } from '../data/siteContent'
import { usePublicContent } from '../hooks/usePublicContent'

export function AboutSection() {
  const { settings } = usePublicContent()
  const paragraphs = settings.aboutText.split(/\n{2,}/).filter(Boolean)
  return (
    <section className="about section" id="esencia" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__content" data-reveal>
          <div className="about__heading">
            <p className="eyebrow">{siteContent.about.eyebrow}</p>
            <h2 id="about-title">{settings.aboutTitle}</h2>
          </div>
          <div className="about__copy">
            {(paragraphs.length ? paragraphs : siteContent.about.paragraphs).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="quality-list" aria-label="Valores del salón">
            {siteContent.about.qualities.map((quality) => (
              <li key={quality.title}>
                <div><strong>{quality.title}</strong><small>{quality.description}</small></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
