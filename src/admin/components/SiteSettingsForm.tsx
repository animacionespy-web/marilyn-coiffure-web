import { useEffect, useState, type FormEvent } from 'react'
import { settingsService } from '../../services/content'
import type { SiteSettings } from '../../types/admin'
import { validateInternationalWhatsapp } from '../../utils/admin'
import { removeSiteImage } from '../../services/storage'
import { AdminError, AdminLoading } from './AdminFeedback'
import { ImageUploadField } from './ImageUploadField'
import { ImagePositionEditor } from './ImagePositionEditor'
import { DEFAULT_IMAGE_POSITION } from '../../types/image'
import { LocationMap } from '../../components/LocationMap'

export function SiteSettingsForm({ section }: { section: 'content' | 'configuration' }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [request, setRequest] = useState(0)
  const [previousHeroImagePath, setPreviousHeroImagePath] = useState('')
  const [previousFooterImagePath, setPreviousFooterImagePath] = useState('')

  useEffect(() => { setLoading(true); settingsService.get().then(setSettings).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar el contenido.')).finally(() => setLoading(false)) }, [request])
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = '' } }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn) }, [dirty])

  const update = <Key extends keyof SiteSettings>(key: Key, value: SiteSettings[Key]) => { setDirty(true); setMessage(''); setSettings((current) => current ? { ...current, [key]: value } : current) }

  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!settings) return
    if (section === 'configuration') { const phoneError = validateInternationalWhatsapp(settings.generalWhatsappNumber); if (phoneError) { setError(phoneError); return } }
    setSaving(true); setError(''); setMessage('')
    try {
      const values = section === 'content' ? {
        heroTitle: settings.heroTitle, heroDescription: settings.heroDescription, heroImageUrl: settings.heroImageUrl, heroImagePath: settings.heroImagePath, heroImageZoom: settings.heroImageZoom, heroImagePositionX: settings.heroImagePositionX, heroImagePositionY: settings.heroImagePositionY, footerImageUrl: settings.footerImageUrl, footerImagePath: settings.footerImagePath, footerImageZoom: settings.footerImageZoom, footerImagePositionX: settings.footerImagePositionX, footerImagePositionY: settings.footerImagePositionY, aboutTitle: settings.aboutTitle, aboutText: settings.aboutText, ctaTitle: settings.ctaTitle, ctaDescription: settings.ctaDescription, formDisclaimer: settings.formDisclaimer, specialties: settings.specialties, locationMapsUrl: settings.locationMapsUrl, locationEmbedUrl: settings.locationEmbedUrl, locationAddress: settings.locationAddress,
      } : {
        salonName: settings.salonName, generalWhatsappNumber: settings.generalWhatsappNumber.replace(/\D/g, ''), domain: settings.domain, instagramUrl: settings.instagramUrl, facebookUrl: settings.facebookUrl, address: settings.address, openingHours: settings.openingHours, seoTitle: settings.seoTitle, seoDescription: settings.seoDescription,
      }
      await settingsService.save(values)
      if (previousHeroImagePath && previousHeroImagePath !== settings.heroImagePath) await removeSiteImage(previousHeroImagePath)
      if (previousFooterImagePath && previousFooterImagePath !== settings.footerImagePath) await removeSiteImage(previousFooterImagePath)
      setPreviousHeroImagePath(''); setPreviousFooterImagePath(''); setDirty(false); setMessage('Cambios guardados correctamente.')
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'No se pudieron guardar los cambios.') }
    finally { setSaving(false) }
  }

  if (loading) return <AdminLoading />
  if (!settings) return <AdminError message={error || 'No pudimos cargar la configuración.'} onRetry={() => setRequest((value) => value + 1)} />

  return (
    <form className="admin-panel admin-form admin-settings-form" onSubmit={submit}>
      {section === 'content' ? <>
        <div className="admin-form-section admin-form__wide"><p className="eyebrow">Portada</p><h2>Presentación principal</h2></div>
        <label className="admin-form__wide">Título principal<input value={settings.heroTitle} onChange={(event) => update('heroTitle', event.target.value)} /></label>
        <label className="admin-form__wide">Texto secundario<textarea rows={3} value={settings.heroDescription} onChange={(event) => update('heroDescription', event.target.value)} /></label>
        <div className="admin-form__wide"><ImageUploadField folder="home" label="Imagen principal de la dueña" imageUrl={settings.heroImageUrl} imagePosition={{ zoom: settings.heroImageZoom, positionX: settings.heroImagePositionX, positionY: settings.heroImagePositionY }} onUploaded={(result) => { if (!previousHeroImagePath) setPreviousHeroImagePath(settings.heroImagePath); setDirty(true); setSettings((current) => current ? { ...current, heroImageUrl: result.publicUrl, heroImagePath: result.path, heroImageZoom: 1, heroImagePositionX: 50, heroImagePositionY: 50 } : current) }} /><ImagePositionEditor usage="hero" imageUrl={settings.heroImageUrl} imageAlt="Vista previa de la portada" value={{ zoom: settings.heroImageZoom, positionX: settings.heroImagePositionX, positionY: settings.heroImagePositionY }} onSave={(position) => { update('heroImageZoom', position.zoom); update('heroImagePositionX', position.positionX); update('heroImagePositionY', position.positionY) }} /></div>
        <div className="admin-form-section admin-form__wide"><p className="eyebrow">Salón</p><h2>Presentación y llamada a la acción</h2></div>
        <label className="admin-form__wide">Título sobre el salón<input value={settings.aboutTitle} onChange={(event) => update('aboutTitle', event.target.value)} /></label>
        <label className="admin-form__wide">Texto sobre el salón<textarea rows={6} value={settings.aboutText} onChange={(event) => update('aboutText', event.target.value)} /></label>
        <div className="admin-form-section admin-form__wide"><p className="eyebrow">Imagen final del sitio</p><h2>Fotografía del bloque sobre el salón</h2><p>Reemplaza el monograma MC. Si la quitás, el fallback elegante se mantiene.</p></div>
        <div className="admin-form__wide">
          <ImageUploadField folder="home" label="Imagen final" imageUrl={settings.footerImageUrl} imagePosition={{ zoom: settings.footerImageZoom, positionX: settings.footerImagePositionX, positionY: settings.footerImagePositionY }} onUploaded={(result) => { if (!previousFooterImagePath) setPreviousFooterImagePath(settings.footerImagePath); setDirty(true); setSettings((current) => current ? { ...current, footerImageUrl: result.publicUrl, footerImagePath: result.path, footerImageZoom: 1, footerImagePositionX: 50, footerImagePositionY: 50 } : current) }} />
          {settings.footerImageUrl && <div className="admin-inline-actions"><button className="admin-button admin-button--secondary" type="button" onClick={() => { if (!previousFooterImagePath) setPreviousFooterImagePath(settings.footerImagePath); setDirty(true); setSettings((current) => current ? { ...current, footerImageUrl: '', footerImagePath: '', footerImageZoom: DEFAULT_IMAGE_POSITION.zoom, footerImagePositionX: DEFAULT_IMAGE_POSITION.positionX, footerImagePositionY: DEFAULT_IMAGE_POSITION.positionY } : current) }}>Quitar imagen final</button></div>}
          <ImagePositionEditor usage="footer" imageUrl={settings.footerImageUrl} imageAlt="Vista previa de la imagen final" value={{ zoom: settings.footerImageZoom, positionX: settings.footerImagePositionX, positionY: settings.footerImagePositionY }} onSave={(position) => { update('footerImageZoom', position.zoom); update('footerImagePositionX', position.positionX); update('footerImagePositionY', position.positionY) }} />
        </div>
        <label>Título de llamada a la acción<input value={settings.ctaTitle} onChange={(event) => update('ctaTitle', event.target.value)} /></label>
        <label>Texto de llamada a la acción<textarea rows={3} value={settings.ctaDescription} onChange={(event) => update('ctaDescription', event.target.value)} /></label>
        <label className="admin-form__wide">Aviso del formulario<textarea rows={3} value={settings.formDisclaimer} onChange={(event) => update('formDisclaimer', event.target.value)} /></label>
        <div className="admin-form-section admin-form__wide"><p className="eyebrow">Ubicación</p><h2>Ubicación del local</h2><p>El enlace abre Google Maps y la URL embed controla la vista previa pública.</p></div>
        <label className="admin-form__wide">Enlace Google Maps<input type="url" placeholder="https://maps.app.goo.gl/..." value={settings.locationMapsUrl} onChange={(event) => update('locationMapsUrl', event.target.value)} /></label>
        <label className="admin-form__wide">URL de mapa embebido / Embed URL<input type="url" placeholder="https://www.google.com/maps?...&amp;output=embed" value={settings.locationEmbedUrl} onChange={(event) => update('locationEmbedUrl', event.target.value)} /><small>Por seguridad, se aceptan únicamente URLs HTTPS oficiales de Google Maps aptas para iframe.</small></label>
        <label className="admin-form__wide">Dirección visible opcional<input value={settings.locationAddress} onChange={(event) => update('locationAddress', event.target.value)} /></label>
        <div className="admin-location-preview admin-form__wide"><p className="eyebrow">Vista previa del mapa</p><LocationMap embedUrl={settings.locationEmbedUrl} mapsUrl={settings.locationMapsUrl} title="Vista previa de la ubicación del salón" /></div>
        <fieldset className="admin-form__wide admin-specialties-editor"><legend>Textos de especialidades</legend>{settings.specialties.map((item, index) => <div key={`${item.title}-${index}`}><label>Título<input value={item.title} onChange={(event) => update('specialties', settings.specialties.map((current, itemIndex) => itemIndex === index ? { ...current, title: event.target.value } : current))} /></label><label>Descripción<input value={item.description} onChange={(event) => update('specialties', settings.specialties.map((current, itemIndex) => itemIndex === index ? { ...current, description: event.target.value } : current))} /></label></div>)}</fieldset>
        <aside className="admin-content-preview admin-form__wide"><p className="eyebrow">Vista previa simple</p><h2>{settings.heroTitle || 'Título principal'}</h2><p>{settings.heroDescription || 'Texto secundario'}</p></aside>
      </> : <>
        <div className="admin-form-section admin-form__wide"><p className="eyebrow">Datos generales</p><h2>Identidad y contacto</h2></div>
        <label>Nombre del salón<input value={settings.salonName} onChange={(event) => update('salonName', event.target.value)} /></label>
        <label>Dominio<input placeholder="www.marilyncoiffure.com" value={settings.domain} onChange={(event) => update('domain', event.target.value)} /></label>
        <label>WhatsApp general<input inputMode="numeric" placeholder="595XXXXXXXXX" value={settings.generalWhatsappNumber} onChange={(event) => update('generalWhatsappNumber', event.target.value.replace(/\D/g, ''))} /><small>Se usa cuando se elige cualquiera disponible o una profesional sin número.</small></label>
        <label>Instagram<input type="url" value={settings.instagramUrl} onChange={(event) => update('instagramUrl', event.target.value)} /></label>
        <label>Facebook<input type="url" value={settings.facebookUrl} onChange={(event) => update('facebookUrl', event.target.value)} /></label>
        <label>Dirección opcional<input value={settings.address} onChange={(event) => update('address', event.target.value)} /></label>
        <label className="admin-form__wide">Horario de atención<textarea rows={3} value={settings.openingHours} onChange={(event) => update('openingHours', event.target.value)} /></label>
        <div className="admin-form-section admin-form__wide"><p className="eyebrow">SEO</p><h2>Título y descripción generales</h2></div>
        <label className="admin-form__wide">Título SEO<input maxLength={70} value={settings.seoTitle} onChange={(event) => update('seoTitle', event.target.value)} /><small>{settings.seoTitle.length}/70</small></label>
        <label className="admin-form__wide">Descripción SEO<textarea maxLength={160} rows={3} value={settings.seoDescription} onChange={(event) => update('seoDescription', event.target.value)} /><small>{settings.seoDescription.length}/160</small></label>
        <div className="admin-warning-grid admin-form__wide">{[
          ['WhatsApp general', settings.generalWhatsappNumber], ['Imagen principal', settings.heroImageUrl], ['Dominio', settings.domain], ['Título SEO', settings.seoTitle], ['Descripción SEO', settings.seoDescription],
        ].map(([label, value]) => <span className={value ? 'is-ready' : ''} key={label}>{value ? '✓' : '!'} {label}: {value ? 'configurado' : 'pendiente'}</span>)}</div>
      </>}
      {error && <p className="admin-field-error admin-form__wide" role="alert">{error}</p>}
      {message && <p className="admin-success admin-form__wide" role="status">{message}</p>}
      <div className="admin-form__actions admin-form__wide"><button className="admin-button admin-button--primary" disabled={saving || !dirty}>{saving ? 'Guardando…' : 'Guardar cambios'}</button><button className="admin-button admin-button--secondary" type="button" disabled={saving || !dirty} onClick={() => { if (window.confirm('¿Querés descartar los cambios sin guardar?')) { setRequest((value) => value + 1); setDirty(false) } }}>Cancelar cambios</button></div>
    </form>
  )
}
