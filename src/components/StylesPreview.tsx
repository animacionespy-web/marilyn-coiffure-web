import { usePublicContent } from '../hooks/usePublicContent'
import { PublicContentState } from './PublicContentState'

const categoryPriority = ['Peinados', 'Coloración', 'Cortes', 'Quinceañeras', 'Tratamientos']

export function StylesPreview() {
  const { styles, loading, error, retry } = usePublicContent()
  const featuredStyles = styles
    .filter((style) => style.active && style.featured)
    .sort((a, b) => categoryPriority.indexOf(a.category) - categoryPriority.indexOf(b.category) || a.order - b.order)
  return (
    <section className="styles-preview section" id="estilos" aria-labelledby="styles-title">
      <div className="container">
        <div className="section-heading styles-preview__heading">
          <p className="eyebrow">Estilos</p>
          <h2 id="styles-title">Estilos que realzan tu belleza</h2>
          <p>Descubrí peinados, cortes y colores pensados para cada ocasión.</p>
        </div>
        {featuredStyles.length === 0 ? <PublicContentState loading={loading} error={error} empty="No hay estilos destacados publicados todavía." onRetry={retry} /> : <div className="styles-grid">{featuredStyles.slice(0, 3).map((style, index) => <article className="style-card" key={style.id}><a className="style-card__visual" href={`/estilos/${style.slug}`} aria-label={`Ver detalles de ${style.name}`}><img src={style.image} alt={style.imageAlt} loading="lazy" width="640" height="760" /><span aria-hidden="true">0{index + 1}</span></a><div className="style-card__body"><p>{style.category}</p><h3><a href={`/estilos/${style.slug}`}>{style.name}</a></h3><span>{style.shortDescription}</span></div></article>)}</div>}
        <div className="styles-preview__footer"><a className="button button--outline" href="/estilos">Ver todos los estilos</a></div>
      </div>
    </section>
  )
}
