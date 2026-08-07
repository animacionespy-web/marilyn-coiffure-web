import type { Product } from '../../types/product'
import { buildWhatsappUrl } from '../../utils/consultation'
import { PositionedImage } from '../PositionedImage'

export function ProductCard({ product, whatsappNumber }: { product: Product; whatsappNumber: string }) {
  const message = product.whatsappMessage || `Hola, quisiera consultar por el producto ${product.name}.`
  const whatsappUrl = buildWhatsappUrl(whatsappNumber, message)
  return (
    <article className="product-card">
      <div className="product-card__image"><PositionedImage src={product.image} alt={product.imageAlt} loading="lazy" width="640" height="760" position={product.imagePosition} /></div>
      <div className="product-card__body">
        <p>{product.category}</p>
        <h2>{product.name}</h2>
        <span>{product.shortDescription}</span>
        {whatsappUrl
          ? <a className="button button--dark" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Consultar</a>
          : <><button className="button button--dark" type="button" disabled>Consultar</button><small>WhatsApp del salón pendiente de configurar.</small></>}
      </div>
    </article>
  )
}
