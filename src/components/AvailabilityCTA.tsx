import { siteContent } from '../data/siteContent'
import { usePublicContent } from '../hooks/usePublicContent'

export function AvailabilityCTA() {
  const { settings } = usePublicContent()
  return (
    <section className="availability section" id="contacto" aria-labelledby="availability-title">
      <div className="container">
        <div className="availability__card">
          <div className="availability__decoration" aria-hidden="true">M</div>
          <div className="availability__content">
            <p className="eyebrow">Tu momento empieza acá</p>
            <h2 id="availability-title">{settings.ctaTitle}</h2>
            <p>{settings.ctaDescription}</p>
          </div>
          <div className="availability__action">
            <a className="button button--light" href={siteContent.actions.availability.href}>
              {siteContent.actions.availability.label}
            </a>
            <small>{settings.formDisclaimer}</small>
          </div>
        </div>
      </div>
    </section>
  )
}
