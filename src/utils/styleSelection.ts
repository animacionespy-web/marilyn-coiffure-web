import type { SelectedStyleState, Style } from '../types/style'

const STORAGE_KEY = 'marilyn-coiffure:selected-style'

export function saveSelectedStyle(style: Style) {
  const selection: SelectedStyleState = {
    styleId: style.id,
    selectedAt: new Date().toISOString(),
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
  } catch {
    // La navegación sigue funcionando aunque el navegador bloquee sessionStorage.
  }
}

export function getSelectedStyleId() {
  try {
    const storedValue = window.sessionStorage.getItem(STORAGE_KEY)
    if (!storedValue) return null

    const selection = JSON.parse(storedValue) as Partial<SelectedStyleState>
    return typeof selection.styleId === 'string' ? selection.styleId : null
  } catch {
    return null
  }
}
