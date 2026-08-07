import type { Professional } from '../../types/professional'
import type { Style } from '../../types/style'
import { PositionedImage } from '../PositionedImage'

interface SelectedProfessionalSummaryProps {
  professional?: Professional
  isAnyProfessional?: boolean
  style?: Style
}

export function SelectedProfessionalSummary({ professional, isAnyProfessional = false, style }: SelectedProfessionalSummaryProps) {
  const params = new URLSearchParams({ profesional: isAnyProfessional ? 'cualquiera' : professional?.slug ?? 'cualquiera' })
  if (style) params.set('estilo', style.slug)

  return (
    <section
      className="selected-professional"
      id="profesional-seleccionada"
      aria-live="polite"
      aria-labelledby="selected-professional-title"
    >
      {professional
        ? <PositionedImage src={professional.image} alt="" width="220" height="260" position={professional.imagePosition} />
        : <div className="selected-professional__any-mark" aria-hidden="true">✦</div>}
      <div>
        <p className="eyebrow">Selección guardada temporalmente</p>
        <h2 id="selected-professional-title">
          {isAnyProfessional ? 'Elegiste cualquiera disponible' : `Elegiste a ${professional?.name}`}
        </h2>
        <p>
          {style
            ? `Tu consulta conservará el estilo “${style.name}”. En el próximo paso vas a poder indicar tus preferencias de horario.`
            : 'En el próximo paso vas a poder indicar el servicio que te interesa y tus preferencias de horario.'}
        </p>
        <div className="selected-professional__actions">
          <a className="button button--light" href={`/consulta?${params.toString()}`}>
            Continuar
          </a>
          <small>La solicitud no constituye una reserva confirmada.</small>
        </div>
      </div>
    </section>
  )
}
