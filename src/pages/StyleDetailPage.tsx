import { StyleDetail } from '../components/catalog/StyleDetail'
import { findStyleBySlug } from '../data/styles'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Style } from '../types/style'
import { saveSelectedStyle } from '../utils/styleSelection'

interface StyleDetailPageProps {
  slug: string
}

export function StyleDetailPage({ slug }: StyleDetailPageProps) {
  const style = findStyleBySlug(slug)

  useDocumentMeta(
    style ? `${style.name} | Marilyn Coiffure` : 'Estilo no encontrado | Marilyn Coiffure',
    style?.shortDescription ?? 'Explorá el catálogo de estilos de Marilyn Coiffure.',
  )

  const selectStyle = (selectedStyle: Style) => {
    saveSelectedStyle(selectedStyle)
    window.location.assign(`/estilos?seleccion=${selectedStyle.slug}`)
  }

  if (!style) {
    return (
      <section className="route-empty section">
        <div className="container">
          <p className="eyebrow">Catálogo de estilos</p>
          <h1>Este estilo no está disponible</h1>
          <p>Puede que el enlace haya cambiado o que el contenido se encuentre temporalmente inactivo.</p>
          <a className="button button--dark" href="/estilos">Volver al catálogo</a>
        </div>
      </section>
    )
  }

  return (
    <main className="style-detail-page" id="contenido-principal">
      <div className="container style-detail-page__back">
        <a className="catalog-back-link" href="/estilos">
          <span aria-hidden="true">←</span> Volver al catálogo
        </a>
      </div>
      <div className="container">
        <StyleDetail style={style} onSelect={selectStyle} />
      </div>
    </main>
  )
}
