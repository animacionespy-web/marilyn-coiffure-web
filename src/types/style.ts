import type { ImagePosition } from './image'

export type StyleCategory = string

export type StyleCategoryFilter = 'Todos' | StyleCategory

export interface Style {
  id: string
  slug: string
  name: string
  category: StyleCategory
  subcategory?: string
  shortDescription: string
  fullDescription: string
  image: string
  imageAlt: string
  imagePosition?: ImagePosition
  tags: string[]
  featured: boolean
  order: number
  active: boolean
  estimatedDuration?: string
  priceFrom?: string
  professionalIds?: string[]
}

export interface StyleFiltersState {
  category: StyleCategoryFilter
  query: string
}

export interface SelectedStyleState {
  styleId: string
  selectedAt: string
}
