import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fallbackSiteSettings, loadPublicContent, type PublicContent } from '../services/content'

interface PublicContentState extends PublicContent {
  loading: boolean
  error: string
  retry: () => void
}

const PublicContentContext = createContext<PublicContentState | null>(null)

export function PublicContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PublicContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [request, setRequest] = useState(0)

  const retry = useCallback(() => setRequest((value) => value + 1), [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    loadPublicContent()
      .then((result) => {
        if (active) setContent(result)
      })
      .catch((loadError: unknown) => {
        if (import.meta.env.DEV) console.error('[Marilyn Coiffure] Error al cargar contenido público', loadError)
        if (active) setError('No pudimos cargar esta sección. Intentá nuevamente.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [request])

  const value = useMemo<PublicContentState>(() => ({
    styles: content?.styles ?? [],
    professionals: content?.professionals ?? [],
    products: content?.products ?? [],
    categories: content?.categories ?? [],
    settings: content?.settings ?? fallbackSiteSettings,
    source: content?.source ?? 'fallback',
    loading,
    error,
    retry,
  }), [content, error, loading, retry])

  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>
}

export function usePublicContent() {
  const context = useContext(PublicContentContext)
  if (!context) throw new Error('usePublicContent debe utilizarse dentro de PublicContentProvider.')
  return context
}
