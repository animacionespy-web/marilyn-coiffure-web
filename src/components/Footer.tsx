import { siteContent } from '../data/siteContent'
import { usePublicContent } from '../hooks/usePublicContent'

export function Footer() {
  const { settings } = usePublicContent()
  const socialLinks = [
    { label: 'Instagram', href: settings.instagramUrl },
    { label: 'Facebook', href: settings.facebookUrl },
  ].filter((item) => item.href)
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <a className="brand brand--footer" href="/">
              <span className="brand__name">{settings.salonName}</span>
              <span className="brand__descriptor">Belleza &amp; estilo</span>
            </a>
            <p>Una experiencia de belleza cercana, cuidada y pensada para vos.</p>
          </div>

          <div className="site-footer__column">
            <h2>Navegación</h2>
            <ul>
              {siteContent.navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__column">
            <h2>Contacto</h2>
            <p>{settings.address || siteContent.contact.provisional}</p>
            {settings.openingHours && <p>{settings.openingHours}</p>}
            <a href="/consulta">Consultar disponibilidad</a>
          </div>

          <div className="site-footer__column">
            <h2>Seguinos</h2>
            <ul>
              {(socialLinks.length ? socialLinks : siteContent.socialLinks).map((social) => (
                <li key={social.label}>
                  <a href={social.href} aria-label={`${social.label}, enlace pendiente de configuración`}>
                    {social.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} {siteContent.brand}. Todos los derechos reservados.</p>
          <p>Información comercial pendiente de confirmación.</p>
        </div>
      </div>
    </footer>
  )
}
