import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AdminEmpty, AdminError, AdminLoading } from '../components/AdminFeedback'
import { ImageUploadField } from '../components/ImageUploadField'
import { AdminPageHeader } from '../components/AdminPageHeader'
import { categoriesService, professionalsService, stylesService } from '../../services/content'
import { removeSiteImage } from '../../services/storage'
import type { AdminProfessional, AdminStyle, Category } from '../../types/admin'
import { createSlug } from '../../utils/admin'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { DEFAULT_IMAGE_POSITION } from '../../types/image'
import { ImagePositionEditor } from '../components/ImagePositionEditor'
import { PositionedImage } from '../../components/PositionedImage'

const emptyStyle: AdminStyle = {
  id: '', categoryId: '', subcategoryId: null, name: '', slug: '', shortDescription: '', fullDescription: '', imageUrl: '', imagePath: '', imagePosition: { ...DEFAULT_IMAGE_POSITION }, tags: [], featured: false, active: true, displayOrder: 0, estimatedDuration: '', priceFrom: null, professionalIds: [],
}

export function AdminStylesPage() {
  const [styles, setStyles] = useState<AdminStyle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [professionals, setProfessionals] = useState<AdminProfessional[]>([])
  const [editing, setEditing] = useState<AdminStyle | null>(null)
  const [previousImagePath, setPreviousImagePath] = useState('')
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(() => new URLSearchParams(window.location.search).get('categoria') ?? '')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [request, setRequest] = useState(0)
  useDocumentMeta('Estilos | Administración Marilyn Coiffure', 'Gestión privada del catálogo de estilos.')

  useEffect(() => {
    setLoading(true); setError('')
    Promise.all([stylesService.list(), categoriesService.list(), professionalsService.list()])
      .then(([loadedStyles, loadedCategories, loadedProfessionals]) => { setStyles(loadedStyles); setCategories(loadedCategories); setProfessionals(loadedProfessionals) })
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar los estilos.'))
      .finally(() => setLoading(false))
  }, [request])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('nuevo') === '1' && !loading) setEditing({ ...emptyStyle, categoryId: categories.find((item) => item.active && !item.parentCategoryId)?.id ?? '' })
  }, [categories, loading])

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (editing) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn)
  }, [editing])

  useEffect(() => { if (!editing) setPreviousImagePath('') }, [editing])

  const filtered = useMemo(() => styles.filter((style) => {
    const text = `${style.name} ${style.slug} ${style.tags.join(' ')}`.toLocaleLowerCase('es')
    return text.includes(query.toLocaleLowerCase('es')) && (!categoryFilter || style.categoryId === categoryFilter) && (statusFilter === 'all' || (statusFilter === 'active' ? style.active : !style.active))
  }), [categoryFilter, query, statusFilter, styles])
  const mainCategories = useMemo(() => categories.filter((category) => !category.parentCategoryId), [categories])
  const availableSubcategories = useMemo(
    () => categories.filter((category) => category.parentCategoryId === editing?.categoryId),
    [categories, editing?.categoryId],
  )

  const update = <Key extends keyof AdminStyle>(key: Key, value: AdminStyle[Key]) => setEditing((current) => current ? { ...current, [key]: value } : current)
  const startNew = () => { setPreviousImagePath(''); setEditing({ ...emptyStyle, categoryId: categories.find((item) => item.active && !item.parentCategoryId)?.id ?? '', displayOrder: styles.length + 1 }) }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!editing) return
    if (!editing.name.trim()) { setError('El nombre es obligatorio.'); return }
    if (!editing.slug.trim()) { setError('El slug es obligatorio.'); return }
    if (!editing.categoryId) { setError('Seleccioná una categoría.'); return }
    if (editing.subcategoryId && !categories.some((category) => category.id === editing.subcategoryId && category.parentCategoryId === editing.categoryId)) { setError('La subcategoría no pertenece a la categoría principal seleccionada.'); return }
    if (!Number.isInteger(editing.displayOrder) || editing.displayOrder < 0) { setError('El orden debe ser un número entero válido.'); return }
    setSaving(true); setError(''); setMessage('')
    try {
      const saved = await stylesService.save(editing)
      if (previousImagePath && previousImagePath !== saved.imagePath) await removeSiteImage(previousImagePath)
      setStyles((current) => [...current.filter((item) => item.id !== saved.id), saved].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, 'es')))
      setPreviousImagePath(''); setEditing(null); setMessage('Estilo guardado correctamente.')
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar el estilo.') }
    finally { setSaving(false) }
  }

  const remove = async (style: AdminStyle) => {
    if (!window.confirm(`¿Querés eliminar “${style.name}”? Esta acción también quitará sus relaciones con profesionales.`)) return
    setError(''); setMessage('')
    try { await stylesService.remove(style); await removeSiteImage(style.imagePath); setStyles((current) => current.filter((item) => item.id !== style.id)); setMessage('Estilo eliminado.') }
    catch (removeError) { setError(removeError instanceof Error ? removeError.message : 'No se pudo eliminar el estilo.') }
  }

  const toggle = async (style: AdminStyle, field: 'active' | 'featured') => {
    setError('')
    try { const saved = await stylesService.save({ ...style, [field]: !style[field] }); setStyles((current) => current.map((item) => item.id === saved.id ? saved : item)) }
    catch (toggleError) { setError(toggleError instanceof Error ? toggleError.message : 'No se pudo actualizar el estilo.') }
  }

  return (
    <>
      <AdminPageHeader eyebrow="Catálogo" title="Estilos y servicios" description="Gestioná el contenido que se muestra en el catálogo público." actions={<button className="admin-button admin-button--primary" type="button" onClick={startNew}>+ Nuevo estilo</button>} />
      {message && <p className="admin-success" role="status">{message}</p>}
      {error && !editing && <AdminError message={error} onRetry={() => setRequest((value) => value + 1)} />}
      {editing && (
        <section className="admin-panel admin-editor" aria-labelledby="style-form-title">
          <div className="admin-panel__heading"><div><p className="eyebrow">Editor</p><h2 id="style-form-title">{editing.id ? 'Editar estilo' : 'Nuevo estilo'}</h2></div></div>
          <form className="admin-form" onSubmit={submit}>
            <label>Nombre *<input value={editing.name} onChange={(event) => { const previous = createSlug(editing.name); update('name', event.target.value); if (!editing.id || editing.slug === previous) update('slug', createSlug(event.target.value)) }} /></label>
            <label>Slug *<input value={editing.slug} onChange={(event) => update('slug', createSlug(event.target.value))} /></label>
            <label>Categoría principal *<select value={editing.categoryId} onChange={(event) => setEditing((current) => current ? { ...current, categoryId: event.target.value, subcategoryId: null } : current)}><option value="">Seleccionar</option>{mainCategories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.active ? '' : ' (inactiva)'}</option>)}</select></label>
            <label>Subcategoría<select value={editing.subcategoryId ?? ''} onChange={(event) => update('subcategoryId', event.target.value || null)} disabled={!editing.categoryId || availableSubcategories.length === 0}><option value="">{availableSubcategories.length ? 'Sin subcategoría' : 'Esta categoría no tiene subcategorías'}</option>{availableSubcategories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.active ? '' : ' (inactiva)'}</option>)}</select></label>
            <label>Orden<input type="number" min="0" step="1" value={editing.displayOrder} onChange={(event) => update('displayOrder', Number(event.target.value))} /></label>
            <label className="admin-form__wide">Descripción corta<textarea rows={2} maxLength={220} value={editing.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} /></label>
            <label className="admin-form__wide">Descripción completa<textarea rows={5} value={editing.fullDescription} onChange={(event) => update('fullDescription', event.target.value)} /></label>
            <label>Etiquetas separadas por coma<input value={editing.tags.join(', ')} onChange={(event) => update('tags', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></label>
            <label>Duración estimada<input value={editing.estimatedDuration} onChange={(event) => update('estimatedDuration', event.target.value)} /></label>
            <label>Precio desde opcional<input type="number" min="0" step="1" value={editing.priceFrom ?? ''} onChange={(event) => update('priceFrom', event.target.value ? Number(event.target.value) : null)} /></label>
            <div className="admin-form__wide"><ImageUploadField folder="styles" label="Fotografía" imageUrl={editing.imageUrl} imagePosition={editing.imagePosition} onUploaded={(result) => { if (!previousImagePath) setPreviousImagePath(editing.imagePath); setEditing((current) => current ? { ...current, imageUrl: result.publicUrl, imagePath: result.path, imagePosition: { ...DEFAULT_IMAGE_POSITION } } : current) }} /><ImagePositionEditor usage="style" imageUrl={editing.imageUrl} imageAlt={`Vista previa de ${editing.name || 'estilo'}`} value={editing.imagePosition} title={editing.name} category={categories.find((item) => item.id === editing.categoryId)?.name} description={editing.shortDescription} onSave={(imagePosition) => update('imagePosition', imagePosition)} /></div>
            <fieldset className="admin-form__wide admin-checkbox-grid"><legend>Profesionales relacionadas</legend>{professionals.map((professional) => <label className="admin-check" key={professional.id}><input type="checkbox" checked={editing.professionalIds.includes(professional.id)} onChange={(event) => update('professionalIds', event.target.checked ? [...editing.professionalIds, professional.id] : editing.professionalIds.filter((id) => id !== professional.id))} />{professional.name}</label>)}</fieldset>
            <label className="admin-check"><input type="checkbox" checked={editing.active} onChange={(event) => update('active', event.target.checked)} />Visible en la web</label>
            <label className="admin-check"><input type="checkbox" checked={editing.featured} onChange={(event) => update('featured', event.target.checked)} />Destacado en portada</label>
            {error && <p className="admin-field-error admin-form__wide" role="alert">{error}</p>}
            <div className="admin-form__actions admin-form__wide"><button className="admin-button admin-button--primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar estilo'}</button><button className="admin-button admin-button--secondary" type="button" onClick={() => setEditing(null)} disabled={saving}>Cancelar</button></div>
          </form>
        </section>
      )}
      <section className="admin-panel">
        <div className="admin-toolbar"><label>Buscar<input type="search" placeholder="Nombre, slug o etiqueta" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label>Categoría<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="">Todas</option>{mainCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Estado<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Todos</option><option value="active">Activos</option><option value="inactive">Inactivos</option></select></label></div>
        {loading ? <AdminLoading /> : filtered.length === 0 ? <AdminEmpty message="No hay estilos con esos criterios." /> : <div className="admin-style-cards">{filtered.map((style) => { const main = categories.find((item) => item.id === style.categoryId); const child = categories.find((item) => item.id === style.subcategoryId); return <article className="admin-style-card" key={style.id}><div className="admin-style-card__image">{style.imageUrl ? <PositionedImage src={style.imageUrl} alt="" position={style.imagePosition} /> : <span>MC</span>}</div><div className="admin-style-card__content"><p>{child ? `${main?.name ?? 'Sin categoría'} · ${child.name}` : main?.name ?? 'Sin categoría'}</p><h3>{style.name}</h3><small>{style.slug}</small><div className="admin-style-card__statuses"><button className={`admin-status ${style.active ? 'is-active' : ''}`} onClick={() => toggle(style, 'active')}>{style.active ? 'Visible' : 'Oculto'}</button><button className={`admin-status ${style.featured ? 'is-featured' : ''}`} onClick={() => toggle(style, 'featured')}>{style.featured ? 'Destacado' : 'No destacado'}</button><span>Orden {style.displayOrder}</span></div><div className="admin-row-actions"><button onClick={() => setEditing(style)}>Editar</button><button className="is-danger" onClick={() => remove(style)}>Eliminar</button></div></div></article> })}</div>}
      </section>
    </>
  )
}
