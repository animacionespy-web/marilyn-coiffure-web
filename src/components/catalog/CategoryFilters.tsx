import { styleCategories } from '../../data/styles'
import type { StyleCategoryFilter } from '../../types/style'

interface CategoryFiltersProps {
  selectedCategory: StyleCategoryFilter
  onChange: (category: StyleCategoryFilter) => void
}

export function CategoryFilters({ selectedCategory, onChange }: CategoryFiltersProps) {
  return (
    <div className="category-filters" role="group" aria-label="Filtrar por categoría">
      {styleCategories.map((category) => (
        <button
          className={`category-filter ${selectedCategory === category ? 'is-active' : ''}`}
          type="button"
          aria-pressed={selectedCategory === category}
          onClick={() => onChange(category)}
          key={category}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
