import { useEffect } from 'react'
import { siteConfig } from '../config/site'

export function useDocumentMeta(title: string, description: string, canonicalPath?: string) {
  useEffect(() => {
    document.title = title

    const metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    metaDescription?.setAttribute('content', description)

    const updateMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(selector)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, key)
        document.head.append(meta)
      }
      meta.content = content
    }

    updateMeta('meta[property="og:title"]', 'property', 'og:title', title)
    updateMeta('meta[property="og:description"]', 'property', 'og:description', description)
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)

    if (canonicalPath !== undefined) {
      const normalizedPath = canonicalPath === '/' ? '/' : `/${canonicalPath.replace(/^\/+|\/+$/g, '')}`
      const canonicalUrl = `${siteConfig.siteUrl}${normalizedPath}`
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.append(canonical)
      }
      canonical.href = canonicalUrl
      updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    }
  }, [canonicalPath, description, title])
}
