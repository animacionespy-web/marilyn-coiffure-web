import { PositionedImage } from '../../components/PositionedImage'
import { AboutImageVisual } from '../../components/AboutImageVisual'
import type { ImagePosition } from '../../types/image'

export type ImageUsage = 'professional' | 'professional-work' | 'style' | 'product' | 'hero' | 'home-block' | 'footer'

interface ImageContextPreviewProps {
  usage: ImageUsage
  imageUrl: string
  imageAlt: string
  position: ImagePosition
  title?: string
  category?: string
  description?: string
  tags?: string[]
}

const safeTitle = (title: string | undefined, fallback: string) => title?.trim() || fallback

export function ImageContextPreview({ usage, imageUrl, imageAlt, position, title, category, description, tags = [] }: ImageContextPreviewProps) {
  if (usage === 'professional') {
    const name = safeTitle(title, 'Marilyn')
    return (
      <article className="professional-card image-context-preview__card" aria-label={`Vista previa de ${name}`}>
        <div className="professional-card__image"><PositionedImage src={imageUrl} alt={imageAlt} position={position} /></div>
        <div className="professional-card__body">
          <p className="professional-card__role">{category?.trim() || 'Profesional'}</p>
          <h2>{name}</h2>
          <ul className="professional-card__specialties">{(tags.length ? tags : ['Coloración', 'Balayage']).slice(0, 2).map((tag) => <li key={tag}>{tag}</li>)}</ul>
        </div>
      </article>
    )
  }

  if (usage === 'professional-work') {
    return (
      <figure className="image-context-preview__work">
        <PositionedImage src={imageUrl} alt={imageAlt} position={position} />
        <figcaption>{safeTitle(title, 'Trabajo realizado')}</figcaption>
      </figure>
    )
  }

  if (usage === 'style') {
    const name = safeTitle(title, 'Bob elegante')
    return (
      <article className="catalog-card image-context-preview__card" aria-label={`Vista previa de ${name}`}>
        <div className="catalog-card__image"><PositionedImage src={imageUrl} alt={imageAlt} position={position} /></div>
        <div className="catalog-card__body">
          <p className="catalog-card__category">{category?.trim() || 'Corte'}</p>
          <h2>{name}</h2>
          {description?.trim() && <p>{description}</p>}
        </div>
      </article>
    )
  }

  if (usage === 'product') {
    const name = safeTitle(title, 'Shampoo')
    return (
      <article className="product-card image-context-preview__card" aria-label={`Vista previa de ${name}`}>
        <div className="product-card__image"><PositionedImage src={imageUrl} alt={imageAlt} position={position} /></div>
        <div className="product-card__body">
          <p>{category?.trim() || 'Cuidado capilar'}</p>
          <h2>{name}</h2>
          {description?.trim() && <span>{description}</span>}
        </div>
      </article>
    )
  }

  if (usage === 'hero') {
    return (
      <div className="image-context-preview__hero-grid">
        {(['desktop', 'mobile'] as const).map((viewport) => (
          <figure className={`image-context-preview__hero image-context-preview__hero--${viewport}`} key={viewport}>
            <div className="hero__visual">
              <div className="hero__frame"><PositionedImage className="hero__photo" src={imageUrl} alt={imageAlt} position={position} /></div>
              <div className="hero__note"><span>Dueña</span><strong>Marilyn</strong></div>
            </div>
            <figcaption>Portada {viewport === 'desktop' ? 'en PC' : 'en celular'}</figcaption>
          </figure>
        ))}
      </div>
    )
  }

  if (usage === 'home-block') {
    return (
      <article className="image-context-preview__home-block">
        <PositionedImage src={imageUrl} alt={imageAlt} position={position} />
        <div><span>{category?.trim() || 'Servicio'}</span><h2>{safeTitle(title, 'Bloque de la Home')}</h2>{description?.trim() && <p>{description}</p>}</div>
      </article>
    )
  }

  return (
    <figure className="image-context-preview__footer">
      <AboutImageVisual imageUrl={imageUrl} imageAlt={imageAlt} position={position} />
      <figcaption>Bloque final del sitio</figcaption>
    </figure>
  )
}
