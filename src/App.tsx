import { AboutSection } from './components/AboutSection'
import { AvailabilityCTA } from './components/AvailabilityCTA'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SpecialtyHighlights } from './components/SpecialtyHighlights'
import { StylesPreview } from './components/StylesPreview'

export function App() {
  return (
    <>
      <a className="skip-link" href="#contenido-principal">
        Ir al contenido principal
      </a>
      <Header />
      <main id="contenido-principal">
        <Hero />
        <SpecialtyHighlights />
        <StylesPreview />
        <AboutSection />
        <AvailabilityCTA />
      </main>
      <Footer />
    </>
  )
}
