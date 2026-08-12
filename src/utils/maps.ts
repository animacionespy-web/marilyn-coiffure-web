const googleMapHosts = new Set([
  'google.com',
  'www.google.com',
  'maps.google.com',
])

const googleMapLinkHosts = new Set([
  ...googleMapHosts,
  'maps.app.goo.gl',
])

function parseHttpsUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

export function getSafeGoogleMapsEmbedUrl(value: string) {
  const url = parseHttpsUrl(value)
  if (!url || !googleMapHosts.has(url.hostname) || !url.pathname.startsWith('/maps')) return ''

  const isEmbedPath = url.pathname.startsWith('/maps/embed')
  const isEmbedQuery = url.searchParams.get('output') === 'embed'
  return isEmbedPath || isEmbedQuery ? url.toString() : ''
}

export function getSafeGoogleMapsLink(value: string) {
  const url = parseHttpsUrl(value)
  return url && googleMapLinkHosts.has(url.hostname) ? url.toString() : ''
}
