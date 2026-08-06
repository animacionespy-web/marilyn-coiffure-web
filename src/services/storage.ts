import { requireSupabase } from '../lib/supabase'
import type { UploadResult } from '../types/admin'
import { humanizeDataError, toSafeFileName } from '../utils/admin'

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxFileSize = 5 * 1024 * 1024

export function validateImage(file: File) {
  if (!allowedTypes.includes(file.type)) return 'Usá una imagen JPG, JPEG, PNG o WEBP.'
  if (file.size > maxFileSize) return 'La imagen supera el tamaño máximo de 5 MB.'
  return ''
}

export async function uploadSiteImage(file: File, folder: 'styles' | 'professionals' | 'products' | 'home'): Promise<UploadResult> {
  const validationError = validateImage(file)
  if (validationError) throw new Error(validationError)
  const client = requireSupabase()
  const path = `${folder}/${toSafeFileName(file.name)}`
  const { error } = await client.storage.from('site-images').upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })
  if (error) throw new Error(humanizeDataError(error, 'No se pudo subir la imagen.'))
  const { data } = client.storage.from('site-images').getPublicUrl(path)
  return { path, publicUrl: data.publicUrl }
}

export async function removeSiteImage(path: string) {
  if (!path) return
  const client = requireSupabase()
  const { error } = await client.storage.from('site-images').remove([path])
  if (error) throw new Error(humanizeDataError(error, 'El contenido se guardó, pero no se pudo retirar la imagen anterior.'))
}
