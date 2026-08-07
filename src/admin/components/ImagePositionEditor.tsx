import { useId, useState } from 'react'
import type { ImagePosition } from '../../types/image'
import { DEFAULT_IMAGE_POSITION, normalizeImagePosition } from '../../types/image'
import { ImageContextPreview, type ImageUsage } from './ImageContextPreview'

interface ImagePositionEditorProps {
  imageUrl: string
  imageAlt: string
  value: ImagePosition
  usage: ImageUsage
  title?: string
  category?: string
  description?: string
  tags?: string[]
  onSave: (value: ImagePosition) => void
}

export function ImagePositionEditor({ imageUrl, imageAlt, value, usage, title, category, description, tags, onSave }: ImagePositionEditorProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<ImagePosition>(() => normalizeImagePosition(value))
  const [message, setMessage] = useState('')

  if (!imageUrl) {
    return usage === 'footer'
      ? <div className="image-position-editor image-position-editor--fallback"><ImageContextPreview usage={usage} imageUrl="" imageAlt="" position={DEFAULT_IMAGE_POSITION} /></div>
      : null
  }

  const openEditor = () => {
    setDraft(normalizeImagePosition(value))
    setMessage('')
    setOpen(true)
  }

  const update = (key: keyof ImagePosition, nextValue: number) => {
    setMessage('')
    setDraft((current) => normalizeImagePosition({ ...current, [key]: nextValue }))
  }

  const save = () => {
    onSave(normalizeImagePosition(draft))
    setMessage('Así se verá la imagen en la web.')
    setOpen(false)
  }

  return (
    <div className="image-position-editor">
      {!open ? (
        <div className="image-position-editor__launcher">
          <button className="admin-button admin-button--secondary" type="button" onClick={openEditor}>Ajustar encuadre</button>
          {message && <span className="image-position-editor__message" role="status"><strong>{message}</strong><small>El ajuste se guarda al guardar el formulario.</small></span>}
        </div>
      ) : (
        <section className="image-position-editor__panel" aria-labelledby={`${id}-title`}>
          <div className="image-position-editor__heading">
            <div><p className="eyebrow">Encuadre</p><h3 id={`${id}-title`}>Ajustá cómo se verá la imagen</h3></div>
            <button type="button" className="image-position-editor__close" onClick={() => setOpen(false)} aria-label="Cerrar ajustador de imagen">×</button>
          </div>

          <div className={`image-position-editor__previews image-position-editor__previews--${usage}`}>
            <ImageContextPreview usage={usage} imageUrl={imageUrl} imageAlt={imageAlt} position={draft} title={title} category={category} description={description} tags={tags} />
          </div>

          <div className="image-position-editor__controls">
            <label htmlFor={`${id}-zoom`}><span>Zoom</span><output>{draft.zoom.toFixed(1)}x</output></label>
            <input id={`${id}-zoom`} type="range" min="1" max="2.5" step="0.1" value={draft.zoom} onChange={(event) => update('zoom', Number(event.target.value))} aria-label="Zoom de la imagen" />
            <label htmlFor={`${id}-x`}><span>Horizontal</span><output>{Math.round(draft.positionX)}%</output></label>
            <input id={`${id}-x`} type="range" min="0" max="100" step="1" value={draft.positionX} onChange={(event) => update('positionX', Number(event.target.value))} aria-label="Posición horizontal de la imagen" />
            <label htmlFor={`${id}-y`}><span>Vertical</span><output>{Math.round(draft.positionY)}%</output></label>
            <input id={`${id}-y`} type="range" min="0" max="100" step="1" value={draft.positionY} onChange={(event) => update('positionY', Number(event.target.value))} aria-label="Posición vertical de la imagen" />
          </div>

          <div className="image-position-editor__actions">
            <button className="admin-button admin-button--secondary" type="button" onClick={() => setDraft({ ...DEFAULT_IMAGE_POSITION })}>Restablecer</button>
            <button className="admin-button admin-button--primary" type="button" onClick={save}>Guardar ajuste</button>
          </div>
        </section>
      )}
    </div>
  )
}
