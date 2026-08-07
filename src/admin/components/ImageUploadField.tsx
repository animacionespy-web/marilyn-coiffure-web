import { useState } from 'react'
import { uploadSiteImage, validateImage } from '../../services/storage'
import type { UploadResult } from '../../types/admin'
import type { ImagePosition } from '../../types/image'
import { PositionedImage } from '../../components/PositionedImage'

export function ImageUploadField({ folder, imageUrl, imagePosition, label, onUploaded }: {
  folder: 'styles' | 'professionals' | 'products' | 'home'
  imageUrl: string
  imagePosition?: ImagePosition
  label: string
  onUploaded: (result: UploadResult) => void
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
      onUploaded(await uploadSiteImage(file, folder))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen.')
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
        <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => selectFile(event.target.files?.[0])} />
      </label>
      <small>JPG, JPEG, PNG o WEBP. Máximo 5 MB. Recomendamos comprimirla antes de subir.</small>
      {error && <p className="admin-field-error" role="alert">{error}</p>}
    </div>
  )
}
