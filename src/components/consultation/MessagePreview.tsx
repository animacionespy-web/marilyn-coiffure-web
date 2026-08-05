import type { WhatsappRecipient } from '../../types/consultation'

interface MessagePreviewProps {
  message: string
  recipient: WhatsappRecipient
}

export function MessagePreview({ message, recipient }: MessagePreviewProps) {
  return (
    <aside className="message-preview" aria-labelledby="message-preview-title">
      <div className="message-preview__heading">
        <p className="eyebrow">Vista previa</p>
        <h2 id="message-preview-title">Así se enviará tu mensaje</h2>
        <p>Destinatario: <strong>{recipient.label}</strong></p>
      </div>
      <div className="message-preview__bubble" aria-live="polite">{message}</div>
      <small>El contenido se abrirá en WhatsApp para que puedas revisarlo antes de enviarlo.</small>
    </aside>
  )
}
