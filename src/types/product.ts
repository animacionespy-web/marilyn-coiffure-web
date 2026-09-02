import type { ImagePosition } from './image'

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  lineName: string
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
