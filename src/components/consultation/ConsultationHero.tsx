import { siteConfig } from '../../config/site'

export function ConsultationHero() {
  return (
    <section className="consultation-hero" aria-labelledby="consultation-title">
      <div className="container consultation-hero__grid">
        <div>
          <a className="catalog-back-link" href="/profesionales">
            <span aria-hidden="true">←</span> Volver a profesionales
          </a>
          <p className="eyebrow">Consulta de turno</p>
          <h1 id="consultation-title">Consultá disponibilidad</h1>
        </div>
        <div className="consultation-hero__copy">
          <p>Completá tus datos y enviaremos la consulta por WhatsApp a la profesional seleccionada.</p>
          <small>{siteConfig.consultation.disclaimer}</small>
        </div>
      </div>
    </section>
  )
}
