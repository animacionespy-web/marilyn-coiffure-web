import { useEffect, useMemo, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react'
import { Footer } from '../../components/Footer'
import { AdminVisualSectionToolbar, HomeSections, homeEditorSectionLabels, type HomeEditorSectionId } from '../../components/HomeSections'
import { LocationMap } from '../../components/LocationMap'
import { PublicContentPreviewProvider } from '../../hooks/usePublicContent'
import { loadPublicContent, settingsService, type PublicContent } from '../../services/content'
import { removeSiteImage } from '../../services/storage'
import type { SiteSettings } from '../../types/admin'
import { DEFAULT_IMAGE_POSITION } from '../../types/image'
import { AdminError, AdminLoading } from './AdminFeedback'
import { ImagePositionEditor } from './ImagePositionEditor'
import { ImageUploadField } from './ImageUploadField'

type PreviewMode = 'desktop' | 'mobile'

const directManagement: Partial<Record<HomeEditorSectionId, { text: string; href: string }>> = {
  services: { text: 'Administrar portadas y categorías', href: '/admin/categorias' },
  color: { text: 'Administrar estilos de color', href: '/admin/estilos' },
  process: { text: 'Administrar contenido relacionado', href: '/admin/estilos' },
  events: { text: 'Administrar peinados y eventos', href: '/admin/estilos' },
  treatments: { text: 'Administrar tratamientos', href: '/admin/estilos' },
}

function sectionDescription(section: HomeEditorSectionId) {
  const descriptions: Partial<Record<HomeEditorSectionId, string>> = {
    hero: 'Modificá el título, la descripción y la fotografía principal.',
    essence: 'Editá la presentación y la historia del salón.',
    services: 'Las portadas y su contenido se administran desde Categorías.',
    products: 'Los productos se administran en su catálogo y se reflejan automáticamente acá.',
    professionals: 'Las profesionales y sus trabajos reutilizan el editor completo existente.',
    transformations: 'Configurá las dos fotografías independientes de la comparación destacada de la Home.',
    closing: 'Controlá la fotografía editorial que aparece antes del cierre.',
    cta: 'Editá la invitación final y el aviso de confirmación.',
    location: 'Actualizá dirección, enlace y mapa embebido.',
    footer: 'Editá contacto, horarios y redes visibles en el pie de página.',
  }
  return descriptions[section] ?? 'Este bloque utiliza contenido administrado en las secciones existentes del panel.'
}

export function VisualHomeEditor() {
  const [content, setContent] = useState<PublicContent | null>(null)
  const [savedSettings, setSavedSettings] = useState<SiteSettings | null>(null)
  const [draft, setDraft] = useState<SiteSettings | null>(null)
  const [selectedSection, setSelectedSection] = useState<HomeEditorSectionId | null>('hero')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [request, setRequest] = useState(0)
  const [retiredImagePaths, setRetiredImagePaths] = useState<string[]>([])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    loadPublicContent()
      .then((loaded) => {
        if (!active) return
        setContent(loaded)
        setSavedSettings(loaded.settings)
        setDraft(structuredClone(loaded.settings))
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar la página para editarla.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [request])

  const dirty = useMemo(() => Boolean(draft && savedSettings && JSON.stringify(draft) !== JSON.stringify(savedSettings)), [draft, savedSettings])
  const previewContent = useMemo<PublicContent | null>(() => content && draft ? { ...content, settings: draft } : null, [content, draft])

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const update = <Key extends keyof SiteSettings>(key: Key, value: SiteSettings[Key]) => {
    setMessage('')
    setDraft((current) => current ? { ...current, [key]: value } : current)
  }

  const retirePath = (path: string) => {
    if (!path) return
    setRetiredImagePaths((current) => current.includes(path) ? current : [...current, path])
  }

  const requestSection = (section: HomeEditorSectionId) => {
    if (section !== selectedSection && dirty && !window.confirm('Tenés cambios sin guardar. ¿Querés cambiar de sección y conservarlos todavía sin guardar?')) return
    setSelectedSection(section)
    setMessage('')
  }

  const closePanel = () => {
    if (dirty && !window.confirm('Tenés cambios sin guardar. ¿Querés cerrar el panel sin descartarlos?')) return
    setSelectedSection(null)
  }

  const leaveEditor = (href: string) => {
    if (dirty && !window.confirm('Tenés cambios sin guardar. Si salís del editor se perderán. ¿Querés continuar?')) return
    window.location.href = href
  }

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!draft || !dirty) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await settingsService.save(draft)
      await Promise.all(retiredImagePaths.filter(Boolean).map(removeSiteImage))
      setRetiredImagePaths([])
      setSavedSettings(structuredClone(draft))
      setContent((current) => current ? { ...current, settings: draft } : current)
      setMessage('✓ Cambios guardados')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudieron guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  const discard = () => {
    if (!savedSettings || !window.confirm('¿Querés descartar todos los cambios sin guardar?')) return
    setDraft(structuredClone(savedSettings))
    setRetiredImagePaths([])
    setMessage('Cambios descartados.')
  }

  const handlePreviewClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.closest('[data-admin-action]')) return
    const section = target.closest<HTMLElement>('[data-section]')?.dataset.section as HomeEditorSectionId | undefined
    if (!section) return
    event.preventDefault()
    requestSection(section)
  }

  if (loading) return <AdminLoading label="Preparando el editor visual…" />
  if (!draft || !previewContent) return <AdminError message={error || 'No pudimos preparar el editor visual.'} onRetry={() => setRequest((value) => value + 1)} />

  return (
    <section className={`admin-visual-editor ${selectedSection ? 'has-panel' : ''}`}>
      <header className="admin-visual-toolbar">
        <div><p>Editor de página</p><strong>Inicio</strong>{dirty && <span className="admin-unsaved-indicator">Cambios sin guardar</span>}</div>
        <div className="admin-visual-toolbar__views" role="group" aria-label="Tamaño de la vista previa">
          <button className={previewMode === 'desktop' ? 'is-active' : ''} type="button" onClick={() => setPreviewMode('desktop')}>Desktop</button>
          <button className={previewMode === 'mobile' ? 'is-active' : ''} type="button" onClick={() => setPreviewMode('mobile')}>Mobile</button>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer">Ver página pública ↗</a>
      </header>

      {message && <p className={`admin-visual-feedback ${message.startsWith('✓') ? 'is-success' : ''}`} role="status">{message}</p>}
      {error && <p className="admin-field-error admin-visual-feedback" role="alert">{error}</p>}

      <div className="admin-visual-editor__workspace">
        <div className={`admin-home-preview admin-home-preview--${previewMode}`}>
          <div className="admin-home-preview__viewport">
            <PublicContentPreviewProvider content={previewContent}>
              <div className="admin-home-preview__canvas" onClickCapture={handlePreviewClick}>
                <main className="maqueta-home">
                  <HomeSections editor={{
                    selectedSection,
                    onEditSection: requestSection,
                    onEditProfessional: (professionalId, target) => leaveEditor(`/admin/profesionales?editar=${encodeURIComponent(professionalId)}${target === 'works' ? '&seccion=trabajos' : ''}`),
                    onEditProduct: (productId) => leaveEditor(`/admin/productos?editar=${encodeURIComponent(productId)}`),
                  }} />
                </main>
                <div className={`admin-visual-section ${selectedSection === 'footer' ? 'is-selected' : ''}`} data-section="footer">
                  <AdminVisualSectionToolbar id="footer" onEdit={requestSection} />
                  <Footer />
                </div>
              </div>
            </PublicContentPreviewProvider>
          </div>
        </div>

        {selectedSection && (
          <aside className="admin-visual-panel" aria-labelledby="visual-panel-title">
            <div className="admin-visual-panel__heading"><div><p className="eyebrow">Editando</p><h2 id="visual-panel-title">{homeEditorSectionLabels[selectedSection]}</h2><p>{sectionDescription(selectedSection)}</p></div><button type="button" onClick={closePanel} aria-label="Cerrar panel de edición">×</button></div>
            <form onSubmit={save}>
              <div className="admin-visual-panel__fields">
                {selectedSection === 'hero' && <>
                  <label>Título principal<input value={draft.heroTitle} onChange={(event) => update('heroTitle', event.target.value)} /></label>
                  <label>Descripción<textarea rows={4} value={draft.heroDescription} onChange={(event) => update('heroDescription', event.target.value)} /></label>
                  <ImageUploadField folder="home" label="Fotografía principal" imageUrl={draft.heroImageUrl} imagePosition={{ zoom: draft.heroImageZoom, positionX: draft.heroImagePositionX, positionY: draft.heroImagePositionY }} onUploaded={(result) => { retirePath(draft.heroImagePath); setDraft((current) => current ? { ...current, heroImageUrl: result.publicUrl, heroImagePath: result.path, heroImageZoom: 1, heroImagePositionX: 50, heroImagePositionY: 50 } : current) }} />
                  <ImagePositionEditor usage="hero" imageUrl={draft.heroImageUrl} imageAlt="Vista previa de la portada" value={{ zoom: draft.heroImageZoom, positionX: draft.heroImagePositionX, positionY: draft.heroImagePositionY }} title={draft.heroTitle} onSave={(position) => setDraft((current) => current ? { ...current, heroImageZoom: position.zoom, heroImagePositionX: position.positionX, heroImagePositionY: position.positionY } : current)} />
                </>}

                {selectedSection === 'essence' && <>
                  <label>Título<input value={draft.aboutTitle} onChange={(event) => update('aboutTitle', event.target.value)} /></label>
                  <label>Presentación<textarea rows={9} value={draft.aboutText} onChange={(event) => update('aboutText', event.target.value)} /></label>
                </>}

                {selectedSection === 'location' && <>
                  <label>Dirección visible<input value={draft.locationAddress} onChange={(event) => update('locationAddress', event.target.value)} /></label>
                  <label>Enlace Google Maps<input type="url" value={draft.locationMapsUrl} onChange={(event) => update('locationMapsUrl', event.target.value)} /></label>
                  <label>URL de mapa embebido<input type="url" value={draft.locationEmbedUrl} onChange={(event) => update('locationEmbedUrl', event.target.value)} /></label>
                  <LocationMap embedUrl={draft.locationEmbedUrl} mapsUrl={draft.locationMapsUrl} title="Vista previa de la ubicación" />
                </>}

                {selectedSection === 'cta' && <>
                  <label>Título<input value={draft.ctaTitle} onChange={(event) => update('ctaTitle', event.target.value)} /></label>
                  <label>Descripción<textarea rows={4} value={draft.ctaDescription} onChange={(event) => update('ctaDescription', event.target.value)} /></label>
                  <label>Aviso de confirmación<textarea rows={4} value={draft.formDisclaimer} onChange={(event) => update('formDisclaimer', event.target.value)} /></label>
                </>}

                {selectedSection === 'closing' && <>
                  <p className="admin-visual-panel__intro">Esta fotografía pertenece únicamente al cierre editorial de la Home.</p>
                  <ImageUploadField folder="home" label="Imagen editorial final" imageUrl={draft.finalEditorialImageUrl} imagePosition={{ zoom: draft.finalEditorialImageZoom, positionX: draft.finalEditorialImagePositionX, positionY: draft.finalEditorialImagePositionY }} onUploaded={(result) => { retirePath(draft.finalEditorialImagePath); setDraft((current) => current ? { ...current, finalEditorialImageUrl: result.publicUrl, finalEditorialImagePath: result.path, finalEditorialImageZoom: 1, finalEditorialImagePositionX: 50, finalEditorialImagePositionY: 50 } : current) }} />
                  {draft.finalEditorialImageUrl && <button className="admin-button admin-button--secondary" type="button" onClick={() => { retirePath(draft.finalEditorialImagePath); setDraft((current) => current ? { ...current, finalEditorialImageUrl: '', finalEditorialImagePath: '', finalEditorialImageZoom: 1, finalEditorialImagePositionX: 50, finalEditorialImagePositionY: 50 } : current) }}>Quitar imagen</button>}
                  <ImagePositionEditor usage="footer" imageUrl={draft.finalEditorialImageUrl} imageAlt="Vista previa de la imagen editorial final" value={{ zoom: draft.finalEditorialImageZoom, positionX: draft.finalEditorialImagePositionX, positionY: draft.finalEditorialImagePositionY }} onSave={(position) => setDraft((current) => current ? { ...current, finalEditorialImageZoom: position.zoom, finalEditorialImagePositionX: position.positionX, finalEditorialImagePositionY: position.positionY } : current)} />
                </>}

                {selectedSection === 'footer' && <>
                  <label>Dirección de contacto<input value={draft.address} onChange={(event) => update('address', event.target.value)} /></label>
                  <label>Horario<textarea rows={3} value={draft.openingHours} onChange={(event) => update('openingHours', event.target.value)} /></label>
                  <label>Instagram<input type="url" value={draft.instagramUrl} onChange={(event) => update('instagramUrl', event.target.value)} /></label>
                  <label>Facebook<input type="url" value={draft.facebookUrl} onChange={(event) => update('facebookUrl', event.target.value)} /></label>
                </>}

                {selectedSection === 'professionals' && <div className="admin-visual-entity-list">{previewContent.professionals.slice(0, 8).map((professional) => <article key={professional.id}><div><strong>{professional.name}</strong><small>{professional.specialties[0] || professional.role}</small></div><div><button type="button" onClick={() => leaveEditor(`/admin/profesionales?editar=${encodeURIComponent(professional.id)}`)}>Editar profesional</button><button type="button" onClick={() => leaveEditor(`/admin/profesionales?editar=${encodeURIComponent(professional.id)}&seccion=trabajos`)}>Editar trabajos</button></div></article>)}<button className="admin-button admin-button--primary" type="button" onClick={() => leaveEditor('/admin/profesionales')}>Administrar profesionales</button></div>}

                {selectedSection === 'products' && <div className="admin-visual-entity-list">{previewContent.products.slice(0, 8).map((product) => <article key={product.id}><div><strong>{product.name}</strong><small>{product.category}</small></div><button type="button" onClick={() => leaveEditor(`/admin/productos?editar=${encodeURIComponent(product.id)}`)}>Editar producto</button></article>)}<button className="admin-button admin-button--primary" type="button" onClick={() => leaveEditor('/admin/productos')}>Administrar productos</button></div>}

                {selectedSection === 'transformations' && <div className="admin-home-comparison-editor">
                  <p className="admin-visual-panel__intro">Comparación destacada de la página principal.</p>
                  <label>Título opcional<input value={draft.homeBeforeAfterTitle} onChange={(event) => update('homeBeforeAfterTitle', event.target.value)} /></label>
                  <label>Texto opcional<textarea rows={3} value={draft.homeBeforeAfterText} onChange={(event) => update('homeBeforeAfterText', event.target.value)} /></label>
                  <section className="admin-home-comparison-editor__side" aria-labelledby="admin-home-before-title">
                    <h3 id="admin-home-before-title">Antes</h3>
                    <ImageUploadField folder="home" label="Fotografía Antes" imageUrl={draft.homeBeforeImageUrl} imagePosition={{ zoom: draft.homeBeforeImageZoom, positionX: draft.homeBeforeImagePositionX, positionY: draft.homeBeforeImagePositionY }} onUploaded={(result) => { retirePath(draft.homeBeforeImagePath); setDraft((current) => current ? { ...current, homeBeforeImageUrl: result.publicUrl, homeBeforeImagePath: result.path, homeBeforeImageZoom: 1, homeBeforeImagePositionX: 50, homeBeforeImagePositionY: 50 } : current) }} />
                    <ImagePositionEditor usage="professional-work" imageUrl={draft.homeBeforeImageUrl} imageAlt="Vista previa de la fotografía Antes" value={{ zoom: draft.homeBeforeImageZoom, positionX: draft.homeBeforeImagePositionX, positionY: draft.homeBeforeImagePositionY }} title="Antes" onSave={(position) => setDraft((current) => current ? { ...current, homeBeforeImageZoom: position.zoom, homeBeforeImagePositionX: position.positionX, homeBeforeImagePositionY: position.positionY } : current)} />
                  </section>
                  <section className="admin-home-comparison-editor__side" aria-labelledby="admin-home-after-title">
                    <h3 id="admin-home-after-title">Después</h3>
                    <ImageUploadField folder="home" label="Fotografía Después" imageUrl={draft.homeAfterImageUrl} imagePosition={{ zoom: draft.homeAfterImageZoom, positionX: draft.homeAfterImagePositionX, positionY: draft.homeAfterImagePositionY }} onUploaded={(result) => { retirePath(draft.homeAfterImagePath); setDraft((current) => current ? { ...current, homeAfterImageUrl: result.publicUrl, homeAfterImagePath: result.path, homeAfterImageZoom: 1, homeAfterImagePositionX: 50, homeAfterImagePositionY: 50 } : current) }} />
                    <ImagePositionEditor usage="professional-work" imageUrl={draft.homeAfterImageUrl} imageAlt="Vista previa de la fotografía Después" value={{ zoom: draft.homeAfterImageZoom, positionX: draft.homeAfterImagePositionX, positionY: draft.homeAfterImagePositionY }} title="Después" onSave={(position) => setDraft((current) => current ? { ...current, homeAfterImageZoom: position.zoom, homeAfterImagePositionX: position.positionX, homeAfterImagePositionY: position.positionY } : current)} />
                  </section>
                </div>}

                {directManagement[selectedSection] && <div className="admin-visual-direct"><p>Este bloque se alimenta de los estilos y trabajos publicados, por eso se administra desde su editor especializado.</p><button className="admin-button admin-button--primary" type="button" onClick={() => leaveEditor(directManagement[selectedSection]!.href)}>{directManagement[selectedSection]!.text}</button></div>}
              </div>

              <div className="admin-visual-panel__status" aria-live="polite">{dirty ? <span>● Cambios sin guardar</span> : <span className="is-saved">✓ Todo guardado</span>}</div>
              <div className="admin-visual-panel__actions"><button className="admin-button admin-button--primary" disabled={!dirty || saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button><button className="admin-button admin-button--secondary" type="button" disabled={!dirty || saving} onClick={discard}>Descartar</button></div>
            </form>
          </aside>
        )}
      </div>
    </section>
  )
}
