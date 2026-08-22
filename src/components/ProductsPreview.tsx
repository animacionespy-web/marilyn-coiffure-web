import { usePublicContent } from '../hooks/usePublicContent'
import { ProductCard } from './products/ProductCard'
import { HomeCarousel } from './HomeCarousel'

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
        <div className="section-heading"><p className="eyebrow">Cuidado en casa</p><h2 id="products-preview-title">Productos elegidos para acompañar cada resultado.</h2><p>Te recomendamos lo que tu cabello necesita para continuar el cuidado en casa.</p></div>
        <HomeCarousel className="products-grid" ariaLabel="Productos destacados">{featured.map((product) => <ProductCard key={product.id} product={product} whatsappNumber={settings.generalWhatsappNumber} />)}</HomeCarousel>
        <div className="products-preview__footer"><a className="button button--outline" href="/productos">Ver productos</a></div>
      </div>
    </section>
  )
}
