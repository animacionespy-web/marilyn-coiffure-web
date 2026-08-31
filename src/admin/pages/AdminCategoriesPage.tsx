import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { PositionedImage } from '../../components/PositionedImage'
import { categoriesService, stylesService } from '../../services/content'
import { removeSiteImage } from '../../services/storage'
import type { AdminStyle, Category } from '../../types/admin'
import { DEFAULT_IMAGE_POSITION } from '../../types/image'
import { createSlug } from '../../utils/admin'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { AdminEmpty, AdminError, AdminLoading } from '../components/AdminFeedback'
import { ImagePositionEditor } from '../components/ImagePositionEditor'
import { ImageUploadField } from '../components/ImageUploadField'
import { AdminPageHeader } from '../components/AdminPageHeader'

const emptyCategory = (parentCategoryId: string | null = null): Category => ({
  id: '', parentCategoryId, name: '', slug: '', description: '', icon: '', coverImageUrl: '', coverImagePath: '',
  coverImagePosition: { ...DEFAULT_IMAGE_POSITION }, ctaLabel: '', ctaHref: '', active: true, displayOrder: 0,
})

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [styles, setStyles] = useState<AdminStyle[]>([])
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Category | null>(null)
  const [previousImagePath, setPreviousImagePath] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [request, setRequest] = useState(0)
  useDocumentMeta('Categorías | Administración Marilyn Coiffure', 'Gestión privada de categorías y subcategorías.')

  useEffect(() => {
    setLoading(true); setError('')
    Promise.all([categoriesService.list(), stylesService.list()])
      .then(([loadedCategories, loadedStyles]) => { setCategories(loadedCategories); setStyles(loadedStyles) })
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar las categorías.'))
      .finally(() => setLoading(false))
  }, [request])

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (editing) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [editing])

  const mainCategories = useMemo(() => categories.filter((category) => !category.parentCategoryId), [categories])
  const openCategory = mainCategories.find((category) => category.id === openCategoryId)
  const openSubcategories = useMemo(() => categories.filter((category) => category.parentCategoryId === openCategoryId), [categories, openCategoryId])
  const update = <Key extends keyof Category>(key: Key, value: Category[Key]) => setEditing((current) => current ? { ...current, [key]: value } : current)
  const beginEdit = (category: Category) => { setPreviousImagePath(''); setError(''); setMessage(''); setEditing({ ...category, coverImagePosition: { ...category.coverImagePosition } }) }
  const beginNew = (parentCategoryId: string | null) => {
    const siblings = categories.filter((category) => category.parentCategoryId === parentCategoryId)
    setPreviousImagePath(''); setEditing({ ...emptyCategory(parentCategoryId), displayOrder: siblings.length + 1 })
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!editing?.name.trim()) { setError('El nombre es obligatorio.'); return }
    if (!editing.slug.trim()) { setError('El slug es obligatorio.'); return }
    if (!Number.isInteger(editing.displayOrder) || editing.displayOrder < 0) { setError('El orden debe ser un número entero igual o mayor que cero.'); return }
    setSaving(true); setError(''); setMessage('')
    try {
      const saved = await categoriesService.save(editing)
      if (previousImagePath && previousImagePath !== saved.coverImagePath) await removeSiteImage(previousImagePath)
      setCategories((current) => [...current.filter((item) => item.id !== saved.id), saved].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, 'es')))
      if (saved.parentCategoryId) setOpenCategoryId(saved.parentCategoryId)
      setPreviousImagePath(''); setEditing(null)
      setMessage(saved.parentCategoryId ? 'Subcategoría guardada correctamente.' : 'Portada de categoría guardada correctamente.')
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar la categoría.') }
    finally { setSaving(false) }
  }

  const remove = async (category: Category) => {
    const label = category.parentCategoryId ? 'subcategoría' : 'categoría'
    if (!window.confirm(`¿Querés eliminar la ${label} “${category.name}”? Se verificará que no tenga contenido relacionado.`)) return
    setError(''); setMessage('')
    try {
      await categoriesService.remove(category.id); await removeSiteImage(category.coverImagePath)
      setCategories((current) => current.filter((item) => item.id !== category.id))
      if (openCategoryId === category.id) setOpenCategoryId(null)
      setMessage(`${category.parentCategoryId ? 'Subcategoría' : 'Categoría'} eliminada.`)
    } catch (removeError) { setError(removeError instanceof Error ? removeError.message : 'No se pudo eliminar la categoría.') }
  }

  const toggle = async (category: Category) => {
    setError(''); setMessage('')
    try {
      const saved = await categoriesService.save({ ...category, active: !category.active })
      setCategories((current) => current.map((item) => item.id === saved.id ? saved : item))
      setMessage(`${saved.name} ahora está ${saved.active ? 'visible' : 'oculta'}.`)
    } catch (toggleError) { setError(toggleError instanceof Error ? toggleError.message : 'No se pudo actualizar el estado.') }
  }

  return <>
    <AdminPageHeader eyebrow="Organización" title="Categorías y contenido" description="Separá las portadas editoriales de sus subcategorías y estilos publicados." actions={<button className="admin-button admin-button--primary" type="button" onClick={() => beginNew(null)}>+ Nueva categoría</button>} />
    {message && <p className="admin-success" role="status">{message}</p>}
    {error && !editing && <AdminError message={error} onRetry={() => setRequest((value) => value + 1)} />}

    {editing && <section className="admin-panel admin-editor" aria-labelledby="category-form-title">
      <div className="admin-panel__heading"><div><p className="eyebrow">{editing.parentCategoryId ? 'Contenido' : 'Portada'}</p><h2 id="category-form-title">{editing.id ? `Editar ${editing.name}` : editing.parentCategoryId ? 'Nueva subcategoría' : 'Nueva categoría'}</h2></div></div>
      <form className="admin-form" onSubmit={submit}>
        <label>Nombre *<input value={editing.name} onChange={(event) => { const oldSlug = createSlug(editing.name); update('name', event.target.value); if (!editing.id || editing.slug === oldSlug) update('slug', createSlug(event.target.value)) }} /></label>
        <label>Slug *<input value={editing.slug} onChange={(event) => update('slug', createSlug(event.target.value))} /></label>
        <label className="admin-form__wide">Descripción<textarea rows={3} value={editing.description} onChange={(event) => update('description', event.target.value)} /></label>
        <label>Etiqueta del botón<input value={editing.ctaLabel} placeholder="Explorar" onChange={(event) => update('ctaLabel', event.target.value)} /></label>
        <label>Enlace del botón<input value={editing.ctaHref} placeholder={`/estilos?categoria=${editing.name || 'Categoría'}`} onChange={(event) => update('ctaHref', event.target.value)} /></label>
        <label>Icono opcional<input value={editing.icon} onChange={(event) => update('icon', event.target.value)} /></label>
        <label>Orden<input type="number" min="0" step="1" value={editing.displayOrder} onChange={(event) => update('displayOrder', Number(event.target.value))} /></label>
        <label className="admin-check"><input type="checkbox" checked={editing.active} onChange={(event) => update('active', event.target.checked)} />Visible en la web</label>
        <div className="admin-form__wide admin-category-cover-editor"><h3>Imagen de portada</h3><ImageUploadField folder="categories" label={`Portada de ${editing.name || 'categoría'}`} imageUrl={editing.coverImageUrl} imagePosition={editing.coverImagePosition} onUploaded={(result) => { if (!previousImagePath) setPreviousImagePath(editing.coverImagePath); setEditing((current) => current ? { ...current, coverImageUrl: result.publicUrl, coverImagePath: result.path, coverImagePosition: { ...DEFAULT_IMAGE_POSITION } } : current) }} /><ImagePositionEditor usage="home-block" imageUrl={editing.coverImageUrl} imageAlt={`Vista previa de ${editing.name || 'categoría'}`} value={editing.coverImagePosition} title={editing.name} description={editing.description} onSave={(coverImagePosition) => update('coverImagePosition', coverImagePosition)} /></div>
        {error && <p className="admin-field-error admin-form__wide" role="alert">{error}</p>}
        <div className="admin-form__actions admin-form__wide"><button className="admin-button admin-button--primary" disabled={saving}>{saving ? 'Guardando…' : editing.parentCategoryId ? 'Guardar subcategoría' : 'Guardar portada'}</button><button className="admin-button admin-button--secondary" type="button" onClick={() => setEditing(null)} disabled={saving}>Cancelar</button></div>
      </form>
    </section>}

    {loading ? <AdminLoading /> : mainCategories.length === 0 ? <AdminEmpty message="No hay categorías principales todavía." /> : <section className="admin-category-layout">
      <div className="admin-category-grid">{mainCategories.map((category) => {
        const children = categories.filter((item) => item.parentCategoryId === category.id)
        const relatedStyles = styles.filter((style) => style.categoryId === category.id)
        return <article className={`admin-category-card ${openCategoryId === category.id ? 'is-open' : ''}`} key={category.id}><div className="admin-category-card__media">{category.coverImageUrl ? <PositionedImage src={category.coverImageUrl} alt="" position={category.coverImagePosition} /> : <span>Portada pendiente</span>}</div><div className="admin-category-card__body"><p>{category.active ? 'Visible' : 'Oculta'} · Orden {category.displayOrder}</p><h2>{category.name}</h2><span>{children.length} {children.length === 1 ? 'subcategoría' : 'subcategorías'} · {relatedStyles.length} {relatedStyles.length === 1 ? 'estilo' : 'estilos'}</span><div className="admin-category-card__actions"><button type="button" onClick={() => beginEdit(category)}>Editar portada</button><button className="is-primary" type="button" onClick={() => setOpenCategoryId((current) => current === category.id ? null : category.id)}>{openCategoryId === category.id ? 'Cerrar contenido' : 'Abrir contenido'}</button></div></div></article>
      })}</div>

      {openCategory && <section className="admin-category-content" aria-labelledby="open-category-title"><div className="admin-category-content__heading"><div><p className="eyebrow">Contenido</p><h2 id="open-category-title">{openCategory.name}</h2><p>Organizá subcategorías y revisá los estilos vinculados sin modificar la portada.</p></div><button className="admin-button admin-button--primary" type="button" onClick={() => beginNew(openCategory.id)}>+ Nueva subcategoría</button></div><div className="admin-subcategory-list">{openSubcategories.length === 0 ? <AdminEmpty message="Esta categoría todavía no tiene subcategorías." /> : openSubcategories.map((subcategory) => {
        const related = styles.filter((style) => style.subcategoryId === subcategory.id)
        return <article className="admin-subcategory-row" key={subcategory.id}><div className="admin-subcategory-row__image">{subcategory.coverImageUrl ? <PositionedImage src={subcategory.coverImageUrl} alt="" position={subcategory.coverImagePosition} /> : <span>MC</span>}</div><div><h3>{subcategory.name}</h3><p>{related.length} {related.length === 1 ? 'estilo asociado' : 'estilos asociados'} · Orden {subcategory.displayOrder}</p><span>{subcategory.active ? 'Visible' : 'Oculta'}</span></div><div className="admin-subcategory-row__actions"><button type="button" onClick={() => beginEdit(subcategory)}>Editar</button><button type="button" onClick={() => toggle(subcategory)}>{subcategory.active ? 'Desactivar' : 'Activar'}</button><button className="is-danger" type="button" onClick={() => remove(subcategory)}>Eliminar</button></div></article>
      })}</div><div className="admin-category-styles"><div><h3>Estilos y trabajos asociados</h3><p>{styles.filter((style) => style.categoryId === openCategory.id).length} contenidos dentro de {openCategory.name}.</p></div><a className="admin-button admin-button--secondary" href={`/admin/estilos?categoria=${encodeURIComponent(openCategory.id)}`}>Administrar estilos</a></div></section>}
    </section>}
  </>
}
