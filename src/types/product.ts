import type { ImagePosition } from './image'

export type ProductCategory =
  | 'Shampoo'
  | 'Acondicionador'
  | 'Tratamientos'
  | 'Mascarillas'
  | 'Finalizadores'
  | 'Cuidado del color'

export interface Product {
  id: string
  slug: string
  name: string
  category: ProductCategory
  shortDescription: string
  fullDescription: string
  image: string
  imageAlt: string
  imagePosition?: ImagePosition
  featured: boolean
  active: boolean
  displayOrder: number
  price?: number
  stockStatus?: string
  whatsappMessage?: string
}
