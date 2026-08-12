import { usePublicContent } from '../hooks/usePublicContent'
import { getSafeGoogleMapsLink } from '../utils/maps'
import { LocationMap } from './LocationMap'

export function LocationSection() {
  const { settings } = usePublicContent()
  const safeMapsUrl = getSafeGoogleMapsLink(settings.locationMapsUrl)

  return (
    <section className="location-section section" id="ubicacion" aria-labelledby="location-title">
      <div className="container location-section__grid">
        <div className="location-section__intro">
          <p className="eyebrow">Ubicación</p>
          <h2 id="location-title">Visitános</h2>
        </div>

        <div className="location-section__map">
          <LocationMap embedUrl={settings.locationEmbedUrl} mapsUrl={settings.locationMapsUrl} />
        </div>

        <div className="location-section__details">
          <p className="location-section__name">Marilyn Coiffure</p>
          {settings.locationAddress && <address>{settings.locationAddress}</address>}
          {safeMapsUrl && (
            <a className="button button--dark" href={safeMapsUrl} target="_blank" rel="noopener noreferrer">
              Cómo llegar <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
