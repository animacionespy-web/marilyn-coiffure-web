import { findStyleById, findStyleBySlug } from '../data/styles'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { getSelectedStyleId } from '../utils/styleSelection'

export function ProfessionalsPlaceholderPage() {
  const selectedSlug = new URLSearchParams(window.location.search).get('estilo')
  const storedId = getSelectedStyleId()
  const selectedStyle = selectedSlug
    ? findStyleBySlug(selectedSlug)
    : storedId
      ? findStyleById(storedId)
      : undefined

  useDocumentMeta(
    'Profesionales | Marilyn Coiffure',
    'Próximamente vas a poder elegir a tu profesional en Marilyn Coiffure.',
  )

  return (
    <main className="professionals-placeholder" id="contenido-principal">
      <div className="professionals-placeholder__ornament" aria-hidden="true">MC</div>
      <div className="container professionals-placeholder__content">
        <p className="eyebrow">Próximo paso</p>
        {selectedStyle && <span className="selection-pill">Estilo elegido: {selectedStyle.name}</span>}
        <h1>Próximamente vas a poder elegir a tu profesional.</h1>
        <p>
          Estamos preparando esta experiencia. Tu selección temporal queda guardada para continuar cuando la sección esté disponible.
        </p>
        <div className="professionals-placeholder__actions">
          <a className="button button--dark" href="/estilos">Volver al catálogo</a>
          <a className="button button--outline" href="/">Ir al inicio</a>
        </div>
      </div>
    </main>
  )
}
