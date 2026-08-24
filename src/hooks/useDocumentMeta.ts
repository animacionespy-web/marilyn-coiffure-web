import { useEffect } from 'react'
import { siteConfig } from '../config/site'

export function useDocumentMeta(title: string, description: string, canonicalPath?: string) {
  useEffect(() => {
    document.title = title

    const metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    metaDescription?.setAttribute('content', description)

    if (canonicalPath !== undefined) {
      const normalizedPath = canonicalPath === '/' ? '/' : `/${canonicalPath.replace(/^\/+|\/+$/g, '')}`
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.append(canonical)
      }
      canonical.href = `${siteConfig.siteUrl}${normalizedPath}`
    }
  }, [canonicalPath, description, title])
}
