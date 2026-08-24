import { useId, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import type { ImagePosition } from '../../types/image'
import { PositionedImage } from '../PositionedImage'

interface BeforeAfterComparisonProps {
  beforeImage: string
  afterImage: string
  beforeImageAlt: string
  afterImageAlt: string
  beforeImagePosition?: ImagePosition
  afterImagePosition?: ImagePosition
  accessibleLabel?: string
}

export function BeforeAfterComparison({
  beforeImage,
  afterImage,
  beforeImageAlt,
  afterImageAlt,
  beforeImagePosition,
  afterImagePosition,
  accessibleLabel = 'Comparar fotografía antes y después',
}: BeforeAfterComparisonProps) {
  const id = useId()
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const style = { '--comparison-position': `${position}%` } as CSSProperties

  const updateFromPointer = (event: ReactPointerEvent<HTMLInputElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const nextPosition = ((event.clientX - bounds.left) / bounds.width) * 100
    setPosition(Math.min(100, Math.max(0, Math.round(nextPosition))))
  }

  const startDragging = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
    updateFromPointer(event)
  }

  const moveDivider = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    event.preventDefault()
    updateFromPointer(event)
  }

  const stopDragging = (event: ReactPointerEvent<HTMLInputElement>) => {
    updateFromPointer(event)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    setIsDragging(false)
  }

  const cancelDragging = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    setIsDragging(false)
  }

  const moveWithKeyboard = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    const movements: Partial<Record<string, number>> = {
      ArrowLeft: position - 1,
      ArrowDown: position - 1,
      ArrowRight: position + 1,
      ArrowUp: position + 1,
      PageDown: position - 10,
      PageUp: position + 10,
      Home: 0,
      End: 100,
    }
    const nextPosition = movements[event.key]
    if (nextPosition === undefined) return
    event.preventDefault()
    setPosition(Math.min(100, Math.max(0, nextPosition)))
  }

  return (
    <div className={`before-after-comparison ${isDragging ? 'is-dragging' : ''}`} style={style}>
      <div className="before-after-comparison__stage">
        <PositionedImage src={beforeImage} alt={beforeImageAlt} loading="lazy" width="900" height="1080" position={beforeImagePosition} />
        <div className="before-after-comparison__after">
          <PositionedImage src={afterImage} alt={afterImageAlt} loading="lazy" width="900" height="1080" position={afterImagePosition} />
        </div>
        <span className="before-after-comparison__label before-after-comparison__label--before">Antes</span>
        <span className="before-after-comparison__label before-after-comparison__label--after">Después</span>
        <span className="before-after-comparison__divider" aria-hidden="true"><i>↔</i></span>
        <label className="sr-only" htmlFor={id}>{accessibleLabel}</label>
        <input
          id={id}
          type="range"
          min="0"
          max="100"
          step="1"
          value={position}
          onInput={(event) => setPosition(Number(event.currentTarget.value))}
          onChange={(event) => setPosition(Number(event.target.value))}
          onKeyDown={moveWithKeyboard}
          onPointerDown={startDragging}
          onPointerMove={moveDivider}
          onPointerUp={stopDragging}
          onPointerCancel={cancelDragging}
          onLostPointerCapture={() => setIsDragging(false)}
          onBlur={() => setIsDragging(false)}
          aria-valuetext={`La imagen antes se muestra hasta el ${Math.round(position)}%`}
        />
      </div>
      <p className="before-after-comparison__help">Deslizá para comparar</p>
    </div>
  )
}
