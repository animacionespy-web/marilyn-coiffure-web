import type { ConsultationFormData } from '../types/consultation'
import { emptyConsultationForm } from './consultation'

const STORAGE_KEY = 'marilyn-coiffure:consultation-draft'

export function saveConsultationDraft(form: ConsultationFormData) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form))
  } catch {
    // El formulario sigue funcionando aunque sessionStorage esté bloqueado.
  }
}

export function getConsultationDraft(): ConsultationFormData {
  try {
    const storedValue = window.sessionStorage.getItem(STORAGE_KEY)
    if (!storedValue) return { ...emptyConsultationForm }
    const parsed = JSON.parse(storedValue) as Partial<ConsultationFormData>
    return {
      ...emptyConsultationForm,
      ...parsed,
      observation: typeof parsed.observation === 'string' ? parsed.observation.slice(0, 300) : '',
    }
  } catch {
    return { ...emptyConsultationForm }
  }
}

export function clearConsultationDraft() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // No se necesita interrumpir el formulario si el almacenamiento está bloqueado.
  }
}
