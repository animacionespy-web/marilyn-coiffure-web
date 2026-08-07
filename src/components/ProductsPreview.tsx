import { usePublicContent } from '../hooks/usePublicContent'
import { ProductCard } from './products/ProductCard'
import { HomeCarousel } from './HomeCarousel'

export function ProductsPreview() {
  const { products, settings } = usePublicContent()
  const featured = products.filter((product) => product.active && product.featured).sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 3)
  if (!featured.length) return null
  return (
    <section className="products-preview section" aria-labelledby="products-preview-title">
      <div className="container">
        <div className="section-heading"><p className="eyebrow">Cuidado en casa</p><h2 id="products-preview-title">Productos para cuidar tu cabello</h2><p>Conocé nuestra selección de productos para continuar el cuidado en casa.</p></div>
        <HomeCarousel className="products-grid" ariaLabel="Productos destacados">{featured.map((product) => <ProductCard key={product.id} product={product} whatsappNumber={settings.generalWhatsappNumber} />)}</HomeCarousel>
        <div className="products-preview__footer"><a className="button button--outline" href="/productos">Ver productos</a></div>
      </div>
    </section>
  )
}
