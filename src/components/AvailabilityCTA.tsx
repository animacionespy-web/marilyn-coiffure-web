import { siteContent } from '../data/siteContent'

export function AvailabilityCTA() {
  return (
    <section className="availability section" id="contacto" aria-labelledby="availability-title">
      <div className="container">
        <div className="availability__card">
          <div className="availability__decoration" aria-hidden="true">M</div>
          <div className="availability__content">
            <p className="eyebrow">Tu momento empieza acá</p>
            <h2 id="availability-title">{siteContent.contact.title}</h2>
            <p>{siteContent.contact.description}</p>
          </div>
          <div className="availability__action">
            <a className="button button--light" href={siteContent.actions.availability.href}>
              {siteContent.actions.availability.label}
            </a>
            <small>{siteContent.contact.disclaimer}</small>
          </div>
        </div>
      </div>
    </section>
  )
}
