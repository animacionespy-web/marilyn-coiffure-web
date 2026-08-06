import { useEffect, type ReactNode } from 'react'
import { AuthProvider, useAuth } from '../hooks/useAuth'
import { AdminLayout } from './components/AdminLayout'
import { AdminLoading } from './components/AdminFeedback'
import { AdminCategoriesPage } from './pages/AdminCategoriesPage'
import { AdminContentPage } from './pages/AdminContentPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminProfessionalsPage } from './pages/AdminProfessionalsPage'
import { AdminProductsPage } from './pages/AdminProductsPage'
import { AdminSettingsPage } from './pages/AdminSettingsPage'
import { AdminStylesPage } from './pages/AdminStylesPage'

function ProtectedAdmin({ children }: { children: ReactNode }) {
  const { loading, authenticated, authorized, message, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !authenticated) window.location.replace('/admin/login')
  }, [authenticated, loading])

  if (loading || !authenticated) return <main className="admin-auth-loading"><AdminLoading label="Verificando sesión y permisos…" /></main>
  if (!authorized) return (
    <main className="admin-access-denied" id="contenido-principal">
      <section><p className="eyebrow">Acceso administrativo</p><h1>No tenés permisos para ingresar</h1><p>{message || 'La cuenta autenticada no tiene el rol admin.'}</p><button className="admin-button admin-button--primary" type="button" onClick={() => signOut()}>Cerrar sesión</button></section>
    </main>
  )
  return <AdminLayout>{children}</AdminLayout>
}

function AdminRoutes() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/admin'
  if (path === '/admin/login') return <AdminLoginPage />
  let page: ReactNode = <AdminDashboardPage />
  if (path === '/admin/estilos') page = <AdminStylesPage />
  else if (path === '/admin/categorias') page = <AdminCategoriesPage />
  else if (path === '/admin/profesionales') page = <AdminProfessionalsPage />
  else if (path === '/admin/productos') page = <AdminProductsPage />
  else if (path === '/admin/contenido') page = <AdminContentPage />
  else if (path === '/admin/configuracion') page = <AdminSettingsPage />
  return <ProtectedAdmin>{page}</ProtectedAdmin>
}

export function AdminApp() {
  return <AuthProvider><AdminRoutes /></AuthProvider>
}
