import type { StyleCategoryFilter } from '../../types/style'

interface CategoryFiltersProps {
  selectedCategory: StyleCategoryFilter
  onChange: (category: StyleCategoryFilter) => void
  categories: StyleCategoryFilter[]
}

export function CategoryFilters({ selectedCategory, onChange, categories }: CategoryFiltersProps) {
  return (
    <div className="category-filters" role="group" aria-label="Filtrar por categoría">
      {categories.map((category) => (
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
