import { useState } from 'react'
import { uploadSiteImage, validateImage } from '../../services/storage'
import type { UploadResult } from '../../types/admin'
import type { ImagePosition } from '../../types/image'
import { PositionedImage } from '../../components/PositionedImage'

export function ImageUploadField({ folder, imageUrl, imagePosition, label, onUploaded }: {
  folder: 'styles' | 'professionals' | 'professional-works' | 'products' | 'home'
  imageUrl: string
  imagePosition?: ImagePosition
  label: string
  onUploaded: (result: UploadResult) => void | Promise<void>
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const selectFile = async (file?: File) => {
    if (!file) return
    const validation = validateImage(file)
    if (validation) {
      setError(validation)
      return
    }
    setUploading(true)
    setError('')
    try {
      const result = await uploadSiteImage(file, folder)
      await onUploaded(result)
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen.'
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="admin-image-field">
      <span className="admin-field-label">{label}</span>
      <div className="admin-image-field__preview">
        {imageUrl ? <PositionedImage src={imageUrl} alt="Vista previa de la imagen seleccionada" position={imagePosition} /> : <span>Sin imagen</span>}
      </div>
      <label className="admin-button admin-button--secondary">
        {uploading ? 'Subiendo…' : 'Seleccionar imagen'}
        <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={async (event) => {
          const input = event.currentTarget
          await selectFile(input.files?.[0])
          input.value = ''
        }} />
      </label>
      <small>JPG, JPEG, PNG o WEBP. Máximo 5 MB. Recomendamos comprimirla antes de subir.</small>
      {error && <p className="admin-field-error" role="alert">{error}</p>}
    </div>
  )
}
