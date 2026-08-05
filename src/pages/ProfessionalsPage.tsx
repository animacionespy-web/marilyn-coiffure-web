import { useEffect, useMemo, useState } from 'react'
import { ProfessionalFilters } from '../components/professionals/ProfessionalFilters'
import { ProfessionalsGrid } from '../components/professionals/ProfessionalsGrid'
import { ProfessionalsHero } from '../components/professionals/ProfessionalsHero'
import { SelectedProfessionalSummary } from '../components/professionals/SelectedProfessionalSummary'
import { SelectedStyleContext } from '../components/professionals/SelectedStyleContext'
import { PublicContentState } from '../components/PublicContentState'
import { professionalFilterSpecialties } from '../data/professionals'
import { usePublicContent } from '../hooks/usePublicContent'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Professional, ProfessionalSpecialtyFilter } from '../types/professional'
import type { Style } from '../types/style'
import {
  getProfessionalSelection,
  getSelectedProfessionalId,
  saveAnyProfessionalSelection,
  saveSelectedProfessional,
} from '../utils/professionalSelection'
import { clearSelectedStyle, getSelectedStyleId } from '../utils/styleSelection'

function getInitialAnySelection() {
  const selectedSlug = new URLSearchParams(window.location.search).get('profesional')
  if (selectedSlug === 'cualquiera') return true
  return getProfessionalSelection()?.mode === 'any'
}

export function ProfessionalsPage() {
  const { styles, professionals, loading, error, retry } = usePublicContent()
  const [selectedFilter, setSelectedFilter] = useState<ProfessionalSpecialtyFilter>('Todas')
  const [selectedStyle, setSelectedStyle] = useState<Style | undefined>()
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | undefined>()
  const [isAnyProfessionalSelected, setIsAnyProfessionalSelected] = useState(getInitialAnySelection)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const styleSlug = params.get('estilo')
    const professionalSlug = params.get('profesional')
    const storedStyleId = getSelectedStyleId()
    const storedProfessionalId = getSelectedProfessionalId()
    setSelectedStyle(styles.find((style) => style.slug === styleSlug || style.id === storedStyleId))
    setSelectedProfessional(professionals.find((professional) => professional.slug === professionalSlug || professional.id === storedProfessionalId))
  }, [professionals, styles])

  useDocumentMeta(
    'Profesionales | Marilyn Coiffure',
    'Conocé al equipo de Marilyn Coiffure y elegí la profesional ideal para consultar disponibilidad.',
  )

  const filteredProfessionals = useMemo(() => {
    const filtered = selectedFilter === 'Todas' ? professionals : professionals.filter((professional) => {
      const acceptedSpecialties = professionalFilterSpecialties[selectedFilter]
      return professional.specialties.some((specialty) => acceptedSpecialties.includes(specialty))
    })
    if (!selectedStyle) return filtered
    return [...filtered].sort((first, second) =>
      Number(Boolean(second.styleIds?.includes(selectedStyle.id))) - Number(Boolean(first.styleIds?.includes(selectedStyle.id))),
    )
  }, [professionals, selectedFilter, selectedStyle])

  const updateUrl = (professional?: Professional, style = selectedStyle, anyProfessional = false) => {
    const params = new URLSearchParams()
    if (style) params.set('estilo', style.slug)
    if (professional) params.set('profesional', professional.slug)
    else if (anyProfessional) params.set('profesional', 'cualquiera')
    const query = params.toString()
    window.history.replaceState(null, '', query ? `/profesionales?${query}` : '/profesionales')
  }

  const selectProfessional = (professional: Professional) => {
    saveSelectedProfessional(professional)
    setSelectedProfessional(professional)
    setIsAnyProfessionalSelected(false)
    updateUrl(professional)
    window.requestAnimationFrame(() => {
      document.getElementById('profesional-seleccionada')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const selectAnyProfessional = () => {
    saveAnyProfessionalSelection()
    setSelectedProfessional(undefined)
    setIsAnyProfessionalSelected(true)
    updateUrl(undefined, selectedStyle, true)
    window.requestAnimationFrame(() => {
      document.getElementById('profesional-seleccionada')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const continueWithoutStyle = () => {
    clearSelectedStyle()
    setSelectedStyle(undefined)
    updateUrl(selectedProfessional, undefined, isAnyProfessionalSelected)
  }

  return (
    <main id="contenido-principal">
      <ProfessionalsHero />
      <section className="professionals-content section" aria-labelledby="professionals-list-title">
        <div className="container">
          {selectedStyle && (
            <SelectedStyleContext style={selectedStyle} onContinueWithoutStyle={continueWithoutStyle} />
          )}

          <div className="professionals-list-heading">
            <div>
              <p className="eyebrow">Especialidades</p>
              <h2 id="professionals-list-title">Conocé a cada profesional</h2>
            </div>
            <p aria-live="polite">
              {filteredProfessionals.length}{' '}
              {filteredProfessionals.length === 1 ? 'profesional disponible' : 'profesionales disponibles'}
            </p>
          </div>

          <ProfessionalFilters selectedFilter={selectedFilter} onChange={setSelectedFilter} />
          {selectedStyle && <p className="professional-recommendation-note">Las profesionales relacionadas con “{selectedStyle.name}” aparecen primero.</p>}
          <aside className={`any-professional ${isAnyProfessionalSelected ? 'is-selected' : ''}`}>
            <div className="any-professional__mark" aria-hidden="true">✦</div>
            <div>
              <p className="eyebrow">Más flexibilidad</p>
              <h2>Cualquiera disponible</h2>
              <p>Dejá que el salón te indique qué profesional puede atenderte en el día y horario deseados.</p>
            </div>
            <button
              className={`button ${isAnyProfessionalSelected ? 'button--selected' : 'button--dark'}`}
              type="button"
              aria-pressed={isAnyProfessionalSelected}
              onClick={selectAnyProfessional}
            >
              {isAnyProfessionalSelected ? 'Opción elegida' : 'Elegir cualquiera disponible'}
            </button>
          </aside>
          {filteredProfessionals.length === 0 && (loading || error || professionals.length === 0) ? <PublicContentState loading={loading} error={error} empty="No hay profesionales publicadas todavía." onRetry={retry} /> : <ProfessionalsGrid
            professionals={filteredProfessionals}
            selectedProfessionalId={selectedProfessional?.id}
            onSelect={selectProfessional}
          />}

          {(selectedProfessional || isAnyProfessionalSelected) && (
            <SelectedProfessionalSummary
              professional={selectedProfessional}
              isAnyProfessional={isAnyProfessionalSelected}
              style={selectedStyle}
            />
          )}
        </div>
      </section>
    </main>
  )
}
