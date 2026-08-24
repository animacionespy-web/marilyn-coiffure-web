import { useEffect, useState } from 'react'
import { siteContent } from '../data/siteContent'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const isHome = window.location.pathname === '/'

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    if (!isHome) return

    const hero = document.querySelector<HTMLElement>('#contenido-principal > .hero')
    if (!hero || !('IntersectionObserver' in window)) {
      const updateHeader = () => setIsScrolled(window.scrollY > window.innerHeight * 0.75)
      updateHeader()
      window.addEventListener('scroll', updateHeader, { passive: true })
      return () => window.removeEventListener('scroll', updateHeader)
    }

    const observer = new IntersectionObserver(([entry]) => setIsScrolled(!entry.isIntersecting), {
      threshold: 0.12,
      rootMargin: '-70px 0px 0px 0px',
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [isHome])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={`site-header ${isHome ? 'site-header--overlay' : ''} ${isScrolled || isMenuOpen ? 'is-solid' : ''}`}>
      <div className="container site-header__inner">
        <a className="brand" href="/" aria-label="Marilyn Coiffure, inicio">
          <img
            className="brand__logo"
            src="/images/brand/marilyn-coiffure-logo-white-clean.png"
            alt=""
            width="706"
            height="218"
            aria-hidden="true"
          />
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
