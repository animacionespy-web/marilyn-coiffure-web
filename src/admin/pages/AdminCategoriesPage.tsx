import { useEffect, useState, type FormEvent } from 'react'
import { AdminEmpty, AdminError, AdminLoading } from '../components/AdminFeedback'
import { AdminPageHeader } from '../components/AdminPageHeader'
import { categoriesService } from '../../services/content'
import type { Category } from '../../types/admin'
import { createSlug } from '../../utils/admin'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

const emptyCategory: Category = { id: '', name: '', slug: '', description: '', icon: '', active: true, displayOrder: 0 }

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [request, setRequest] = useState(0)
  useDocumentMeta('Categorías | Administración Marilyn Coiffure', 'Gestión privada de categorías.')

  useEffect(() => {
    setLoading(true)
    categoriesService.list().then(setCategories).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar las categorías.')).finally(() => setLoading(false))
  }, [request])

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (editing) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [editing])

  const update = <Key extends keyof Category>(key: Key, value: Category[Key]) => setEditing((current) => current ? { ...current, [key]: value } : current)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!editing?.name.trim()) { setError('El nombre es obligatorio.'); return }
    if (!editing.slug.trim()) { setError('El slug es obligatorio.'); return }
    if (!Number.isInteger(editing.displayOrder) || editing.displayOrder < 0) { setError('El orden debe ser un número entero igual o mayor que cero.'); return }
    setSaving(true); setError(''); setMessage('')
    try {
      const saved = await categoriesService.save(editing)
      setCategories((current) => [...current.filter((item) => item.id !== saved.id), saved].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, 'es')))
      setEditing(null); setMessage('Categoría guardada correctamente.')
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar la categoría.') }
    finally { setSaving(false) }
  }

  const remove = async (category: Category) => {
    if (!window.confirm(`¿Querés eliminar la categoría “${category.name}”? Se verificará que no tenga estilos asociados.`)) return
    setError(''); setMessage('')
    try { await categoriesService.remove(category.id); setCategories((current) => current.filter((item) => item.id !== category.id)); setMessage('Categoría eliminada.') }
    catch (removeError) { setError(removeError instanceof Error ? removeError.message : 'No se pudo eliminar la categoría.') }
  }

  return (
    <>
      <AdminPageHeader eyebrow="Organización" title="Categorías" description="Creá, ordená o desactivá las categorías del catálogo." actions={<button className="admin-button admin-button--primary" type="button" onClick={() => setEditing({ ...emptyCategory })}>+ Nueva categoría</button>} />
      {message && <p className="admin-success" role="status">{message}</p>}
      {error && !editing && <AdminError message={error} onRetry={() => setRequest((value) => value + 1)} />}
      {editing && (
        <section className="admin-panel admin-editor" aria-labelledby="category-form-title">
          <div className="admin-panel__heading"><h2 id="category-form-title">{editing.id ? 'Editar categoría' : 'Nueva categoría'}</h2></div>
          <form className="admin-form" onSubmit={submit}>
            <label>Nombre *<input value={editing.name} onChange={(event) => { update('name', event.target.value); if (!editing.id || editing.slug === createSlug(editing.name)) update('slug', createSlug(event.target.value)) }} /></label>
            <label>Slug *<input value={editing.slug} onChange={(event) => update('slug', createSlug(event.target.value))} /></label>
            <label className="admin-form__wide">Descripción<textarea rows={3} value={editing.description} onChange={(event) => update('description', event.target.value)} /></label>
            <label>Icono opcional<input value={editing.icon} onChange={(event) => update('icon', event.target.value)} /></label>
            <label>Orden<input type="number" min="0" step="1" value={editing.displayOrder} onChange={(event) => update('displayOrder', Number(event.target.value))} /></label>
            <label className="admin-check"><input type="checkbox" checked={editing.active} onChange={(event) => update('active', event.target.checked)} />Categoría activa</label>
            {error && <p className="admin-field-error admin-form__wide" role="alert">{error}</p>}
            <div className="admin-form__actions admin-form__wide"><button className="admin-button admin-button--primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar categoría'}</button><button className="admin-button admin-button--secondary" type="button" onClick={() => setEditing(null)} disabled={saving}>Cancelar</button></div>
          </form>
        </section>
      )}
      <section className="admin-panel">
        {loading ? <AdminLoading /> : categories.length === 0 ? <AdminEmpty message="No hay categorías creadas todavía." /> : (
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Orden</th><th>Categoría</th><th>Slug</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td data-label="Orden">{category.displayOrder}</td><td data-label="Categoría"><strong>{category.name}</strong><small>{category.description}</small></td><td data-label="Slug"><code>{category.slug}</code></td><td data-label="Estado"><span className={`admin-status ${category.active ? 'is-active' : ''}`}>{category.active ? 'Activa' : 'Inactiva'}</span></td><td data-label="Acciones"><div className="admin-row-actions"><button type="button" onClick={() => setEditing(category)}>Editar</button><button type="button" className="is-danger" onClick={() => remove(category)}>Eliminar</button></div></td></tr>)}</tbody></table></div>
        )}
      </section>
    </>
  )
}
