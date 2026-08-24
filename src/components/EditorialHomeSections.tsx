import { usePublicContent } from '../hooks/usePublicContent'
import type { ProfessionalWork } from '../types/professional'
import type { Style } from '../types/style'
import { BeforeAfterComparison } from './professionals/BeforeAfterComparison'
import { PositionedImage } from './PositionedImage'

const processSteps = [
  ['Te escuchamos', 'Conocemos qué buscás, tus experiencias anteriores y el cuidado que podés sostener.'],
  ['Diagnosticamos', 'Evaluamos el tono, la textura, la porosidad y el estado actual de tu cabello.'],
  ['Diseñamos', 'Definimos juntas una propuesta posible, clara y pensada para vos.'],
  ['Realizamos', 'Trabajamos con técnica, cuidado y atención en cada etapa del servicio.'],
  ['Te acompañamos', 'Te explicamos cómo mantener el resultado y cuándo conviene volver a evaluarlo.'],
] as const

const diagnosticPoints = [
  'Historia y estado actual del cabello',
  'Textura, porosidad y resistencia',
  'Resultado buscado y mantenimiento',
  'Una propuesta posible para cada etapa',
] as const

function uniqueStylesByImage(styles: Style[]) {
  const images = new Set<string>()
  return styles.filter((style) => {
    if (!style.image || images.has(style.image)) return false
    images.add(style.image)
    return true
  })
}

export function EditorialColorSection() {
  const { styles } = usePublicContent()
  const colorStyles = uniqueStylesByImage(
    styles
      .filter((style) => style.active && style.category === 'Coloración')
      .sort((first, second) => Number(second.featured) - Number(first.featured) || first.order - second.order),
  ).slice(0, 5)

  if (!colorStyles.length) return null

  const [leadStyle, ...galleryStyles] = colorStyles

  return (
    <section className="editorial-color section" id="color" aria-labelledby="editorial-color-title">
      <div className="container">
        <div className="editorial-color__heading" data-reveal>
          <div>
            <p className="eyebrow">Color Marilyn</p>
            <h2 id="editorial-color-title">El color no empieza con una fórmula. Empieza con un <em>diagnóstico</em>.</h2>
          </div>
          <div className="editorial-color__intro-copy">
            <p>Antes de elegir un tono, miramos el historial, la textura y el estado actual de tu cabello.</p>
            <p>Así podemos diseñar un resultado posible, cuidado y pensado para acompañarte en el tiempo.</p>
          </div>
        </div>

        <div className="editorial-color__diagnosis" data-reveal>
          <a className="editorial-color__lead-image" href={`/estilos/${encodeURIComponent(leadStyle.slug)}`} aria-label={`Ver ${leadStyle.name}`}>
            <PositionedImage src={leadStyle.image} alt={leadStyle.imageAlt} loading="lazy" width="900" height="1080" position={leadStyle.imagePosition} />
            <span>{leadStyle.name}</span>
          </a>
          <div className="editorial-color__copy">
            <p className="editorial-index">01 — Diagnóstico</p>
            <h3>Lo que miramos antes de tocar tu cabello.</h3>
            <ol>
              {diagnosticPoints.map((point, index) => <li key={point}><em>{String(index + 1).padStart(2, '0')}</em><span>{point}</span></li>)}
            </ol>
            <a className="button button--light" href="/consulta">Consultar disponibilidad</a>
          </div>
        </div>

        <div className="editorial-color__process" data-reveal>
          {processSteps.map(([title, description]) => (
            <div key={title}><strong>{title}</strong><span>{description}</span></div>
          ))}
        </div>

        {galleryStyles.length > 0 && (
          <div className="editorial-color__gallery" aria-label="Coloraciones publicadas" data-reveal>
            {galleryStyles.map((style) => (
              <a href={`/estilos/${encodeURIComponent(style.slug)}`} key={style.id} aria-label={`Ver ${style.name}`}>
                <PositionedImage src={style.image} alt={style.imageAlt} loading="lazy" width="720" height="900" position={style.imagePosition} />
                <span>{style.name}</span>
              </a>
            ))}
          </div>
        )}
        <div className="editorial-color__footer" data-reveal>
          <a className="button button--light" href="/estilos?categoria=Coloración">Ver todas las coloraciones <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  )
}

export function EditorialProcessSection() {
  return (
    <section className="editorial-process section" id="experiencia" aria-labelledby="editorial-process-title">
      <div className="container">
        <div className="section-heading section-heading--split" data-reveal>
          <div>
            <p className="eyebrow">Experiencia Marilyn</p>
            <h2 id="editorial-process-title">Así trabajamos, siempre con el mismo cuidado.</h2>
          </div>
          <p>Un recorrido claro, desde la primera conversación hasta el cuidado en casa.</p>
        </div>
        <ol className="editorial-process__list" data-reveal>
          {processSteps.map(([title, description], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

interface WorkWithProfessional {
  work: ProfessionalWork
  professionalName: string
  professionalSlug: string
}

export function EditorialTransformationsSection() {
  const { professionals } = usePublicContent()
  const works = professionals
    .filter((professional) => professional.active)
    .flatMap<WorkWithProfessional>((professional) => (professional.works ?? [])
      .filter((work) => {
        if (!work.active) return false
        if (work.type === 'photo') return Boolean(work.image)
        return Boolean(work.beforeImage && work.afterImage && work.beforeImage !== work.afterImage)
      })
      .map((work) => ({ work, professionalName: professional.name, professionalSlug: professional.slug })))
    .sort((first, second) => first.work.order - second.work.order)

  if (!works.length) return null

  const comparison = works.find(({ work }) => work.type === 'before_after' && work.beforeImage && work.afterImage)
  const gallery = works
    .filter(({ work }) => work.id !== comparison?.work.id && (work.image || work.afterImage))
    .slice(0, 4)

  return (
    <section className="editorial-transformations section" id="transformaciones" aria-labelledby="editorial-transformations-title">
      <div className="container">
        <div className="section-heading section-heading--split" data-reveal>
          <div>
            <p className="eyebrow">Transformaciones Marilyn</p>
            <h2 id="editorial-transformations-title">Trabajos reales de nuestro equipo.</h2>
          </div>
          <p>Deslizá el comparador o explorá cada portfolio para conocer nuestros trabajos publicados.</p>
        </div>

        <div className={`editorial-transformations__grid ${comparison ? '' : 'editorial-transformations__grid--gallery-only'}`} data-reveal>
          {comparison && (
            <div className="editorial-transformations__comparison">
              <BeforeAfterComparison work={comparison.work} professionalName={comparison.professionalName} index={0} />
              <a href={`/profesionales/${encodeURIComponent(comparison.professionalSlug)}`}>Trabajo de {comparison.professionalName} <span aria-hidden="true">→</span></a>
            </div>
          )}
          {gallery.length > 0 && (
            <div className="editorial-transformations__gallery">
              {gallery.map(({ work, professionalName, professionalSlug }) => {
                const image = work.type === 'before_after' ? work.afterImage : work.image
                const alt = work.type === 'before_after' ? work.afterImageAlt : work.imageAlt
                const position = work.type === 'before_after' ? work.afterImagePosition : work.imagePosition
                return (
                  <a href={`/profesionales/${encodeURIComponent(professionalSlug)}`} key={work.id} aria-label={`Ver trabajo de ${professionalName}`}>
                    <PositionedImage src={image} alt={alt || `Trabajo realizado por ${professionalName}`} loading="lazy" width="720" height="900" position={position} />
                    <span>{work.title || professionalName}</span>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function EditorialEventsSection() {
  const { styles } = usePublicContent()
  const eventStyles = uniqueStylesByImage(
    styles
      .filter((style) => style.active && (style.category === 'Quinceañeras' || style.category === 'Peinados'))
      .sort((first, second) => Number(second.featured) - Number(first.featured) || first.order - second.order),
  ).slice(0, 3)

  if (!eventStyles.length) return null

  return (
    <section className="editorial-events section" id="eventos" aria-labelledby="editorial-events-title">
      <div className="container editorial-events__grid">
        <div className="editorial-events__content" data-reveal>
          <p className="eyebrow">Novias &amp; eventos</p>
          <h2 id="editorial-events-title">Para el día que ya tenés marcado en el calendario.</h2>
          <p>Peinados pensados para acompañar tu estilo, tu cabello y cada detalle de la ocasión.</p>
          <div className="editorial-events__list"><span>Novias</span><span>Madrinas</span><span>Invitadas</span><span>Eventos especiales</span></div>
          <a className="button button--light" href="/estilos">Ver peinados y eventos</a>
        </div>
        <div className="editorial-events__gallery" data-reveal>
          {eventStyles.map((style) => (
            <a href={`/estilos/${encodeURIComponent(style.slug)}`} key={style.id} aria-label={`Ver ${style.name}`}>
              <PositionedImage src={style.image} alt={style.imageAlt} loading="lazy" width="720" height="900" position={style.imagePosition} />
              <span>{style.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditorialTreatmentsSection() {
  const { styles } = usePublicContent()
  const treatments = styles
    .filter((style) => style.active && style.category === 'Tratamientos')
    .sort((first, second) => Number(second.featured) - Number(first.featured) || first.order - second.order)

  if (!treatments.length) return null

  const visual = treatments.find((style) => style.image)

  return (
    <section className="editorial-treatments section" id="tratamientos" aria-labelledby="editorial-treatments-title">
      <div className="container editorial-treatments__grid">
        {visual && (
          <a className="editorial-treatments__visual" href={`/estilos/${encodeURIComponent(visual.slug)}`} aria-label={`Ver ${visual.name}`} data-reveal>
            <PositionedImage src={visual.image} alt={visual.imageAlt} loading="lazy" width="900" height="1080" position={visual.imagePosition} />
            <span>{visual.name}</span>
          </a>
        )}
        <div className="editorial-treatments__content" data-reveal>
          <p className="eyebrow">Tratamientos</p>
          <h2 id="editorial-treatments-title">Rituales que se eligen después de mirar tu cabello.</h2>
          <div className="editorial-treatments__list">
            {treatments.slice(0, 5).map((treatment, index) => (
              <details key={treatment.id} open={index === 0}>
                <summary>{treatment.name}<span aria-hidden="true">+</span></summary>
                <p>{treatment.shortDescription}</p>
                <a href={`/estilos/${encodeURIComponent(treatment.slug)}`}>Ver detalle</a>
              </details>
            ))}
          </div>
          <a className="button button--outline" href="/productos">Conocer productos</a>
        </div>
      </div>
    </section>
  )
}

export function EditorialClosingImage() {
  const { settings } = usePublicContent()
  if (!settings.footerImageUrl) return null

  return (
    <section className="editorial-closing-image" aria-label="Imagen editorial de Marilyn Coiffure" data-reveal>
      <PositionedImage
        src={settings.footerImageUrl}
        alt="Imagen editorial de Marilyn Coiffure"
        loading="lazy"
        width="1600"
        height="900"
        position={{ zoom: settings.footerImageZoom, positionX: settings.footerImagePositionX, positionY: settings.footerImagePositionY }}
      />
    </section>
  )
}
