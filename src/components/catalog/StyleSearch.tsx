interface StyleSearchProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export function StyleSearch({ value, onChange, onClear }: StyleSearchProps) {
  return (
    <div className="style-search">
      <label htmlFor="style-search-input">Buscar en el catálogo</label>
      <div className="style-search__control">
        <span aria-hidden="true">⌕</span>
        <input
          id="style-search-input"
          type="search"
          placeholder="Buscar estilo o servicio"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <button type="button" onClick={onClear} aria-label="Limpiar búsqueda">
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
