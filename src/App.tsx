import { lazy, Suspense, useEffect } from 'react'
import { AboutSection } from './components/AboutSection'
import { AvailabilityCTA } from './components/AvailabilityCTA'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import {
  EditorialClosingImage,
  EditorialColorSection,
  EditorialEventsSection,
  EditorialProcessSection,
  EditorialTransformationsSection,
  EditorialTreatmentsSection,
} from './components/EditorialHomeSections'
import { LocationSection } from './components/LocationSection'
import { ProfessionalsPreview } from './components/ProfessionalsPreview'
import { ProductsPreview } from './components/ProductsPreview'
import { SpecialtyHighlights } from './components/SpecialtyHighlights'
import { CatalogPage } from './pages/CatalogPage'
import { ConsultationPage } from './pages/ConsultationPage'
import { ProfessionalsPage } from './pages/ProfessionalsPage'
import { ProfessionalDetailPage } from './pages/ProfessionalDetailPage'
import { ProductsPage } from './pages/ProductsPage'
import { StyleDetailPage } from './pages/StyleDetailPage'
import { PublicContentProvider } from './hooks/usePublicContent'
import { usePublicContent } from './hooks/usePublicContent'
import { useDocumentMeta } from './hooks/useDocumentMeta'

const AdminApp = lazy(() => import('./admin/AdminApp').then((module) => ({ default: module.AdminApp })))

function HomePage() {
  const { settings, loading } = usePublicContent()
  useDocumentMeta(settings.seoTitle, settings.seoDescription, '/')

  useEffect(() => {
    if (loading || !window.location.hash) return
    const target = document.querySelector<HTMLElement>(window.location.hash)
    if (!target) return
    const frame = window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }))
    return () => window.cancelAnimationFrame(frame)
  }, [loading])

  return (
    <main id="contenido-principal">
      <Hero />
      <AboutSection />
      <SpecialtyHighlights />
      <EditorialColorSection />
      <EditorialProcessSection />
      <EditorialTransformationsSection />
      <EditorialEventsSection />
      <EditorialTreatmentsSection />
      <ProductsPreview />
      <ProfessionalsPreview />
      <LocationSection />
      <EditorialClosingImage />
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

  if (path.startsWith('/profesionales/')) {
    return <ProfessionalDetailPage slug={decodeURIComponent(path.slice('/profesionales/'.length))} />
  }

  if (path === '/productos') {
    return <ProductsPage />
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
