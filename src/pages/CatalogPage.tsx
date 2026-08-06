import { useEffect, useMemo, useState } from 'react'
import { CatalogHero } from '../components/catalog/CatalogHero'
import { CategoryFilters } from '../components/catalog/CategoryFilters'
import { EmptyResults } from '../components/catalog/EmptyResults'
import { StyleSearch } from '../components/catalog/StyleSearch'
import { StylesGrid } from '../components/catalog/StylesGrid'
import { PublicContentState } from '../components/PublicContentState'
import { CompactSelectionBar } from '../components/selection/CompactSelectionBar'
import { FlowSelectionSummary } from '../components/selection/FlowSelectionSummary'
import { usePublicContent } from '../hooks/usePublicContent'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Style, StyleCategoryFilter } from '../types/style'
import type { Professional } from '../types/professional'
import { clearSelectedProfessional, getProfessionalSelection } from '../utils/professionalSelection'
import { getSelectedStyleId, saveSelectedStyle } from '../utils/styleSelection'

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()

export function CatalogPage() {
  const { styles, professionals, categories, loading, error, retry } = usePublicContent()
  const [selectedCategory, setSelectedCategory] = useState<StyleCategoryFilter>('Todos')
  const [query, setQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<Style | undefined>()
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | undefined>()
  const [isAnyProfessional, setIsAnyProfessional] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const selectedSlug = params.get('seleccion')
    const professionalSlug = params.get('profesional')
    const storedId = getSelectedStyleId()
    setSelectedStyle(styles.find((style) => style.slug === selectedSlug || style.id === storedId))
    const professionalSelection = getProfessionalSelection()
    const urlChoosesAny = professionalSlug === 'cualquiera'
    const storedChoosesAny = !professionalSlug && professionalSelection?.mode === 'any'
    setIsAnyProfessional(urlChoosesAny || storedChoosesAny)
    setSelectedProfessional(professionals.find((item) => professionalSlug
      ? professionalSlug !== 'cualquiera' && item.slug === professionalSlug
      : professionalSelection?.mode === 'specific' && item.id === professionalSelection.professionalId))
  }, [professionals, styles])

  useDocumentMeta(
    'Catálogo de estilos | Marilyn Coiffure',
    'Explorá cortes, coloración, peinados y tratamientos de Marilyn Coiffure y elegí el estilo ideal para consultar disponibilidad.',
  )

  const isStyleRecommended = (style: Style) => Boolean(
    selectedProfessional && (selectedProfessional.styleIds?.includes(style.id) || style.professionalIds?.includes(selectedProfessional.id)),
  )

  const filteredStyles = useMemo(() => {
    const normalizedQuery = normalizeText(query)

    const matching = styles.filter((style) => {
      const belongsToCategory = selectedCategory === 'Todos' || style.category === selectedCategory
      if (!belongsToCategory) return false
      if (!normalizedQuery) return true

      const searchableContent = normalizeText(
        [style.name, style.category, style.shortDescription, style.fullDescription, ...style.tags].join(' '),
      )

      return searchableContent.includes(normalizedQuery)
    })
    if (!selectedProfessional) return matching
    return [...matching].sort((first, second) => Number(isStyleRecommended(second)) - Number(isStyleRecommended(first)) || first.order - second.order)
  }, [query, selectedCategory, selectedProfessional, styles])

  const categoryOptions = useMemo<StyleCategoryFilter[]>(() => [
    'Todos',
    ...Array.from(new Set((categories.length ? categories.map((item) => item.name) : styles.map((item) => item.category)))) as StyleCategoryFilter[],
  ], [categories, styles])

  const resetFilters = () => {
    setSelectedCategory('Todos')
    setQuery('')
  }

  const selectStyle = (style: Style) => {
    saveSelectedStyle(style)
    setSelectedStyle(style)
    const params = new URLSearchParams({ seleccion: style.slug })
    if (selectedProfessional) params.set('profesional', selectedProfessional.slug)
    else if (isAnyProfessional) params.set('profesional', 'cualquiera')
    window.history.replaceState(null, '', `/estilos?${params.toString()}`)
  }

  const removeProfessional = () => {
    clearSelectedProfessional()
    setSelectedProfessional(undefined)
    setIsAnyProfessional(false)
    window.history.replaceState(null, '', selectedStyle ? `/estilos?seleccion=${selectedStyle.slug}` : '/estilos')
  }

  return (
    <>
      <CatalogHero />
      <section className="catalog-content section" aria-labelledby="catalog-results-title">
        <div className="container">
          {(selectedProfessional || isAnyProfessional) && <CompactSelectionBar eyebrow="Profesional elegida" title={isAnyProfessional ? 'Cualquiera disponible' : selectedProfessional?.name ?? ''} subtitle={selectedProfessional?.specialties[0]} image={selectedProfessional?.image} imageAlt={selectedProfessional?.imageAlt} changeHref={selectedStyle ? `/profesionales?estilo=${selectedStyle.slug}` : '/profesionales'} onRemove={removeProfessional} />}
          <div className="choice-heading"><h2>Elegí el estilo que querés consultar</h2></div>
          <div className="catalog-toolbar">
            <StyleSearch value={query} onChange={setQuery} onClear={() => setQuery('')} />
            <CategoryFilters selectedCategory={selectedCategory} onChange={setSelectedCategory} categories={categoryOptions} />
          </div>

          <div className="catalog-results-heading">
            <h2 id="catalog-results-title">Estilos disponibles</h2>
            <p aria-live="polite">
              {filteredStyles.length} {filteredStyles.length === 1 ? 'estilo encontrado' : 'estilos encontrados'}
            </p>
          </div>

          {filteredStyles.length > 0 ? (
            <StylesGrid styles={filteredStyles} selectedStyleId={selectedStyle?.id} recommendedStyleIds={selectedProfessional ? filteredStyles.filter(isStyleRecommended).map((style) => style.id) : []} onSelect={selectStyle} />
          ) : loading || error ? (
            <PublicContentState loading={loading} error={error} onRetry={retry} />
          ) : styles.length === 0 ? (
            <PublicContentState loading={false} error="" empty="No hay estilos publicados todavía." onRetry={retry} />
          ) : (
            <EmptyResults onReset={resetFilters} />
          )}

          {(selectedStyle || selectedProfessional || isAnyProfessional) && <FlowSelectionSummary style={selectedStyle} professional={selectedProfessional} anyProfessional={isAnyProfessional} />}
        </div>
      </section>
    </>
  )
}
