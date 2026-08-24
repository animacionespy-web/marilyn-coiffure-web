import { ImageUploadField } from './ImageUploadField'
import { ImagePositionEditor } from './ImagePositionEditor'
import { DEFAULT_IMAGE_POSITION } from '../../types/image'
import type { AdminProfessionalWork } from '../../types/admin'

const createEmptyWork = (displayOrder: number): AdminProfessionalWork => ({
  id: crypto.randomUUID(),
  professionalId: '',
  type: 'photo',
  title: '',
  imageUrl: '',
  imagePath: '',
  imagePosition: { ...DEFAULT_IMAGE_POSITION },
  beforeImageUrl: '',
  beforeImagePath: '',
  beforeImagePosition: { ...DEFAULT_IMAGE_POSITION },
  afterImageUrl: '',
  afterImagePath: '',
  afterImagePosition: { ...DEFAULT_IMAGE_POSITION },
  active: false,
  displayOrder,
})

export function ProfessionalWorksEditor({ works, professionalName, onChange, onRetirePath }: {
  works: AdminProfessionalWork[]
  professionalName: string
  onChange: (works: AdminProfessionalWork[]) => void
  onRetirePath: (path: string) => void
}) {
  const updateWork = (workId: string, patch: Partial<AdminProfessionalWork>) => {
    onChange(works.map((work) => work.id === workId ? { ...work, ...patch } : work))
  }

  const normalizeOrder = (items: AdminProfessionalWork[]) => items.map((work, index) => ({ ...work, displayOrder: index }))

  const moveWork = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= works.length) return
    const next = [...works]
    ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
    onChange(normalizeOrder(next))
  }

  const removeWork = (work: AdminProfessionalWork, index: number) => {
    if (!window.confirm(`¿Querés eliminar el trabajo ${index + 1}?`)) return
    ;[work.imagePath, work.beforeImagePath, work.afterImagePath].filter(Boolean).forEach(onRetirePath)
    onChange(normalizeOrder(works.filter((item) => item.id !== work.id)))
  }

  const changeType = (work: AdminProfessionalWork, type: AdminProfessionalWork['type']) => {
    if (type === work.type) return
    if (type === 'photo') {
      ;[work.beforeImagePath, work.afterImagePath].filter(Boolean).forEach(onRetirePath)
      updateWork(work.id, {
        type,
        beforeImageUrl: '', beforeImagePath: '', beforeImagePosition: { ...DEFAULT_IMAGE_POSITION },
        afterImageUrl: '', afterImagePath: '', afterImagePosition: { ...DEFAULT_IMAGE_POSITION },
      })
      return
    }
    if (work.imagePath) onRetirePath(work.imagePath)
    updateWork(work.id, { type, imageUrl: '', imagePath: '', imagePosition: { ...DEFAULT_IMAGE_POSITION } })
  }

  return (
    <section className="admin-professional-works" aria-labelledby="professional-works-title">
      <div className="admin-professional-works__heading">
        <div><p className="eyebrow">Portfolio público</p><h3 id="professional-works-title">Trabajos realizados</h3><p>Subí hasta 6 trabajos. Solo los marcados como visibles aparecerán en la web.</p></div>
      </div>

      {works.length === 0 ? <p className="admin-professional-works__empty">Todavía no hay trabajos cargados.</p> : (
        <div className="admin-professional-works__list">
          {works.map((work, index) => (
            <article className="admin-professional-work" key={work.id}>
              <div className="admin-professional-work__heading">
                <div><span>Trabajo {index + 1}</span><strong>{work.title || (work.type === 'before_after' ? 'Antes y después' : 'Fotografía')}</strong></div>
                <div className="admin-professional-work__order">
                  <button type="button" onClick={() => moveWork(index, -1)} disabled={index === 0} aria-label={`Subir trabajo ${index + 1}`}>↑</button>
                  <button type="button" onClick={() => moveWork(index, 1)} disabled={index === works.length - 1} aria-label={`Bajar trabajo ${index + 1}`}>↓</button>
                  <button className="is-danger" type="button" onClick={() => removeWork(work, index)}>Eliminar</button>
                </div>
              </div>

              <div className="admin-professional-work__fields">
                <label>Título opcional<input value={work.title} placeholder="Ej.: Balayage natural" maxLength={80} onChange={(event) => updateWork(work.id, { title: event.target.value })} /></label>
                <label>Presentación<select value={work.type} onChange={(event) => changeType(work, event.target.value as AdminProfessionalWork['type'])}><option value="photo">Fotografía</option><option value="before_after">Antes y después</option></select></label>
                <label className="admin-check"><input type="checkbox" checked={work.active} onChange={(event) => updateWork(work.id, { active: event.target.checked })} />Visible en el portfolio</label>
              </div>

              {work.type === 'photo' ? (
                <div className="admin-professional-work__media">
                  <ImageUploadField folder="professional-works" label="Fotografía" imageUrl={work.imageUrl} imagePosition={work.imagePosition} onUploaded={(result) => { if (work.imagePath) onRetirePath(work.imagePath); updateWork(work.id, { imageUrl: result.publicUrl, imagePath: result.path, imagePosition: { ...DEFAULT_IMAGE_POSITION } }) }} />
                  <ImagePositionEditor usage="professional-work" imageUrl={work.imageUrl} imageAlt={`Trabajo de ${professionalName || 'la profesional'}`} value={work.imagePosition} title={work.title} onSave={(imagePosition) => updateWork(work.id, { imagePosition })} />
                </div>
              ) : (
                <div className="admin-professional-work__comparison">
                  <div>
                    <h4>Antes</h4>
                    <ImageUploadField folder="professional-works" label="Fotografía antes" imageUrl={work.beforeImageUrl} imagePosition={work.beforeImagePosition} onUploaded={(result) => { if (work.beforeImagePath) onRetirePath(work.beforeImagePath); updateWork(work.id, { beforeImageUrl: result.publicUrl, beforeImagePath: result.path, beforeImagePosition: { ...DEFAULT_IMAGE_POSITION } }) }} />
                    <ImagePositionEditor usage="professional-work" imageUrl={work.beforeImageUrl} imageAlt={`Antes del trabajo de ${professionalName || 'la profesional'}`} value={work.beforeImagePosition} title="Antes" onSave={(beforeImagePosition) => updateWork(work.id, { beforeImagePosition })} />
                  </div>
                  <div>
                    <h4>Después</h4>
                    <ImageUploadField folder="professional-works" label="Fotografía después" imageUrl={work.afterImageUrl} imagePosition={work.afterImagePosition} onUploaded={(result) => { if (work.afterImagePath) onRetirePath(work.afterImagePath); updateWork(work.id, { afterImageUrl: result.publicUrl, afterImagePath: result.path, afterImagePosition: { ...DEFAULT_IMAGE_POSITION } }) }} />
                    <ImagePositionEditor usage="professional-work" imageUrl={work.afterImageUrl} imageAlt={`Después del trabajo de ${professionalName || 'la profesional'}`} value={work.afterImagePosition} title="Después" onSave={(afterImagePosition) => updateWork(work.id, { afterImagePosition })} />
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      {works.length < 6 && (
        <div className="admin-professional-works__slots" aria-label="Espacios disponibles del portfolio">
          {Array.from({ length: 6 - works.length }, (_, offset) => {
            const slot = works.length + offset + 1
            if (offset === 0) return (
              <button type="button" className="admin-professional-work-slot" key={slot} onClick={() => onChange([...works, createEmptyWork(works.length)])}>
                <span>Trabajo {slot}</span><strong>Agregar trabajo</strong><small>Fotografía o antes/después</small>
              </button>
            )
            return <div className="admin-professional-work-slot is-locked" key={slot} aria-disabled="true"><span>Trabajo {slot}</span><strong>Espacio disponible</strong><small>Completá el trabajo anterior</small></div>
          })}
        </div>
      )}
      <p className="admin-professional-works__count">{works.length} de 6 trabajos</p>
    </section>
  )
}
