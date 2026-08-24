import { requireSupabase } from '../lib/supabase'
import type { UploadResult } from '../types/admin'
import { humanizeDataError, toSafeFileName } from '../utils/admin'

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxFileSize = 5 * 1024 * 1024
const uploadTimeoutMs = 45_000

function readErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message.trim()
  if (typeof error === 'object' && error && 'message' in error && typeof error.message === 'string') return error.message.trim()
  return ''
}

function uploadErrorMessage(error: unknown) {
  const friendlyMessage = humanizeDataError(error, '')
  if (friendlyMessage) return `No se pudo subir la imagen: ${friendlyMessage}`
  const detail = readErrorMessage(error)
  return detail ? `No se pudo subir la imagen: ${detail}` : 'No se pudo subir la imagen.'
}

async function waitForUpload<T>(upload: Promise<T>) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('La carga tardó demasiado. Revisá tu conexión e intentá nuevamente.')), uploadTimeoutMs)
  })

  try {
    return await Promise.race([upload, timeout])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

export function validateImage(file: File) {
  if (!allowedTypes.includes(file.type)) return 'Usá una imagen JPG, JPEG, PNG o WEBP.'
  if (file.size > maxFileSize) return 'La imagen supera el tamaño máximo de 5 MB.'
  return ''
}

export async function uploadSiteImage(file: File, folder: 'styles' | 'professionals' | 'professional-works' | 'products' | 'home'): Promise<UploadResult> {
  const validationError = validateImage(file)
  if (validationError) throw new Error(validationError)
  const client = requireSupabase()
  const path = `${folder}/${toSafeFileName(file.name)}`
  try {
    const { error } = await waitForUpload(client.storage.from('site-images').upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    }))
    if (error) throw error
    const { data } = client.storage.from('site-images').getPublicUrl(path)
    if (!data.publicUrl) throw new Error('Storage no devolvió una URL pública para la imagen.')
    return { path, publicUrl: data.publicUrl }
  } catch (error) {
    console.error('[Marilyn Coiffure] Error completo al subir una imagen a Storage.', { error, bucket: 'site-images', path, fileType: file.type, fileSize: file.size })
    throw new Error(uploadErrorMessage(error))
  }
}

export async function removeSiteImage(path: string) {
  if (!path) return
  const client = requireSupabase()
  const { error } = await client.storage.from('site-images').remove([path])
  if (error) throw new Error(humanizeDataError(error, 'El contenido se guardó, pero no se pudo retirar la imagen anterior.'))
}
