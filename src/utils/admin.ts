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
  const message = error instanceof Error ? error.message : ''
  if (/duplicate|unique/i.test(message)) return 'Ya existe un contenido con ese slug.'
  if (/row-level security|permission|policy/i.test(message)) return 'No tenés permisos para realizar esta acción.'
  if (/jwt|session|refresh token/i.test(message)) return 'Tu sesión venció. Volvé a ingresar.'
  return fallback
}
