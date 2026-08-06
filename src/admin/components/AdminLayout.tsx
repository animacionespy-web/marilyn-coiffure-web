import { useState, type ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'

const navigation = [
  { label: 'Resumen', href: '/admin', icon: '⌂' },
  { label: 'Estilos', href: '/admin/estilos', icon: '✦' },
  { label: 'Categorías', href: '/admin/categorias', icon: '◫' },
  { label: 'Profesionales', href: '/admin/profesionales', icon: '◇' },
  { label: 'Productos', href: '/admin/productos', icon: '▣' },
  { label: 'Contenido del sitio', href: '/admin/contenido', icon: '¶' },
  { label: 'Configuración', href: '/admin/configuracion', icon: '⚙' },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const { profile, signOut } = useAuth()
  const path = window.location.pathname.replace(/\/+$/, '') || '/admin'

  const closeSession = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="admin-shell">
      <header className="admin-mobile-header">
        <a href="/admin" className="admin-brand">Marilyn Coiffure <small>Administración</small></a>
        <button type="button" aria-expanded={menuOpen} aria-controls="admin-navigation" onClick={() => setMenuOpen((value) => !value)}>
          <span aria-hidden="true">☰</span> Menú
        </button>
      </header>
      <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`} id="admin-navigation">
        <a href="/admin" className="admin-brand">Marilyn Coiffure <small>Administración</small></a>
        <nav aria-label="Navegación administrativa">
          {navigation.map((item) => {
            const active = item.href === '/admin' ? path === '/admin' : path.startsWith(item.href)
            return (
              <a className={active ? 'is-active' : ''} href={item.href} key={item.href} aria-current={active ? 'page' : undefined}>
                <span aria-hidden="true">{item.icon}</span>{item.label}
              </a>
            )
          })}
        </nav>
        <div className="admin-sidebar__footer">
          <p>{profile?.fullName || profile?.email}</p>
          <a href="/" target="_blank" rel="noopener noreferrer">Ver sitio ↗</a>
          <button type="button" onClick={closeSession} disabled={signingOut}>
            {signingOut ? 'Cerrando…' : 'Cerrar sesión'}
          </button>
        </div>
      </aside>
      {menuOpen && <button className="admin-menu-backdrop" type="button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}
      <main className="admin-main" id="contenido-principal">{children}</main>
    </div>
  )
}
