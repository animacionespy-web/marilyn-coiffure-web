import { useEffect, useMemo, useState } from 'react'
import { CatalogHero } from '../components/catalog/CatalogHero'
import { CategoryFilters } from '../components/catalog/CategoryFilters'
import { EmptyResults } from '../components/catalog/EmptyResults'
import { SelectedStyleSummary } from '../components/catalog/SelectedStyleSummary'
import { StyleSearch } from '../components/catalog/StyleSearch'
import { StylesGrid } from '../components/catalog/StylesGrid'
import { PublicContentState } from '../components/PublicContentState'
import { usePublicContent } from '../hooks/usePublicContent'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Style, StyleCategoryFilter } from '../types/style'
import { getSelectedStyleId, saveSelectedStyle } from '../utils/styleSelection'

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()

export function CatalogPage() {
  const { styles, categories, loading, error, retry } = usePublicContent()
  const [selectedCategory, setSelectedCategory] = useState<StyleCategoryFilter>('Todos')
  const [query, setQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<Style | undefined>()

  useEffect(() => {
    const selectedSlug = new URLSearchParams(window.location.search).get('seleccion')
    const storedId = getSelectedStyleId()
    setSelectedStyle(styles.find((style) => style.slug === selectedSlug || style.id === storedId))
  }, [styles])

  useDocumentMeta(
    'Catálogo de estilos | Marilyn Coiffure',
    'Explorá cortes, coloración, peinados y tratamientos de Marilyn Coiffure y elegí el estilo ideal para consultar disponibilidad.',
  )

  const filteredStyles = useMemo(() => {
    const normalizedQuery = normalizeText(query)

    return styles.filter((style) => {
      const belongsToCategory = selectedCategory === 'Todos' || style.category === selectedCategory
      if (!belongsToCategory) return false
      if (!normalizedQuery) return true

      const searchableContent = normalizeText(
        [style.name, style.category, style.shortDescription, style.fullDescription, ...style.tags].join(' '),
      )

      return searchableContent.includes(normalizedQuery)
    })
  }, [query, selectedCategory, styles])

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
    window.history.replaceState(null, '', `/estilos?seleccion=${style.slug}`)
    window.requestAnimationFrame(() => {
      document.getElementById('estilo-seleccionado')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  return (
    <>
      <CatalogHero />
      <section className="catalog-content section" aria-labelledby="catalog-results-title">
        <div className="container">
          <div className="catalog-toolbar">
            <StyleSearch value={query} onChange={setQuery} onClear={() => setQuery('')} />
            <CategoryFilters selectedCategory={selectedCategory} onChange={setSelectedCategory} categories={categoryOptions} />
          </div>

          <div className="catalog-results-heading">
            <h2 id="catalog-results-title">Explorá nuestra selección</h2>
            <p aria-live="polite">
              {filteredStyles.length} {filteredStyles.length === 1 ? 'estilo encontrado' : 'estilos encontrados'}
            </p>
          </div>

          {filteredStyles.length > 0 ? (
            <StylesGrid styles={filteredStyles} onSelect={selectStyle} />
          ) : loading || error ? (
            <PublicContentState loading={loading} error={error} onRetry={retry} />
          ) : styles.length === 0 ? (
            <PublicContentState loading={false} error="" empty="No hay estilos publicados todavía." onRetry={retry} />
          ) : (
            <EmptyResults onReset={resetFilters} />
          )}

          {selectedStyle && <SelectedStyleSummary style={selectedStyle} />}
        </div>
      </section>
    </>
  )
}
