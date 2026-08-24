import { usePublicContent } from '../hooks/usePublicContent'
import { ProductCard } from './products/ProductCard'

export function ProductsPreview() {
  const { products, settings } = usePublicContent()
  const active = products.filter((product) => product.active).sort((a, b) => a.displayOrder - b.displayOrder)
  const featured = [
    ...active.filter((product) => product.featured),
    ...active.filter((product) => !product.featured),
  ].slice(0, 4)
  if (!featured.length) return null
  return (
    <section className="products-preview section" aria-labelledby="products-preview-title">
      <div className="container">
        <div className="section-heading" data-reveal><div><p className="eyebrow">Cuidado en casa</p><h2 id="products-preview-title">Productos elegidos para acompañar cada resultado.</h2></div><p>Te recomendamos solo lo que tu cabello necesita, según su estado, textura y el servicio realizado.</p></div>
        <div className="products-grid">{featured.map((product) => <div key={product.id} data-reveal><ProductCard product={product} whatsappNumber={settings.generalWhatsappNumber} /></div>)}</div>
        <div className="products-preview__footer"><a className="button button--outline" href="/productos">Ver productos</a></div>
      </div>
    </section>
  )
}
