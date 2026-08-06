import type { Professional } from '../../types/professional'
import type { Style } from '../../types/style'

interface FlowSelectionSummaryProps {
  style?: Style
  professional?: Professional
  anyProfessional?: boolean
}

export function FlowSelectionSummary({ style, professional, anyProfessional = false }: FlowSelectionSummaryProps) {
  const hasProfessional = Boolean(professional || anyProfessional)
  const complete = Boolean(style && hasProfessional)
  const params = new URLSearchParams()
  if (style) params.set('estilo', style.slug)
  if (professional) params.set('profesional', professional.slug)
  else if (anyProfessional) params.set('profesional', 'cualquiera')
  const consultationHref = `/consulta?${params.toString()}`
  const missingMessage = !style
    ? 'Elegí un estilo para continuar.'
    : !hasProfessional
      ? 'Elegí una profesional para continuar.'
      : ''

  return (
    <section className="flow-summary" aria-labelledby="flow-summary-title" aria-live="polite">
      <div>
        <p className="eyebrow">Tu selección</p>
        <h2 id="flow-summary-title">Revisá antes de continuar</h2>
        <dl>
          <div><dt>Estilo</dt><dd>{style?.name ?? 'Pendiente'}</dd></div>
          <div><dt>Profesional</dt><dd>{anyProfessional ? 'Cualquiera disponible' : professional?.name ?? 'Pendiente'}</dd></div>
        </dl>
        <div className="flow-summary__links">
          <a href={style ? `/estilos?seleccion=${style.slug}` : '/estilos'}>{style ? 'Cambiar estilo' : 'Elegir estilo'}</a>
          <a href={style ? `/profesionales?estilo=${style.slug}` : '/profesionales'}>{hasProfessional ? 'Cambiar profesional' : 'Elegir profesional'}</a>
        </div>
      </div>
      <div className="flow-summary__continue">
        {complete
          ? <a className="button button--dark" href={consultationHref}>Continuar</a>
          : <button className="button button--dark" type="button" disabled>Continuar</button>}
        {missingMessage && <small>{missingMessage}</small>}
      </div>
    </section>
  )
}
