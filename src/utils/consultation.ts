import type { Professional } from '../types/professional'
import type {
  ConsultationFormData,
  ConsultationFormErrors,
  ConsultationSelection,
  WhatsappRecipient,
} from '../types/consultation'

export const emptyConsultationForm: ConsultationFormData = {
  clientName: '',
  clientWhatsapp: '',
  desiredDate: '',
  desiredTime: '',
  observation: '',
  hairLength: '',
  contactPreference: '',
}

export function normalizePhoneNumber(value: string) {
  return value.replace(/\D/g, '')
}

export function getTodayIsoDate(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const [, year, month, day] = match
  const parsed = new Date(Number(year), Number(month) - 1, Number(day))
  if (
    parsed.getFullYear() !== Number(year)
    || parsed.getMonth() !== Number(month) - 1
    || parsed.getDate() !== Number(day)
  ) return null
  return parsed
}

export function formatDateInSpanish(value: string) {
  const date = parseIsoDate(value)
  if (!date) return ''
  const formatted = new Intl.DateTimeFormat('es-PY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
  return formatted.charAt(0).toLocaleUpperCase('es') + formatted.slice(1)
}

export function validateConsultationForm(
  form: ConsultationFormData,
  today = getTodayIsoDate(),
): ConsultationFormErrors {
  const errors: ConsultationFormErrors = {}
  const name = form.clientName.trim()
  const clientPhone = normalizePhoneNumber(form.clientWhatsapp)

  if (!name) errors.clientName = 'Ingresá tu nombre.'
  else if (name.length < 2) errors.clientName = 'Tu nombre debe tener al menos 2 caracteres.'
  else if (name.length > 60) errors.clientName = 'Tu nombre no puede superar los 60 caracteres.'

  if (!clientPhone) errors.clientWhatsapp = 'Ingresá tu número de WhatsApp.'
  else if (clientPhone.length < 9 || clientPhone.length > 15) {
    errors.clientWhatsapp = 'Ingresá un número de WhatsApp válido, por ejemplo 0981 123 456.'
  }

  if (!form.desiredDate) errors.desiredDate = 'Seleccioná una fecha.'
  else if (!parseIsoDate(form.desiredDate)) errors.desiredDate = 'Ingresá una fecha válida.'
  else if (form.desiredDate < today) errors.desiredDate = 'La fecha no puede ser anterior a hoy.'

  if (!form.desiredTime) errors.desiredTime = 'Seleccioná un horario.'
  else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(form.desiredTime)) {
    errors.desiredTime = 'Ingresá un horario válido.'
  }

  if (form.observation.length > 300) {
    errors.observation = 'La observación no puede superar los 300 caracteres.'
  }

  return errors
}

export function buildWhatsappMessage(
  form: ConsultationFormData,
  selection: ConsultationSelection,
) {
  const service = selection.style?.name ?? 'Por definir'
  const professional = selection.anyProfessional || !selection.professional
    ? 'Cualquiera disponible'
    : selection.professional.name
  const lines = [
    'Hola, quisiera consultar disponibilidad para un turno.',
    '',
    `Servicio: ${service}`,
    `Profesional: ${professional}`,
    `Nombre: ${form.clientName.trim() || 'Por completar'}`,
    `Mi WhatsApp: ${form.clientWhatsapp.trim() || 'Por completar'}`,
    `Fecha deseada: ${formatDateInSpanish(form.desiredDate) || 'Por completar'}`,
    `Horario deseado: ${form.desiredTime || 'Por completar'}`,
  ]

  if (form.hairLength) lines.push(`Largo del cabello: ${form.hairLength}`)
  if (form.contactPreference) lines.push(`Preferencia de contacto: ${form.contactPreference}`)
  if (form.observation.trim()) lines.push(`Observación: ${form.observation.trim()}`)

  lines.push('', '¿Tienen disponible ese día y horario?')
  return lines.join('\n')
}

export function buildWhatsappUrl(recipientNumber: string, message: string) {
  const normalizedNumber = normalizePhoneNumber(recipientNumber)
  if (!normalizedNumber) return null
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`
}

export function resolveWhatsappRecipient(
  professional: Professional | undefined,
  anyProfessional: boolean,
  generalWhatsappNumber: string,
): WhatsappRecipient {
  if (!anyProfessional && professional) {
    const professionalNumber = normalizePhoneNumber(professional.whatsappNumber)
    if (professionalNumber) {
      return { number: professionalNumber, label: professional.name, source: 'professional' }
    }
  }

  const generalNumber = normalizePhoneNumber(generalWhatsappNumber)
  if (generalNumber) {
    return { number: generalNumber, label: 'Número general del salón', source: 'general' }
  }

  return { number: '', label: 'Configuración pendiente', source: 'missing' }
}
