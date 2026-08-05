import { siteContent } from '../data/siteContent'
import { usePublicContent } from '../hooks/usePublicContent'

export function AboutSection() {
  const { settings } = usePublicContent()
  const paragraphs = settings.aboutText.split(/\n{2,}/).filter(Boolean)
  return (
    <section className="about section" id="salon" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__visual" aria-hidden="true">
          <div className="about__arch">
            <span>MC</span>
          </div>
          <p>Un espacio para sentirte vos</p>
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
