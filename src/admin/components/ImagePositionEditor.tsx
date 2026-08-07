import { useId, useState } from 'react'
import { PositionedImage } from '../../components/PositionedImage'
import type { ImagePosition } from '../../types/image'
import { DEFAULT_IMAGE_POSITION, normalizeImagePosition } from '../../types/image'

export interface ImagePreviewShape {
  label: string
  aspectRatio: string
}

interface ImagePositionEditorProps {
  imageUrl: string
  imageAlt: string
  value: ImagePosition
  previews: ImagePreviewShape[]
  onSave: (value: ImagePosition) => void
}

export function ImagePositionEditor({ imageUrl, imageAlt, value, previews, onSave }: ImagePositionEditorProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<ImagePosition>(() => normalizeImagePosition(value))
  const [message, setMessage] = useState('')

  if (!imageUrl) return null

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
    setMessage('Encuadre aplicado. Guardá el formulario para publicarlo.')
    setOpen(false)
  }

  return (
    <div className="image-position-editor">
      {!open ? (
        <div className="image-position-editor__launcher">
          <button className="admin-button admin-button--secondary" type="button" onClick={openEditor}>Ajustar encuadre</button>
          {message && <small role="status">{message}</small>}
        </div>
      ) : (
        <section className="image-position-editor__panel" aria-labelledby={`${id}-title`}>
          <div className="image-position-editor__heading">
            <div><p className="eyebrow">Encuadre</p><h3 id={`${id}-title`}>Ajustá cómo se verá la imagen</h3></div>
            <button type="button" className="image-position-editor__close" onClick={() => setOpen(false)} aria-label="Cerrar ajustador de imagen">×</button>
          </div>

          <div className={`image-position-editor__previews ${previews.length > 1 ? 'has-multiple' : ''}`}>
            {previews.map((preview) => (
              <figure key={preview.label}>
                <div className="image-position-editor__preview" style={{ aspectRatio: preview.aspectRatio }}>
                  <PositionedImage src={imageUrl} alt={imageAlt} position={draft} />
                </div>
                <figcaption>{preview.label}</figcaption>
              </figure>
            ))}
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
