import { ProfessionalWorkGallery } from '../components/professionals/ProfessionalWorkGallery'
import { PositionedImage } from '../components/PositionedImage'
import { PublicContentState } from '../components/PublicContentState'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { usePublicContent } from '../hooks/usePublicContent'
import { saveSelectedProfessional } from '../utils/professionalSelection'
import { getSelectedStyleId } from '../utils/styleSelection'

export function ProfessionalDetailPage({ slug }: { slug: string }) {
  const { professionals, loading, error, retry } = usePublicContent()
  const professional = professionals.find((item) => item.slug === slug && item.active)
  useDocumentMeta(
    professional ? `${professional.name} | Marilyn Coiffure` : 'Profesional | Marilyn Coiffure',
    professional?.shortDescription || 'Conocé el portfolio de profesionales de Marilyn Coiffure.',
    `/profesionales/${slug}`,
  )

  if (!professional) {
    return (
      <main id="contenido-principal" className="professional-profile-page">
        <div className="container professional-profile-page__state">
          <PublicContentState loading={loading} error={error} empty="Esta profesional no está disponible." onRetry={retry} />
          {!loading && <a className="button button--outline" href="/profesionales">Volver a profesionales</a>}
        </div>
      </main>
    )
  }

  const selectProfessional = (destination: 'flow' | 'consultation') => {
    saveSelectedProfessional(professional)
    if (destination === 'consultation') {
      window.location.assign(`/consulta?profesional=${encodeURIComponent(professional.slug)}`)
      return
    }
    window.location.assign(getSelectedStyleId()
      ? `/profesionales?profesional=${encodeURIComponent(professional.slug)}`
      : `/estilos?profesional=${encodeURIComponent(professional.slug)}&focus=selector`)
  }

  return (
    <main id="contenido-principal" className="professional-profile-page">
      <section className="professional-profile-hero">
        <div className="container professional-profile-hero__grid">
          <div className="professional-profile-hero__image">
            <PositionedImage src={professional.image} alt={professional.imageAlt} width="900" height="1080" position={professional.imagePosition} />
          </div>
          <div className="professional-profile-hero__content">
            <p className="eyebrow">Profesional Marilyn</p>
            <h1>{professional.name}</h1>
            <p className="professional-profile-hero__role">{professional.role || professional.specialties[0]}</p>
            <p>{professional.fullDescription || professional.shortDescription}</p>
            <ul aria-label={`Especialidades de ${professional.name}`}>
              {professional.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
            </ul>
            <div className="professional-profile-hero__actions">
              <button className="button button--dark" type="button" onClick={() => selectProfessional('flow')}>Elegir profesional</button>
              <button className="button button--outline" type="button" onClick={() => selectProfessional('consultation')}>Consultar disponibilidad</button>
            </div>
          </div>
        </div>
      </section>

      <section className="professional-portfolio section" aria-labelledby="professional-portfolio-title">
        <div className="container">
          <div className="section-heading professional-portfolio__heading">
            <p className="eyebrow">Portfolio</p>
            <h2 id="professional-portfolio-title">Trabajos realizados</h2>
            <p>Una selección de trabajos publicados por Marilyn Coiffure.</p>
          </div>
          <ProfessionalWorkGallery works={professional.works ?? []} professionalName={professional.name} />
          <div className="professional-portfolio__footer"><a className="button button--outline" href="/profesionales">Volver a profesionales</a></div>
        </div>
      </section>
    </main>
  )
}
