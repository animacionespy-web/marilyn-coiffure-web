import type { ImagePosition } from '../../types/image'
import { PositionedImage } from '../PositionedImage'

interface CompactSelectionBarProps {
  eyebrow: string
  title: string
  subtitle?: string
  image?: string
  imageAlt?: string
  imagePosition?: ImagePosition
  changeHref: string
  onRemove?: () => void
}

export function CompactSelectionBar({ eyebrow, title, subtitle, image, imageAlt = '', imagePosition, changeHref, onRemove }: CompactSelectionBarProps) {
  return (
    <aside className="compact-selection" aria-label={`${eyebrow}: ${title}`}>
      {image && <PositionedImage src={image} alt={imageAlt} width="88" height="88" position={imagePosition} />}
      <div className="compact-selection__copy">
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        {subtitle && <small>{subtitle}</small>}
      </div>
      <div className="compact-selection__actions">
        <a href={changeHref}>Cambiar</a>
        {onRemove && <button type="button" onClick={onRemove}>Quitar</button>}
      </div>
    </aside>
  )
}
