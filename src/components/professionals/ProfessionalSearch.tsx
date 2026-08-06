interface ProfessionalSearchProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export function ProfessionalSearch({ value, onChange, onClear }: ProfessionalSearchProps) {
  return (
    <div className="style-search professional-search">
      <label htmlFor="professional-search-input">Buscar profesional</label>
      <div className="style-search__control">
        <span aria-hidden="true">⌕</span>
        <input
          id="professional-search-input"
          type="search"
          placeholder="Nombre o especialidad"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <button type="button" onClick={onClear} aria-label="Limpiar búsqueda de profesionales">Limpiar</button>
        )}
      </div>
    </div>
  )
}
