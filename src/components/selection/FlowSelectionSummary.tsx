import type { Ref } from 'react'
import type { Professional } from '../../types/professional'
import type { Style } from '../../types/style'

interface FlowSelectionSummaryProps {
  style?: Style
  professional?: Professional
  anyProfessional?: boolean
  sectionRef?: Ref<HTMLElement>
}

export function FlowSelectionSummary({ style, professional, anyProfessional = false, sectionRef }: FlowSelectionSummaryProps) {
  const hasProfessional = Boolean(professional || anyProfessional)
  const complete = Boolean(style && hasProfessional)
  const params = new URLSearchParams()
  if (style) params.set('estilo', style.slug)
  if (professional) params.set('profesional', professional.slug)
  else if (anyProfessional) params.set('profesional', 'cualquiera')
  const consultationHref = `/consulta?${params.toString()}`
  const professionalParam = anyProfessional ? 'cualquiera' : professional?.slug
  const styleHref = professionalParam ? `/estilos?profesional=${professionalParam}&focus=selector` : '/estilos?focus=selector'
  const professionalHref = style ? `/profesionales?estilo=${style.slug}&focus=selector` : '/profesionales?focus=selector'
  const missingMessage = !style
    ? 'Elegí un estilo para continuar.'
    : !hasProfessional
      ? 'Elegí una profesional para continuar.'
      : ''

  return (
    <section className="flow-summary" aria-labelledby="flow-summary-title" aria-live="polite" ref={sectionRef}>
      <div>
        <h2 id="flow-summary-title">Tu selección</h2>
        <dl>
          <div><dt>Estilo</dt><dd>{style?.name ?? 'Pendiente'}</dd></div>
          <div><dt>Profesional</dt><dd>{anyProfessional ? 'Cualquiera disponible' : professional?.name ?? 'Pendiente'}</dd></div>
        </dl>
        <div className="flow-summary__links">
          <a href={styleHref}>{style ? 'Cambiar estilo' : 'Elegir estilo'}</a>
          <a href={professionalHref}>{hasProfessional ? 'Cambiar profesional' : 'Elegir profesional'}</a>
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
