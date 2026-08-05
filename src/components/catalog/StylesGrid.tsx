import type { Style } from '../../types/style'
import { StyleCard } from './StyleCard'

interface StylesGridProps {
  styles: Style[]
  onSelect: (style: Style) => void
}

export function StylesGrid({ styles, onSelect }: StylesGridProps) {
  return (
    <div className="catalog-grid">
      {styles.map((style) => (
        <StyleCard style={style} onSelect={onSelect} key={style.id} />
      ))}
    </div>
  )
}
