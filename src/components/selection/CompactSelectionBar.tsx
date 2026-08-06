interface CompactSelectionBarProps {
  eyebrow: string
  title: string
  subtitle?: string
  image?: string
  imageAlt?: string
  changeHref: string
  onRemove?: () => void
}

export function CompactSelectionBar({ eyebrow, title, subtitle, image, imageAlt = '', changeHref, onRemove }: CompactSelectionBarProps) {
  return (
    <aside className="compact-selection" aria-label={`${eyebrow}: ${title}`}>
      {image && <img src={image} alt={imageAlt} width="88" height="88" />}
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
