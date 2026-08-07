import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AdminEmpty, AdminError, AdminLoading } from '../components/AdminFeedback'
import { ImageUploadField } from '../components/ImageUploadField'
import { AdminPageHeader } from '../components/AdminPageHeader'
import { professionalsService, stylesService } from '../../services/content'
import { removeSiteImage } from '../../services/storage'
import type { AdminProfessional, AdminStyle } from '../../types/admin'
import { createSlug, validateInternationalWhatsapp } from '../../utils/admin'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { DEFAULT_IMAGE_POSITION } from '../../types/image'
import { ImagePositionEditor } from '../components/ImagePositionEditor'

const emptyProfessional: AdminProfessional = {
  id: '', name: '', slug: '', role: '', shortDescription: '', fullDescription: '', imageUrl: '', imagePath: '', imagePosition: { ...DEFAULT_IMAGE_POSITION }, whatsappNumber: '', specialties: [], featured: false, active: true, displayOrder: 0, availabilityNote: '', instagramUrl: '', styleIds: [],
}

export function AdminProfessionalsPage() {
  const [professionals, setProfessionals] = useState<AdminProfessional[]>([])
  const [styles, setStyles] = useState<AdminStyle[]>([])
  const [editing, setEditing] = useState<AdminProfessional | null>(null)
  const [previousImagePath, setPreviousImagePath] = useState('')
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [request, setRequest] = useState(0)
  useDocumentMeta('Profesionales | Administración Marilyn Coiffure', 'Gestión privada del equipo profesional.')

  useEffect(() => {
    setLoading(true); setError('')
    Promise.all([professionalsService.list(), stylesService.list()]).then(([loadedProfessionals, loadedStyles]) => { setProfessionals(loadedProfessionals); setStyles(loadedStyles) }).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar las profesionales.')).finally(() => setLoading(false))
  }, [request])

  useEffect(() => { if (new URLSearchParams(window.location.search).get('nuevo') === '1' && !loading) setEditing({ ...emptyProfessional, displayOrder: professionals.length + 1 }) }, [loading, professionals.length])
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (editing) { event.preventDefault(); event.returnValue = '' } }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn) }, [editing])
  useEffect(() => { if (!editing) setPreviousImagePath('') }, [editing])

  const specialties = useMemo(() => Array.from(new Set(professionals.flatMap((item) => item.specialties))).sort((a, b) => a.localeCompare(b, 'es')), [professionals])
  const filtered = useMemo(() => professionals.filter((professional) => `${professional.name} ${professional.role} ${professional.specialties.join(' ')}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')) && (!specialty || professional.specialties.includes(specialty))), [professionals, query, specialty])
  const update = <Key extends keyof AdminProfessional>(key: Key, value: AdminProfessional[Key]) => setEditing((current) => current ? { ...current, [key]: value } : current)

  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!editing) return
    if (!editing.name.trim()) { setError('El nombre es obligatorio.'); return }
    if (!editing.slug.trim()) { setError('El slug es obligatorio.'); return }
    const phoneError = validateInternationalWhatsapp(editing.whatsappNumber); if (phoneError) { setError(phoneError); return }
    if (!Number.isInteger(editing.displayOrder) || editing.displayOrder < 0) { setError('El orden debe ser un número entero válido.'); return }
    setSaving(true); setError(''); setMessage('')
    try { const saved = await professionalsService.save(editing); if (previousImagePath && previousImagePath !== saved.imagePath) await removeSiteImage(previousImagePath); setProfessionals((current) => [...current.filter((item) => item.id !== saved.id), saved].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, 'es'))); setPreviousImagePath(''); setEditing(null); setMessage('Profesional guardada correctamente.') }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar la profesional.') }
    finally { setSaving(false) }
  }

  const remove = async (professional: AdminProfessional) => {
    if (!window.confirm(`¿Querés eliminar a “${professional.name}”? También se quitarán sus relaciones con estilos.`)) return
    setError(''); setMessage('')
    try { await professionalsService.remove(professional); await removeSiteImage(professional.imagePath); setProfessionals((current) => current.filter((item) => item.id !== professional.id)); setMessage('Profesional eliminada.') }
    catch (removeError) { setError(removeError instanceof Error ? removeError.message : 'No se pudo eliminar la profesional.') }
  }

  const toggle = async (professional: AdminProfessional, field: 'active' | 'featured') => {
    try { const saved = await professionalsService.save({ ...professional, [field]: !professional[field] }); setProfessionals((current) => current.map((item) => item.id === saved.id ? saved : item)) }
    catch (toggleError) { setError(toggleError instanceof Error ? toggleError.message : 'No se pudo actualizar la profesional.') }
  }

  return (
    <>
      <AdminPageHeader eyebrow="Equipo" title="Profesionales" description="Actualizá perfiles, especialidades, fotografías y números de WhatsApp." actions={<button className="admin-button admin-button--primary" type="button" onClick={() => setEditing({ ...emptyProfessional, displayOrder: professionals.length + 1 })}>+ Nueva profesional</button>} />
      {message && <p className="admin-success" role="status">{message}</p>}
      {error && !editing && <AdminError message={error} onRetry={() => setRequest((value) => value + 1)} />}
      {editing && <section className="admin-panel admin-editor" aria-labelledby="professional-form-title"><div className="admin-panel__heading"><div><p className="eyebrow">Editor</p><h2 id="professional-form-title">{editing.id ? 'Editar profesional' : 'Nueva profesional'}</h2></div></div><form className="admin-form" onSubmit={submit}>
        <label>Nombre *<input value={editing.name} onChange={(event) => { const previous = createSlug(editing.name); update('name', event.target.value); if (!editing.id || editing.slug === previous) update('slug', createSlug(event.target.value)) }} /></label>
        <label>Slug *<input value={editing.slug} onChange={(event) => update('slug', createSlug(event.target.value))} /></label>
        <label>Rol o cargo<input value={editing.role} onChange={(event) => update('role', event.target.value)} /></label>
        <label>Orden<input type="number" min="0" step="1" value={editing.displayOrder} onChange={(event) => update('displayOrder', Number(event.target.value))} /></label>
        <label className="admin-form__wide">Especialidades separadas por coma<input value={editing.specialties.join(', ')} onChange={(event) => update('specialties', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></label>
        <label className="admin-form__wide">Descripción corta<textarea rows={2} value={editing.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} /></label>
        <label className="admin-form__wide">Descripción completa<textarea rows={5} value={editing.fullDescription} onChange={(event) => update('fullDescription', event.target.value)} /></label>
        <label>Número de WhatsApp<input inputMode="numeric" placeholder="595XXXXXXXXX" value={editing.whatsappNumber} onChange={(event) => update('whatsappNumber', event.target.value.replace(/\D/g, ''))} /><small>Formato internacional, sin espacios ni signo +. Puede quedar vacío.</small></label>
        <label>Instagram opcional<input type="url" value={editing.instagramUrl} onChange={(event) => update('instagramUrl', event.target.value)} /></label>
        <label className="admin-form__wide">Nota de atención<textarea rows={2} value={editing.availabilityNote} onChange={(event) => update('availabilityNote', event.target.value)} /></label>
        <div className="admin-form__wide"><ImageUploadField folder="professionals" label="Fotografía" imageUrl={editing.imageUrl} onUploaded={(result) => { if (!previousImagePath) setPreviousImagePath(editing.imagePath); setEditing((current) => current ? { ...current, imageUrl: result.publicUrl, imagePath: result.path, imagePosition: { ...DEFAULT_IMAGE_POSITION } } : current) }} /><ImagePositionEditor imageUrl={editing.imageUrl} imageAlt={`Vista previa de ${editing.name || 'profesional'}`} value={editing.imagePosition} previews={[{ label: 'Tarjeta de profesional', aspectRatio: '4 / 5' }]} onSave={(imagePosition) => update('imagePosition', imagePosition)} /></div>
        <fieldset className="admin-form__wide admin-checkbox-grid"><legend>Estilos relacionados</legend>{styles.map((style) => <label className="admin-check" key={style.id}><input type="checkbox" checked={editing.styleIds.includes(style.id)} onChange={(event) => update('styleIds', event.target.checked ? [...editing.styleIds, style.id] : editing.styleIds.filter((id) => id !== style.id))} />{style.name}</label>)}</fieldset>
        <label className="admin-check"><input type="checkbox" checked={editing.active} onChange={(event) => update('active', event.target.checked)} />Visible en la web</label><label className="admin-check"><input type="checkbox" checked={editing.featured} onChange={(event) => update('featured', event.target.checked)} />Profesional destacada</label>
        {error && <p className="admin-field-error admin-form__wide" role="alert">{error}</p>}
        <div className="admin-form__actions admin-form__wide"><button className="admin-button admin-button--primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar profesional'}</button><button className="admin-button admin-button--secondary" type="button" onClick={() => setEditing(null)} disabled={saving}>Cancelar</button></div>
      </form></section>}
      <section className="admin-panel"><div className="admin-toolbar"><label>Buscar<input type="search" placeholder="Nombre, rol o especialidad" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label>Especialidad<select value={specialty} onChange={(event) => setSpecialty(event.target.value)}><option value="">Todas</option>{specialties.map((item) => <option key={item}>{item}</option>)}</select></label></div>
        {loading ? <AdminLoading /> : filtered.length === 0 ? <AdminEmpty message="No hay profesionales con esos criterios." /> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Profesional</th><th>Especialidades</th><th>Estado</th><th>Destacada</th><th>WhatsApp</th><th>Acciones</th></tr></thead><tbody>{filtered.map((professional) => <tr key={professional.id}><td data-label="Profesional"><div className="admin-entity"><div className="admin-entity__image">{professional.imageUrl ? <img src={professional.imageUrl} alt="" /> : <span>MC</span>}</div><div><strong>{professional.name}</strong><small>{professional.role}</small></div></div></td><td data-label="Especialidades">{professional.specialties.join(', ') || 'Sin configurar'}</td><td data-label="Estado"><button className={`admin-status ${professional.active ? 'is-active' : ''}`} onClick={() => toggle(professional, 'active')}>{professional.active ? 'Activa' : 'Inactiva'}</button></td><td data-label="Destacada"><button className={`admin-status ${professional.featured ? 'is-featured' : ''}`} onClick={() => toggle(professional, 'featured')}>{professional.featured ? 'Sí' : 'No'}</button></td><td data-label="WhatsApp"><span className={`admin-status ${professional.whatsappNumber ? 'is-active' : ''}`}>{professional.whatsappNumber || 'Sin configurar'}</span></td><td data-label="Acciones"><div className="admin-row-actions"><button onClick={() => setEditing(professional)}>Editar</button><button className="is-danger" onClick={() => remove(professional)}>Eliminar</button></div></td></tr>)}</tbody></table></div>}
      </section>
    </>
  )
}
