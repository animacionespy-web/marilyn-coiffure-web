import type { ProfessionalWork } from '../../types/professional'
import { PositionedImage } from '../PositionedImage'
import { BeforeAfterComparison } from './BeforeAfterComparison'

export function ProfessionalWorkGallery({ works, professionalName }: { works: ProfessionalWork[]; professionalName: string }) {
  if (!works.length) {
    return <p className="professional-portfolio__empty">Los trabajos de {professionalName} se publicarán próximamente.</p>
  }

  return (
    <div className="professional-work-grid">
      {works.slice(0, 6).map((work, index) => (
        <article className={`professional-work-card professional-work-card--${work.type}`} key={work.id}>
          {work.type === 'before_after' ? (
            <BeforeAfterComparison work={work} professionalName={professionalName} index={index} />
          ) : (
            <PositionedImage src={work.image} alt={work.imageAlt} loading="lazy" width="900" height="1080" position={work.imagePosition} />
          )}
          <div className="professional-work-card__caption">
            <span>{work.type === 'before_after' ? 'Antes y después' : `Trabajo ${index + 1}`}</span>
            {work.title && <h3>{work.title}</h3>}
          </div>
        </article>
      ))}
    </div>
  )
}
