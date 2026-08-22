import type { Style } from '../../types/style'
import { PositionedImage } from '../PositionedImage'

interface StyleDetailProps {
  style: Style
  onSelect: (style: Style) => void
}

export function StyleDetail({ style, onSelect }: StyleDetailProps) {
  return (
    <article className="style-detail">
      <div className="style-detail__image">
        <PositionedImage src={style.image} alt={style.imageAlt} width="800" height="960" position={style.imagePosition} />
        <span>Imagen de referencia</span>
      </div>
      <div className="style-detail__content">
        <p className="eyebrow">{style.category}</p>
        <h1>{style.name}</h1>
        <p className="style-detail__lead">{style.fullDescription}</p>
        <ul className="style-tags style-tags--detail" aria-label={`Etiquetas de ${style.name}`}>
          {style.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        {style.estimatedDuration && (
          <dl className="style-detail__meta">
            <div>
              <dt>Duración estimada</dt>
              <dd>{style.estimatedDuration}</dd>
            </div>
          </dl>
        )}
        <div className="style-detail__notice">
          <span aria-hidden="true">✦</span>
          <p>El resultado final se evaluará según el tipo, estado, color previo y largo de tu cabello.</p>
        </div>
        <div className="style-detail__actions">
          <button className="button button--dark" type="button" onClick={() => onSelect(style)}>
            Reservar turno
          </button>
          <a className="button button--outline" href="/estilos">
            Volver al catálogo
          </a>
        </div>
      </div>
    </article>
  )
}
