import { getSafeGoogleMapsEmbedUrl, getSafeGoogleMapsLink } from '../utils/maps'

interface LocationMapProps {
  embedUrl: string
  mapsUrl: string
  title?: string
}

export function LocationMap({ embedUrl, mapsUrl, title = 'Mapa de ubicación de Marilyn Coiffure' }: LocationMapProps) {
  const safeEmbedUrl = getSafeGoogleMapsEmbedUrl(embedUrl)
  const safeMapsUrl = getSafeGoogleMapsLink(mapsUrl)

  return (
    <div className="location-map">
      {safeEmbedUrl ? (
        <iframe
          title={title}
          src={safeEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="location-map__fallback" role="status">
          <span aria-hidden="true">⌖</span>
          <strong>Ubicación del salón</strong>
          {safeMapsUrl ? <a href={safeMapsUrl} target="_blank" rel="noopener noreferrer">Ver en Google Maps</a> : <small>Configurá el mapa desde el panel.</small>}
        </div>
      )}
    </div>
  )
}
