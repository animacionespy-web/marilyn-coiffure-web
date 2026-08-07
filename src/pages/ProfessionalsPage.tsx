import { useEffect, useMemo, useRef, useState } from 'react'
import { ProfessionalFilters } from '../components/professionals/ProfessionalFilters'
import { ProfessionalSearch } from '../components/professionals/ProfessionalSearch'
import { ProfessionalsGrid } from '../components/professionals/ProfessionalsGrid'
import { ProfessionalsHero } from '../components/professionals/ProfessionalsHero'
import { PublicContentState } from '../components/PublicContentState'
import { CompactSelectionBar } from '../components/selection/CompactSelectionBar'
import { FlowSelectionSummary } from '../components/selection/FlowSelectionSummary'
import { professionalFilterSpecialties } from '../data/professionals'
import { usePublicContent } from '../hooks/usePublicContent'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Professional, ProfessionalSpecialtyFilter } from '../types/professional'
import type { Style } from '../types/style'
import { getProfessionalSelection, getSelectedProfessionalId, saveAnyProfessionalSelection, saveSelectedProfessional } from '../utils/professionalSelection'
import { clearSelectedStyle, getSelectedStyleId } from '../utils/styleSelection'
import { scrollToElement } from '../utils/scroll'

const normalizeText = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim()

export function ProfessionalsPage() {
  const { styles, professionals, loading, error, retry } = usePublicContent()
  const [selectedFilter, setSelectedFilter] = useState<ProfessionalSpecialtyFilter>('Todas')
  const [query, setQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<Style | undefined>()
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | undefined>()
  const [isAnyProfessionalSelected, setIsAnyProfessionalSelected] = useState(false)
  const selectionSectionRef = useRef<HTMLElement>(null)
  const summaryRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const styleSlug = params.get('estilo')
    const professionalSlug = params.get('profesional')
    const professionalSelection = getProfessionalSelection()
    setSelectedStyle(styles.find((style) => style.slug === styleSlug || style.id === getSelectedStyleId()))
    setIsAnyProfessionalSelected(professionalSlug === 'cualquiera' || (!professionalSlug && professionalSelection?.mode === 'any'))
    setSelectedProfessional(professionals.find((professional) => professionalSlug
      ? professionalSlug !== 'cualquiera' && professional.slug === professionalSlug
      : professional.id === getSelectedProfessionalId()))
  }, [professionals, styles])

  useEffect(() => {
    if (!loading && new URLSearchParams(window.location.search).get('focus') === 'selector') {
      scrollToElement(() => selectionSectionRef.current)
    }
  }, [loading])

  useDocumentMeta('Profesionales | Marilyn Coiffure', 'Conocé al equipo de Marilyn Coiffure y elegí la profesional ideal para consultar disponibilidad.')

  const filteredProfessionals = useMemo(() => {
    const normalizedQuery = normalizeText(query)
    const matchingQuery = normalizedQuery ? professionals.filter((professional) => normalizeText([professional.name, professional.role, ...professional.specialties].join(' ')).includes(normalizedQuery)) : professionals
    const filtered = selectedFilter === 'Todas' ? matchingQuery : matchingQuery.filter((professional) => professional.specialties.some((specialty) => professionalFilterSpecialties[selectedFilter].includes(specialty)))
    if (!selectedStyle) return filtered
    return [...filtered].sort((first, second) => Number(Boolean(second.styleIds?.includes(selectedStyle.id))) - Number(Boolean(first.styleIds?.includes(selectedStyle.id))) || first.order - second.order)
  }, [professionals, query, selectedFilter, selectedStyle])

  const updateUrl = (professional?: Professional, style = selectedStyle, anyProfessional = false) => {
    const params = new URLSearchParams()
    if (style) params.set('estilo', style.slug)
    if (professional) params.set('profesional', professional.slug)
    else if (anyProfessional) params.set('profesional', 'cualquiera')
    window.history.replaceState(null, '', params.toString() ? `/profesionales?${params.toString()}` : '/profesionales')
  }

  const selectProfessional = (professional: Professional) => {
    saveSelectedProfessional(professional)
    if (!selectedStyle) {
      window.location.assign(`/estilos?profesional=${professional.slug}&focus=selector`)
      return
    }
    setSelectedProfessional(professional)
    setIsAnyProfessionalSelected(false)
    updateUrl(professional)
    scrollToElement(() => summaryRef.current)
  }

  const selectAnyProfessional = () => {
    saveAnyProfessionalSelection()
    if (!selectedStyle) {
      window.location.assign('/estilos?profesional=cualquiera&focus=selector')
      return
    }
    setSelectedProfessional(undefined)
    setIsAnyProfessionalSelected(true)
    updateUrl(undefined, selectedStyle, true)
    scrollToElement(() => summaryRef.current)
  }

  const removeStyle = () => {
    clearSelectedStyle()
    setSelectedStyle(undefined)
    updateUrl(selectedProfessional, undefined, isAnyProfessionalSelected)
  }

  return (
    <main id="contenido-principal">
      <ProfessionalsHero />
      <section className="professionals-content section" aria-labelledby="professionals-list-title" ref={selectionSectionRef}>
        <div className="container">
          {selectedStyle && <CompactSelectionBar eyebrow="Estilo elegido" title={selectedStyle.name} image={selectedStyle.image} imageAlt={selectedStyle.imageAlt} changeHref="/estilos" onRemove={removeStyle} />}
          <div className="professionals-list-heading"><div><h2 id="professionals-list-title">Elegí una profesional</h2></div><p aria-live="polite">{filteredProfessionals.length} {filteredProfessionals.length === 1 ? 'profesional disponible' : 'profesionales disponibles'}</p></div>
          <div className="professionals-toolbar"><ProfessionalSearch value={query} onChange={setQuery} onClear={() => setQuery('')} /><ProfessionalFilters selectedFilter={selectedFilter} onChange={setSelectedFilter} /></div>
          {filteredProfessionals.length === 0 ? <PublicContentState loading={loading} error={error} empty={professionals.length === 0 ? 'No hay profesionales publicadas todavía.' : 'No encontramos profesionales con esos criterios.'} onRetry={retry} /> : <ProfessionalsGrid professionals={filteredProfessionals} selectedProfessionalId={selectedProfessional?.id} selectedStyleId={selectedStyle?.id} isAnySelected={isAnyProfessionalSelected} onSelect={selectProfessional} onSelectAny={selectAnyProfessional} />}
          {(selectedProfessional || isAnyProfessionalSelected) && <FlowSelectionSummary professional={selectedProfessional} anyProfessional={isAnyProfessionalSelected} style={selectedStyle} sectionRef={summaryRef} />}
        </div>
      </section>
    </main>
  )
}
