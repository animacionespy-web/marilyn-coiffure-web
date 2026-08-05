import { siteContent } from '../data/siteContent'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <a className="brand brand--footer" href="/">
              <span className="brand__name">{siteContent.brand}</span>
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
            <p>{siteContent.contact.provisional}</p>
            <a href="/consulta">Consultar disponibilidad</a>
          </div>

          <div className="site-footer__column">
            <h2>Seguinos</h2>
            <ul>
              {siteContent.socialLinks.map((social) => (
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
