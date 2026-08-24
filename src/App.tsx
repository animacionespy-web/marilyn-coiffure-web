import { lazy, Suspense, useEffect } from 'react'
import { Footer } from './components/Footer'
import { FloatingConsultationButton } from './components/FloatingConsultationButton'
import { Header } from './components/Header'
import { HomeSections } from './components/HomeSections'
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

  useEffect(() => {
    if (loading) return
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' })
    nodes.forEach((node) => observer.observe(node))
    const visibilityFallback = window.setTimeout(() => {
      nodes.forEach((node) => node.classList.add('is-visible'))
    }, 1600)
    return () => {
      observer.disconnect()
      window.clearTimeout(visibilityFallback)
    }
  }, [loading])

  return (
    <main className="maqueta-home" id="contenido-principal">
      <HomeSections />
      <FloatingConsultationButton />
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
