import type { Professional } from '../../types/professional'
import { ProfessionalCard } from './ProfessionalCard'

interface ProfessionalsGridProps {
  professionals: Professional[]
  selectedProfessionalId?: string
  selectedStyleId?: string
  isAnySelected?: boolean
  onSelect: (professional: Professional) => void
  onSelectAny: () => void
}

export function ProfessionalsGrid({ professionals, selectedProfessionalId, selectedStyleId, isAnySelected = false, onSelect, onSelectAny }: ProfessionalsGridProps) {
  return (
    <div className="professionals-grid">
      <article className={`professional-card professional-card--any ${isAnySelected ? 'is-selected' : ''}`}>
        <div className="professional-card__image professional-card__any-visual"><span aria-hidden="true">MC</span></div>
        <div className="professional-card__body"><h2>Cualquiera disponible</h2><p className="professional-card__any-copy">El salón elegirá una profesional disponible.</p><button className={`button ${isAnySelected ? 'button--selected' : 'button--dark'}`} type="button" aria-pressed={isAnySelected} onClick={onSelectAny}>{isAnySelected ? '✓ Seleccionada' : 'Elegir opción'}</button></div>
      </article>
      {professionals.map((professional) => (
        <ProfessionalCard
          professional={professional}
          isSelected={professional.id === selectedProfessionalId}
          isRecommended={Boolean(selectedStyleId && professional.styleIds?.includes(selectedStyleId))}
          onSelect={onSelect}
          key={professional.id}
        />
      ))}
    </div>
  )
}
