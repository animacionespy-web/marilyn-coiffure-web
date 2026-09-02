import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { productsService } from '../../services/content'
import { removeSiteImage } from '../../services/storage'
import type { AdminProduct } from '../../types/admin'
import { AdminEmpty, AdminError, AdminLoading } from '../components/AdminFeedback'
import { AdminPageHeader } from '../components/AdminPageHeader'
import { ImageUploadField } from '../components/ImageUploadField'
import { ImagePositionEditor } from '../components/ImagePositionEditor'
import { DEFAULT_IMAGE_POSITION } from '../../types/image'
import { PositionedImage } from '../../components/PositionedImage'

const emptyProduct: AdminProduct = {
  id: '', name: '', slug: '', category: '', shortDescription: '', fullDescription: '', imageUrl: '', imagePath: '', imagePosition: { ...DEFAULT_IMAGE_POSITION }, featured: false, active: true, displayOrder: 0, price: null, stockStatus: '',
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const [previousImagePath, setPreviousImagePath] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [request, setRequest] = useState(0)
  const requestedEditHandled = useRef(false)

  useDocumentMeta('Productos | Administración Marilyn Coiffure', 'Gestión privada de los productos del salón.')

  useEffect(() => {
    setLoading(true)
    setError('')
    productsService.list().then(setProducts).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar los productos.')).finally(() => setLoading(false))
  }, [request])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('nuevo') === '1' && !loading) setEditing({ ...emptyProduct, displayOrder: products.length + 1 })
  }, [loading, products.length])

  useEffect(() => {
    if (loading || requestedEditHandled.current) return
    const requested = new URLSearchParams(window.location.search).get('editar')
    if (!requested) return
    const product = products.find((item) => item.id === requested || item.slug === requested)
    if (!product) return
    requestedEditHandled.current = true
    setEditing(product)
  }, [loading, products])

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (editing) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [editing])

  const filtered = useMemo(() => products.filter((product) => `${product.name} ${product.category} ${product.slug}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))), [products, query])
  const update = <Key extends keyof AdminProduct>(key: Key, value: AdminProduct[Key]) => setEditing((current) => current ? { ...current, [key]: value } : current)
  const sortProducts = (items: AdminProduct[]) => items.sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, 'es'))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!editing) return
    if (!editing.name.trim()) { setError('El nombre es obligatorio.'); return }
    if (!editing.category.trim()) { setError('La categoría es obligatoria.'); return }
    if (!Number.isInteger(editing.displayOrder) || editing.displayOrder < 0) { setError('El orden debe ser un número entero válido.'); return }
    if (editing.price !== null && editing.price < 0) { setError('El precio no puede ser negativo.'); return }
    setSaving(true); setError(''); setMessage('')
    try {
      const saved = await productsService.save(editing)
      if (previousImagePath && previousImagePath !== saved.imagePath) await removeSiteImage(previousImagePath)
      setProducts((current) => sortProducts([...current.filter((item) => item.id !== saved.id), saved]))
      setPreviousImagePath(''); setEditing(null); setMessage('Producto guardado correctamente.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar el producto.')
    } finally { setSaving(false) }
  }

  const remove = async (product: AdminProduct) => {
    if (!window.confirm(`¿Querés eliminar “${product.name}”?`)) return
    setError(''); setMessage('')
    try {
      await productsService.remove(product)
      await removeSiteImage(product.imagePath)
      setProducts((current) => current.filter((item) => item.id !== product.id))
      setMessage('Producto eliminado.')
    } catch (removeError) { setError(removeError instanceof Error ? removeError.message : 'No se pudo eliminar el producto.') }
  }

  const toggle = async (product: AdminProduct, field: 'active' | 'featured') => {
    try {
      const saved = await productsService.save({ ...product, [field]: !product[field] })
      setProducts((current) => current.map((item) => item.id === saved.id ? saved : item))
    } catch (toggleError) { setError(toggleError instanceof Error ? toggleError.message : 'No se pudo actualizar el producto.') }
  }

  return <>
    <AdminPageHeader eyebrow="Catálogo" title="Productos" description="Administrá productos, fotografías, orden y visibilidad." actions={<button className="admin-button admin-button--primary" type="button" onClick={() => setEditing({ ...emptyProduct, displayOrder: products.length + 1 })}>+ Nuevo producto</button>} />
    {message && <p className="admin-success" role="status">{message}</p>}
    {error && !editing && <AdminError message={error} onRetry={() => setRequest((value) => value + 1)} />}
    {editing && <section className="admin-panel admin-editor" aria-labelledby="product-form-title">
      <div className="admin-panel__heading"><div><p className="eyebrow">Editor</p><h2 id="product-form-title">{editing.id ? 'Editar producto' : 'Nuevo producto'}</h2></div></div>
      <form className="admin-form" onSubmit={submit}>
        <label>Nombre *<input value={editing.name} onChange={(event) => update('name', event.target.value)} /></label>
        <label>Categoría *<input value={editing.category} onChange={(event) => update('category', event.target.value)} /></label>
        <label>Orden<input type="number" min="0" step="1" value={editing.displayOrder} onChange={(event) => update('displayOrder', Number(event.target.value))} /></label>
        <label className="admin-form__wide">Descripción corta<textarea rows={2} maxLength={180} value={editing.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} /></label>
        <label className="admin-form__wide">Descripción completa<textarea rows={4} value={editing.fullDescription} onChange={(event) => update('fullDescription', event.target.value)} /></label>
        <label>Precio opcional<input type="number" min="0" step="1" value={editing.price ?? ''} onChange={(event) => update('price', event.target.value ? Number(event.target.value) : null)} /></label>
        <label>Estado de stock opcional<input value={editing.stockStatus} onChange={(event) => update('stockStatus', event.target.value)} /></label>
        <div className="admin-form__wide"><ImageUploadField folder="products" label="Fotografía" imageUrl={editing.imageUrl} imagePosition={editing.imagePosition} onUploaded={(result) => { if (!previousImagePath) setPreviousImagePath(editing.imagePath); setEditing((current) => current ? { ...current, imageUrl: result.publicUrl, imagePath: result.path, imagePosition: { ...DEFAULT_IMAGE_POSITION } } : current) }} /><ImagePositionEditor usage="product" imageUrl={editing.imageUrl} imageAlt={`Vista previa de ${editing.name || 'producto'}`} value={editing.imagePosition} title={editing.name} category={editing.category} description={editing.shortDescription} onSave={(imagePosition) => update('imagePosition', imagePosition)} /></div>
        <label className="admin-check"><input type="checkbox" checked={editing.active} onChange={(event) => update('active', event.target.checked)} />Visible en la web</label>
        <label className="admin-check"><input type="checkbox" checked={editing.featured} onChange={(event) => update('featured', event.target.checked)} />Destacado en portada</label>
        {error && <p className="admin-field-error admin-form__wide" role="alert">{error}</p>}
        <div className="admin-form__actions admin-form__wide"><button className="admin-button admin-button--primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar producto'}</button><button className="admin-button admin-button--secondary" type="button" onClick={() => { setEditing(null); setError(''); setPreviousImagePath('') }} disabled={saving}>Cancelar</button></div>
      </form>
    </section>}
    <section className="admin-panel">
      <div className="admin-toolbar"><label>Buscar<input type="search" placeholder="Nombre o categoría" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
      {loading ? <AdminLoading /> : filtered.length === 0 ? <AdminEmpty message="No hay productos con esos criterios." /> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Estado</th><th>Destacado</th><th>Orden</th><th>Acciones</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><td data-label="Producto"><div className="admin-entity"><div className="admin-entity__image">{product.imageUrl ? <PositionedImage src={product.imageUrl} alt="" position={product.imagePosition} /> : <span>MC</span>}</div><div><strong>{product.name}</strong></div></div></td><td data-label="Categoría">{product.category}</td><td data-label="Estado"><button className={`admin-status ${product.active ? 'is-active' : ''}`} onClick={() => toggle(product, 'active')}>{product.active ? 'Activo' : 'Inactivo'}</button></td><td data-label="Destacado"><button className={`admin-status ${product.featured ? 'is-featured' : ''}`} onClick={() => toggle(product, 'featured')}>{product.featured ? 'Sí' : 'No'}</button></td><td data-label="Orden">{product.displayOrder}</td><td data-label="Acciones"><div className="admin-row-actions"><button onClick={() => { setEditing(product); setError(''); setPreviousImagePath('') }}>Editar</button><button className="is-danger" onClick={() => remove(product)}>Eliminar</button></div></td></tr>)}</tbody></table></div>}
    </section>
  </>
}
