import { lazy, Suspense } from 'react'
import { AboutSection } from './components/AboutSection'
import { AvailabilityCTA } from './components/AvailabilityCTA'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProfessionalsPreview } from './components/ProfessionalsPreview'
import { SpecialtyHighlights } from './components/SpecialtyHighlights'
import { StylesPreview } from './components/StylesPreview'
import { CatalogPage } from './pages/CatalogPage'
import { ConsultationPage } from './pages/ConsultationPage'
import { ProfessionalsPage } from './pages/ProfessionalsPage'
import { StyleDetailPage } from './pages/StyleDetailPage'
import { PublicContentProvider } from './hooks/usePublicContent'
import { usePublicContent } from './hooks/usePublicContent'
import { useDocumentMeta } from './hooks/useDocumentMeta'

const AdminApp = lazy(() => import('./admin/AdminApp').then((module) => ({ default: module.AdminApp })))

function HomePage() {
  const { settings } = usePublicContent()
  useDocumentMeta(settings.seoTitle, settings.seoDescription)
  return (
    <main id="contenido-principal">
      <Hero />
      <ProfessionalsPreview />
      <StylesPreview />
      <SpecialtyHighlights />
      <AboutSection />
      <AvailabilityCTA />
    </main>
  )
}

function CurrentPage() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/estilos') {
    return (
      <main id="contenido-principal">
        <CatalogPage />
      </main>
    )
  }

  if (path.startsWith('/estilos/')) {
    return <StyleDetailPage slug={decodeURIComponent(path.slice('/estilos/'.length))} />
  }

  if (path === '/profesionales') {
    return <ProfessionalsPage />
  }

  if (path === '/consulta' || path === '/disponibilidad') {
    return <ConsultationPage />
  }

  return <HomePage />
}

export function App() {
  if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
    return <Suspense fallback={<main className="admin-auth-loading" role="status">Cargando panel administrativo…</main>}><AdminApp /></Suspense>
  }

  return (
    <PublicContentProvider>
      <a className="skip-link" href="#contenido-principal">Ir al contenido principal</a>
      <Header />
      <CurrentPage />
      <Footer />
    </PublicContentProvider>
  )
}
