import type { ImgHTMLAttributes } from 'react'
import type { ImagePosition } from '../types/image'
import { PositionedImage } from './PositionedImage'

interface AboutImageVisualProps {
  imageUrl: string
  imageAlt: string
  position: ImagePosition
  loading?: ImgHTMLAttributes<HTMLImageElement>['loading']
}

export function AboutImageVisual({ imageUrl, imageAlt, position, loading = 'lazy' }: AboutImageVisualProps) {
  return (
    <div className="about-photo-visual">
      <div className="about-photo-frame">
        <div className="about-photo-viewport">
          {imageUrl
            ? <PositionedImage src={imageUrl} alt={imageAlt} loading={loading} width="840" height="880" position={position} />
            : <span>MC</span>}
        </div>
      </div>
      <p className="about-photo-caption">Un espacio para sentirte vos</p>
    </div>
  )
}
