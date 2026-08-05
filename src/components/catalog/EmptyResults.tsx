interface EmptyResultsProps {
  onReset: () => void
}

export function EmptyResults({ onReset }: EmptyResultsProps) {
  return (
    <div className="empty-results" role="status">
      <span aria-hidden="true">MC</span>
      <h2>No encontramos estilos con esos criterios.</h2>
      <p>Probá con otra palabra o restablecé los filtros para volver a explorar el catálogo.</p>
      <button className="button button--dark" type="button" onClick={onReset}>
        Ver todos los estilos
      </button>
    </div>
  )
}
