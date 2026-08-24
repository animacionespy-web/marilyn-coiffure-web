import { ProductCard } from '../components/products/ProductCard'
import { usePublicContent } from '../hooks/usePublicContent'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function ProductsPage() {
  const { products, settings, loading, error, retry } = usePublicContent()
  const visible = products.filter((product) => product.active).sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, 'es'))
  useDocumentMeta('Productos para el cabello | Marilyn Coiffure', 'Conocé productos seleccionados por Marilyn Coiffure para continuar el cuidado de tu cabello en casa.', '/productos')
  return (
    <main id="contenido-principal">
      <section className="products-hero"><div className="container"><a className="catalog-back-link" href="/">← Volver al inicio</a><p className="eyebrow">Productos</p><h1>Cuidado para continuar en casa</h1><p>Una selección simple para acompañar tu rutina capilar.</p></div></section>
      <section className="products-page section" aria-labelledby="products-list-title"><div className="container"><div className="catalog-results-heading"><h2 id="products-list-title">Productos disponibles</h2><p>{visible.length} productos</p></div>
        {loading && !visible.length ? <p role="status">Cargando productos…</p> : error && !visible.length ? <div className="public-content-state"><p>{error}</p><button className="button button--outline" onClick={retry}>Reintentar</button></div> : <div className="products-grid">{visible.map((product) => <ProductCard key={product.id} product={product} whatsappNumber={settings.generalWhatsappNumber} />)}</div>}
      </div></section>
    </main>
  )
}
