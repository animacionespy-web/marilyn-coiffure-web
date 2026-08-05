import { useEffect, useState } from 'react'
import { siteContent } from '../data/siteContent'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#inicio" aria-label="Marilyn Coiffure, inicio">
          <span className="brand__name">{siteContent.brand}</span>
          <span className="brand__descriptor">Belleza &amp; estilo</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-controls="main-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>

        <div className={`site-header__navigation ${isMenuOpen ? 'is-open' : ''}`}>
          <nav id="main-navigation" aria-label="Navegación principal">
            <ul className="nav-list">
              {siteContent.navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={closeMenu}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="button button--dark header-action" href={siteContent.actions.availability.href} onClick={closeMenu}>
            {siteContent.actions.availability.label}
          </a>
        </div>
      </div>
    </header>
  )
}
