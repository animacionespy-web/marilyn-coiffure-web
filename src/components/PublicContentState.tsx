export function PublicContentState({ loading, error, empty, onRetry }: { loading: boolean; error: string; empty?: string; onRetry: () => void }) {
  if (loading) return <div className="public-content-state" role="status"><span className="public-content-spinner" aria-hidden="true" />Cargando contenido…</div>
  if (error) return <div className="public-content-state" role="alert"><p>{error}</p><button className="button button--outline" type="button" onClick={onRetry}>Intentar nuevamente</button></div>
  return <div className="public-content-state"><p>{empty ?? 'No hay contenido publicado todavía.'}</p></div>
}
