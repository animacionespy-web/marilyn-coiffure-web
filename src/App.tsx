import { AboutSection } from './components/AboutSection'
import { AvailabilityCTA } from './components/AvailabilityCTA'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SpecialtyHighlights } from './components/SpecialtyHighlights'
import { StylesPreview } from './components/StylesPreview'
import { CatalogPage } from './pages/CatalogPage'
import { ProfessionalsPlaceholderPage } from './pages/ProfessionalsPlaceholderPage'
import { StyleDetailPage } from './pages/StyleDetailPage'

function HomePage() {
  return (
    <main id="contenido-principal">
      <Hero />
      <SpecialtyHighlights />
      <StylesPreview />
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
    return <ProfessionalsPlaceholderPage />
  }

  return <HomePage />
}

export function App() {
  return (
    <>
      <a className="skip-link" href="#contenido-principal">
        Ir al contenido principal
      </a>
      <Header />
      <CurrentPage />
      <Footer />
    </>
  )
}
