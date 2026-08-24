import { StyleDetail } from '../components/catalog/StyleDetail'
import { PublicContentState } from '../components/PublicContentState'
import { usePublicContent } from '../hooks/usePublicContent'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Style } from '../types/style'
import { saveSelectedStyle } from '../utils/styleSelection'
import { getProfessionalSelection, saveAnyProfessionalSelection } from '../utils/professionalSelection'

interface StyleDetailPageProps {
  slug: string
}

export function StyleDetailPage({ slug }: StyleDetailPageProps) {
  const { styles, professionals, loading, error, retry } = usePublicContent()
  const style = styles.find((item) => item.slug === slug)

  useDocumentMeta(
    style ? `${style.name} | Marilyn Coiffure` : 'Estilo no encontrado | Marilyn Coiffure',
    style?.shortDescription ?? 'Explorá el catálogo de estilos de Marilyn Coiffure.',
    `/estilos/${slug}`,
  )

  const selectStyle = (selectedStyle: Style) => {
    saveSelectedStyle(selectedStyle)
    const professionalSelection = getProfessionalSelection()
    if (!professionalSelection) saveAnyProfessionalSelection()
    const professionalParam = !professionalSelection || professionalSelection.mode === 'any'
      ? 'cualquiera'
      : professionals.find((professional) => professional.id === professionalSelection.professionalId)?.slug
    window.location.assign(`/consulta?estilo=${selectedStyle.slug}&profesional=${professionalParam || 'cualquiera'}`)
  }

  if (!style && (loading || error)) {
    return <main className="style-detail-page" id="contenido-principal"><div className="container"><PublicContentState loading={loading} error={error} onRetry={retry} /></div></main>
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
