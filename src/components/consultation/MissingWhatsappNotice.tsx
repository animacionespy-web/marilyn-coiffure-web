import { siteConfig } from '../../config/site'

export function MissingWhatsappNotice() {
  return (
    <div className="missing-whatsapp-notice" role="status">
      <span aria-hidden="true">!</span>
      <div>
        <strong>Configuración de WhatsApp pendiente</strong>
        <p>{siteConfig.consultation.missingRecipient}</p>
      </div>
    </div>
  )
}
