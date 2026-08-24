import { useId, useState, type CSSProperties } from 'react'
import type { ProfessionalWork } from '../../types/professional'
import { PositionedImage } from '../PositionedImage'

export function BeforeAfterComparison({ work, professionalName, index }: {
  work: ProfessionalWork
  professionalName: string
  index: number
}) {
  const id = useId()
  const [position, setPosition] = useState(50)
  const style = { '--comparison-position': `${position}%` } as CSSProperties

  return (
    <div className="before-after-comparison" style={style}>
      <div className="before-after-comparison__stage">
        <PositionedImage src={work.beforeImage} alt={work.beforeImageAlt || `Antes del trabajo ${index + 1} de ${professionalName}`} loading="lazy" width="900" height="1080" position={work.beforeImagePosition} />
        <div className="before-after-comparison__after">
          <PositionedImage src={work.afterImage} alt={work.afterImageAlt || `Después del trabajo ${index + 1} de ${professionalName}`} loading="lazy" width="900" height="1080" position={work.afterImagePosition} />
        </div>
        <span className="before-after-comparison__label before-after-comparison__label--before">Antes</span>
        <span className="before-after-comparison__label before-after-comparison__label--after">Después</span>
        <span className="before-after-comparison__divider" aria-hidden="true"><i>↔</i></span>
        <label className="sr-only" htmlFor={id}>Comparar antes y después del trabajo {index + 1}</label>
        <input id={id} type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-valuetext={`La imagen antes se muestra hasta el ${position}%`} />
      </div>
      <p className="before-after-comparison__help">Deslizá para comparar</p>
    </div>
  )
}
