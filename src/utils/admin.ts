export function createSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validateInternationalWhatsapp(value: string) {
  if (!value.trim()) return ''
  return /^595\d{8,10}$/.test(value.replace(/\D/g, ''))
    ? ''
    : 'Usá el formato internacional 595XXXXXXXXX, sin espacios ni signo +.'
}

export function toSafeFileName(fileName: string) {
  const extension = fileName.split('.').pop()?.toLocaleLowerCase('en') ?? 'jpg'
  const base = createSlug(fileName.replace(/\.[^.]+$/, '')) || 'imagen'
  return `${base}-${crypto.randomUUID()}.${extension}`
}

export function humanizeDataError(error: unknown, fallback: string) {
  const details = getDataErrorDetails(error)
  const searchable = `${details.message} ${details.details} ${details.hint} ${details.code}`
  if (/23505|duplicate|unique/i.test(searchable)) return 'Ya existe un contenido con ese slug.'
  if (/42501|row-level security|permission|policy/i.test(searchable)) return 'No tenés permisos para realizar esta acción.'
  if (/jwt|session|refresh token/i.test(searchable)) return 'Tu sesión venció. Volvé a ingresar.'
  if (/23503|foreign key/i.test(searchable)) return 'La selección relacionada ya no existe. Actualizá la página e intentá nuevamente.'
  if (/23514|check constraint/i.test(searchable)) return 'Uno de los valores no cumple las reglas permitidas.'
  return fallback
}

export function createUniqueSlug(value: string, existingSlugs: Iterable<string>) {
  const baseSlug = createSlug(value) || 'producto'
  const usedSlugs = new Set(existingSlugs)
  if (!usedSlugs.has(baseSlug)) return baseSlug

  let suffix = 2
  while (usedSlugs.has(`${baseSlug}-${suffix}`)) suffix += 1
  return `${baseSlug}-${suffix}`
}

interface DataErrorDetails {
  message: string
  code: string
  details: string
  hint: string
}

export function getDataErrorDetails(error: unknown): DataErrorDetails {
  if (error instanceof Error) {
    return { message: error.message, code: '', details: '', hint: '' }
  }
  if (!error || typeof error !== 'object') {
    return { message: '', code: '', details: '', hint: '' }
  }
  const candidate = error as Partial<Record<keyof DataErrorDetails, unknown>>
  return {
    message: typeof candidate.message === 'string' ? candidate.message : '',
    code: typeof candidate.code === 'string' ? candidate.code : '',
    details: typeof candidate.details === 'string' ? candidate.details : '',
    hint: typeof candidate.hint === 'string' ? candidate.hint : '',
  }
}

export function logDataError(context: string, error: unknown) {
  if (!import.meta.env.DEV) return
  const details = getDataErrorDetails(error)
  console.error(`[Marilyn Coiffure] ${context}`, details)
}
