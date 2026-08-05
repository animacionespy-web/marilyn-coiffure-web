import type { ConsultationSelection } from '../../types/consultation'

interface SelectionSummaryProps {
  selection: ConsultationSelection
}

export function SelectionSummary({ selection }: SelectionSummaryProps) {
  const professionalName = selection.anyProfessional || !selection.professional
    ? 'Cualquiera disponible'
    : selection.professional.name
  const primarySpecialty = selection.professional?.specialties[0]
  const professionalHref = selection.style
    ? `/profesionales?estilo=${selection.style.slug}`
    : '/profesionales'

  return (
    <section className="consultation-selection" aria-labelledby="consultation-selection-title">
      <div className="consultation-selection__visuals">
        {selection.style ? (
          <img src={selection.style.image} alt={selection.style.imageAlt} width="170" height="200" />
        ) : (
          <div className="consultation-selection__placeholder" aria-hidden="true">✦</div>
        )}
        {selection.professional && !selection.anyProfessional && (
          <img src={selection.professional.image} alt="" width="170" height="200" />
        )}
      </div>
      <div className="consultation-selection__details">
        <p className="eyebrow">Tu consulta</p>
        <h2 id="consultation-selection-title">Revisá tu selección</h2>
        <dl>
          <div>
            <dt>Servicio</dt>
            <dd>{selection.style?.name ?? 'Servicio por definir'}</dd>
          </div>
          <div>
            <dt>Profesional</dt>
            <dd>{professionalName}</dd>
            {primarySpecialty && <small>{primarySpecialty}</small>}
          </div>
        </dl>
      </div>
      <div className="consultation-selection__actions">
        <a className="button button--outline" href="/estilos">Cambiar estilo</a>
        <a className="context-link" href={professionalHref}>Cambiar profesional</a>
      </div>
    </section>
  )
}
