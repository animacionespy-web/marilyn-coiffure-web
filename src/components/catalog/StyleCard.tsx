import type { Style } from '../../types/style'
import { PositionedImage } from '../PositionedImage'

interface StyleCardProps {
  style: Style
  isSelected: boolean
  isRecommended: boolean
  onSelect: (style: Style) => void
}

export function StyleCard({ style, isSelected, isRecommended, onSelect }: StyleCardProps) {
  return (
    <article className={`catalog-card ${isSelected ? 'is-selected' : ''}`}>
      <a className="catalog-card__image" href={`/estilos/${style.slug}`} aria-label={`Ver detalles de ${style.name}`}>
        <PositionedImage src={style.image} alt={style.imageAlt} loading="lazy" width="640" height="760" position={style.imagePosition} />
        {isRecommended && <span>Recomendado con esta profesional</span>}
      </a>
      <div className="catalog-card__body">
        <p className="catalog-card__category">{style.category}</p>
        <h2><a href={`/estilos/${style.slug}`}>{style.name}</a></h2>
        <p>{style.shortDescription}</p>
        <div className="catalog-card__actions">
          <button className="button button--dark" type="button" onClick={() => onSelect(style)}>
            {isSelected ? '✓ Seleccionado' : 'Elegir estilo'}
          </button>
        </div>
      </div>
    </article>
  )
}
