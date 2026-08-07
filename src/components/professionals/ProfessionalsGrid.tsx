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
      <button
        className={`professional-any-option ${isAnySelected ? 'is-selected' : ''}`}
        type="button"
        aria-pressed={isAnySelected}
        onClick={onSelectAny}
      >
        <span className="professional-any-option__mark" aria-hidden="true">MC</span>
        <span className="professional-any-option__copy">
          <strong>Cualquiera disponible</strong>
          <small>El salón elige por vos.</small>
        </span>
        <span className="professional-any-option__state">
          {isAnySelected ? '✓ Seleccionada' : 'Elegir'}
        </span>
      </button>
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
