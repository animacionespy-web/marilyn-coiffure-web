import type { Professional } from '../../types/professional'

interface ProfessionalCardProps {
  professional: Professional
  isSelected: boolean
  onSelect: (professional: Professional) => void
}

export function ProfessionalCard({ professional, isSelected, onSelect }: ProfessionalCardProps) {
  return (
    <article className={`professional-card ${isSelected ? 'is-selected' : ''}`}>
      <div className="professional-card__image">
        <img
          src={professional.image}
          alt={professional.imageAlt}
          loading="lazy"
          width="640"
          height="760"
        />
        {professional.featured && <span>Especialista destacada</span>}
      </div>
      <div className="professional-card__body">
        <p className="professional-card__role">{professional.role}</p>
        <h2>{professional.name}</h2>
        <p>{professional.shortDescription}</p>
        <ul className="professional-specialties" aria-label={`Especialidades de ${professional.name}`}>
          {professional.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
        </ul>
        <details className="professional-card__details">
          <summary>Conocer más</summary>
          <p>{professional.fullDescription}</p>
          {professional.scheduleNote && <small>{professional.scheduleNote}</small>}
        </details>
        <button
          className={`button ${isSelected ? 'button--selected' : 'button--dark'}`}
          type="button"
          aria-pressed={isSelected}
          onClick={() => onSelect(professional)}
        >
          {isSelected ? 'Profesional elegida' : 'Elegir profesional'}
        </button>
      </div>
    </article>
  )
}
