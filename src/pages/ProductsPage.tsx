import { ProductCard } from '../components/products/ProductCard'
import { usePublicContent } from '../hooks/usePublicContent'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function ProductsPage() {
  const { products, settings, loading, error, retry } = usePublicContent()
  const visible = products.filter((product) => product.active).sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, 'es'))
  const grouped = visible.reduce((brands, product) => {
    const brandName = product.category.trim() || 'Otros productos'
    const currentBrand = brands.get(brandName) ?? { withoutLine: [], lines: new Map<string, typeof visible>() }
    if (product.lineName.trim()) {
      const lineProducts = currentBrand.lines.get(product.lineName.trim()) ?? []
      lineProducts.push(product)
      currentBrand.lines.set(product.lineName.trim(), lineProducts)
    } else {
      currentBrand.withoutLine.push(product)
    }
    brands.set(brandName, currentBrand)
    return brands
  }, new Map<string, { withoutLine: typeof visible; lines: Map<string, typeof visible> }>())
  useDocumentMeta('Productos para el cabello | Marilyn Coiffure', 'Conocé productos seleccionados por Marilyn Coiffure para continuar el cuidado de tu cabello en casa.', '/productos')
  return (
    <main id="contenido-principal">
      <section className="products-hero"><div className="container"><a className="catalog-back-link" href="/">← Volver al inicio</a><p className="eyebrow">Productos</p><h1>Cuidado para continuar en casa</h1><p>Una selección simple para acompañar tu rutina capilar.</p></div></section>
      <section className="products-page section" aria-labelledby="products-list-title"><div className="container"><div className="catalog-results-heading"><h2 id="products-list-title">Productos disponibles</h2><p>{visible.length} productos</p></div>
        {loading && !visible.length ? <p role="status">Cargando productos…</p> : error && !visible.length ? <div className="public-content-state"><p>{error}</p><button className="button button--outline" onClick={retry}>Reintentar</button></div> : <div className="product-catalog-groups">{Array.from(grouped, ([brandName, brand]) => <section className="product-brand-group" key={brandName} aria-label={brandName}>
          <div className="product-brand-group__heading"><p>Marca</p><h2>{brandName}</h2></div>
          {brand.withoutLine.length > 0 && <div className="products-grid product-brand-group__direct">{brand.withoutLine.map((product) => <ProductCard key={product.id} product={product} whatsappNumber={settings.generalWhatsappNumber} />)}</div>}
          {Array.from(brand.lines, ([lineName, lineProducts]) => <div className="product-line-group" key={lineName}>
            <h3>{lineName}</h3>
            <div className="products-grid">{lineProducts.map((product) => <ProductCard key={product.id} product={product} whatsappNumber={settings.generalWhatsappNumber} />)}</div>
          </div>)}
        </section>)}</div>}
      </div></section>
    </main>
  )
}
