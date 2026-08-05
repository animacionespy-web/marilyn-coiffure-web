import { professionalFilters } from '../../data/professionals'
import type { ProfessionalSpecialtyFilter } from '../../types/professional'

interface ProfessionalFiltersProps {
  selectedFilter: ProfessionalSpecialtyFilter
  onChange: (filter: ProfessionalSpecialtyFilter) => void
}

export function ProfessionalFilters({ selectedFilter, onChange }: ProfessionalFiltersProps) {
  return (
    <div className="professional-filters" role="group" aria-label="Filtrar profesionales por especialidad">
      {professionalFilters.map((filter) => (
        <button
          type="button"
          className={`professional-filter ${selectedFilter === filter ? 'is-active' : ''}`}
          aria-pressed={selectedFilter === filter}
          onClick={() => onChange(filter)}
          key={filter}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
