import type { Style } from '../../types/style'

interface StyleCardProps {
  style: Style
  onSelect: (style: Style) => void
}

export function StyleCard({ style, onSelect }: StyleCardProps) {
  return (
    <article className="catalog-card">
      <a className="catalog-card__image" href={`/estilos/${style.slug}`} aria-label={`Ver detalles de ${style.name}`}>
        <img src={style.image} alt={style.imageAlt} loading="lazy" width="640" height="760" />
        <span>{style.category}</span>
      </a>
      <div className="catalog-card__body">
        <p className="catalog-card__category">{style.category}</p>
        <h2>{style.name}</h2>
        <p>{style.shortDescription}</p>
        <ul className="style-tags" aria-label={`Etiquetas de ${style.name}`}>
          {style.tags.slice(0, 3).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="catalog-card__actions">
          <a className="button button--outline" href={`/estilos/${style.slug}`}>
            Ver detalles
          </a>
          <button className="button button--dark" type="button" onClick={() => onSelect(style)}>
            Elegir estilo
          </button>
        </div>
      </div>
    </article>
  )
}
