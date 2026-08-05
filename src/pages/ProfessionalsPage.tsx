import { useMemo, useState } from 'react'
import { ProfessionalFilters } from '../components/professionals/ProfessionalFilters'
import { ProfessionalsGrid } from '../components/professionals/ProfessionalsGrid'
import { ProfessionalsHero } from '../components/professionals/ProfessionalsHero'
import { SelectedProfessionalSummary } from '../components/professionals/SelectedProfessionalSummary'
import { SelectedStyleContext } from '../components/professionals/SelectedStyleContext'
import {
  activeProfessionals,
  findProfessionalById,
  findProfessionalBySlug,
  professionalFilterSpecialties,
} from '../data/professionals'
import { findStyleById, findStyleBySlug } from '../data/styles'
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

function getInitialStyle() {
  const selectedSlug = new URLSearchParams(window.location.search).get('estilo')
  if (selectedSlug) return findStyleBySlug(selectedSlug)

  const storedId = getSelectedStyleId()
  return storedId ? findStyleById(storedId) : undefined
}

function getInitialProfessional() {
  const selectedSlug = new URLSearchParams(window.location.search).get('profesional')
  if (selectedSlug) return findProfessionalBySlug(selectedSlug)

  const storedId = getSelectedProfessionalId()
  return storedId ? findProfessionalById(storedId) : undefined
}

function getInitialAnySelection() {
  const selectedSlug = new URLSearchParams(window.location.search).get('profesional')
  if (selectedSlug === 'cualquiera') return true
  return getProfessionalSelection()?.mode === 'any'
}

export function ProfessionalsPage() {
  const [selectedFilter, setSelectedFilter] = useState<ProfessionalSpecialtyFilter>('Todas')
  const [selectedStyle, setSelectedStyle] = useState<Style | undefined>(getInitialStyle)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | undefined>(getInitialProfessional)
  const [isAnyProfessionalSelected, setIsAnyProfessionalSelected] = useState(getInitialAnySelection)

  useDocumentMeta(
    'Profesionales | Marilyn Coiffure',
    'Conocé al equipo de Marilyn Coiffure y elegí la profesional ideal para consultar disponibilidad.',
  )

  const filteredProfessionals = useMemo(() => {
    if (selectedFilter === 'Todas') return activeProfessionals
    const acceptedSpecialties = professionalFilterSpecialties[selectedFilter]
    return activeProfessionals.filter((professional) =>
      professional.specialties.some((specialty) => acceptedSpecialties.includes(specialty)),
    )
  }, [selectedFilter])

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
          <ProfessionalsGrid
            professionals={filteredProfessionals}
            selectedProfessionalId={selectedProfessional?.id}
            onSelect={selectProfessional}
          />

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
