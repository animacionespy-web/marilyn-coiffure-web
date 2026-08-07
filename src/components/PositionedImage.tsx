import type { ImgHTMLAttributes } from 'react'
import type { ImagePosition } from '../types/image'
import { normalizeImagePosition } from '../types/image'

interface PositionedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  position?: Partial<ImagePosition> | null
}

export function PositionedImage({ position, style, ...props }: PositionedImageProps) {
  const safePosition = normalizeImagePosition(position)

  return (
    <img
      {...props}
      style={{
        ...style,
        objectFit: 'cover',
        objectPosition: `${safePosition.positionX}% ${safePosition.positionY}%`,
        transform: `scale(${safePosition.zoom})`,
        transformOrigin: `${safePosition.positionX}% ${safePosition.positionY}%`,
      }}
    />
  )
}
