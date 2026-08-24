import { usePublicContent } from '../hooks/usePublicContent'
import { ProductCard } from './products/ProductCard'

export function ProductsPreview({ editorMode = false, onEditProduct }: {
  editorMode?: boolean
  onEditProduct?: (productId: string) => void
} = {}) {
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
        <div className="products-grid">{featured.map((product) => <div className="admin-preview-card-wrap" key={product.id} data-reveal><ProductCard product={product} whatsappNumber={settings.generalWhatsappNumber} />{editorMode && <button className="admin-preview-card-action" data-admin-action type="button" onClick={() => onEditProduct?.(product.id)}>Editar</button>}</div>)}</div>
        <div className="products-preview__footer"><a className="button button--outline" href="/productos">Ver productos</a></div>
      </div>
    </section>
  )
}
