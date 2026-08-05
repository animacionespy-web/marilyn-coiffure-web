import type { Professional } from '../../types/professional'
import { ProfessionalCard } from './ProfessionalCard'

interface ProfessionalsGridProps {
  professionals: Professional[]
  selectedProfessionalId?: string
  onSelect: (professional: Professional) => void
}

export function ProfessionalsGrid({ professionals, selectedProfessionalId, onSelect }: ProfessionalsGridProps) {
  return (
    <div className="professionals-grid">
      {professionals.map((professional) => (
        <ProfessionalCard
          professional={professional}
          isSelected={professional.id === selectedProfessionalId}
          onSelect={onSelect}
          key={professional.id}
        />
      ))}
    </div>
  )
}
