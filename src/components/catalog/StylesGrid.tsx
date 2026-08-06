import type { Style } from '../../types/style'
import { StyleCard } from './StyleCard'

interface StylesGridProps {
  styles: Style[]
  selectedStyleId?: string
  recommendedStyleIds?: string[]
  onSelect: (style: Style) => void
}

export function StylesGrid({ styles, selectedStyleId, recommendedStyleIds = [], onSelect }: StylesGridProps) {
  return (
    <div className="catalog-grid">
      {styles.map((style) => (
        <StyleCard style={style} isSelected={style.id === selectedStyleId} isRecommended={recommendedStyleIds.includes(style.id)} onSelect={onSelect} key={style.id} />
      ))}
    </div>
  )
}
