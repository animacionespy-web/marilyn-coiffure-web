export function AdminLoading({ label = 'Cargando contenido…' }: { label?: string }) {
  return <div className="admin-state" role="status"><span className="admin-spinner" aria-hidden="true" />{label}</div>
}

export function AdminError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="admin-state admin-state--error" role="alert">
      <strong>No pudimos completar la operación</strong>
      <p>{message}</p>
      {onRetry && <button className="admin-button admin-button--secondary" type="button" onClick={onRetry}>Intentar nuevamente</button>}
    </div>
  )
}

export function AdminEmpty({ message }: { message: string }) {
  return <div className="admin-state"><p>{message}</p></div>
}
