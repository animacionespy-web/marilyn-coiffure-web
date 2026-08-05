import type { Professional, ProfessionalSelection } from '../types/professional'

const STORAGE_KEY = 'marilyn-coiffure:selected-professional'

export function saveSelectedProfessional(professional: Professional) {
  const selection: ProfessionalSelection = {
    mode: 'specific',
    professionalId: professional.id,
    selectedAt: new Date().toISOString(),
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
  } catch {
    // La navegación sigue funcionando aunque el navegador bloquee sessionStorage.
  }
}

export function getSelectedProfessionalId() {
  const selection = getProfessionalSelection()
  return selection?.mode === 'specific' && typeof selection.professionalId === 'string'
    ? selection.professionalId
    : null
}

export function getProfessionalSelection() {
  try {
    const storedValue = window.sessionStorage.getItem(STORAGE_KEY)
    if (!storedValue) return null

    const selection = JSON.parse(storedValue) as Partial<ProfessionalSelection>
    if (selection.mode === 'any') return selection as ProfessionalSelection
    if (typeof selection.professionalId === 'string') {
      return {
        mode: 'specific',
        professionalId: selection.professionalId,
        selectedAt: selection.selectedAt ?? new Date().toISOString(),
      } satisfies ProfessionalSelection
    }
    return null
  } catch {
    return null
  }
}

export function saveAnyProfessionalSelection() {
  const selection: ProfessionalSelection = {
    mode: 'any',
    selectedAt: new Date().toISOString(),
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
  } catch {
    // La navegación sigue funcionando aunque el navegador bloquee sessionStorage.
  }
}

export function clearSelectedProfessional() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // No se necesita interrumpir la navegación si el almacenamiento está bloqueado.
  }
}
