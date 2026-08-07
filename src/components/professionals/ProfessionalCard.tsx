import type { Professional } from '../../types/professional'
import { PositionedImage } from '../PositionedImage'

interface ProfessionalCardProps {
  professional: Professional
  isSelected: boolean
  isRecommended: boolean
  onSelect: (professional: Professional) => void
}

export function ProfessionalCard({ professional, isSelected, isRecommended, onSelect }: ProfessionalCardProps) {
  return (
    <article className={`professional-card ${isSelected ? 'is-selected' : ''}`}>
      <div className="professional-card__image">
        <PositionedImage
          src={professional.image}
          alt={professional.imageAlt}
          loading="lazy"
          width="640"
          height="760"
          position={professional.imagePosition}
        />
        {isRecommended ? <span>Recomendada para este estilo</span> : professional.featured && <span>Especialista destacada</span>}
      </div>
      <div className="professional-card__body">
        <p className="professional-card__role">{professional.role}</p>
        <h2>{professional.name}</h2>
        <ul className="professional-card__specialties" aria-label={`Especialidades de ${professional.name}`}>{professional.specialties.slice(0, 2).map((specialty) => <li key={specialty}>{specialty}</li>)}</ul>
        <button
          className={`button ${isSelected ? 'button--selected' : 'button--dark'}`}
          type="button"
          aria-pressed={isSelected}
          onClick={() => onSelect(professional)}
        >
          {isSelected ? '✓ Seleccionada' : 'Elegir profesional'}
        </button>
      </div>
    </article>
  )
}
