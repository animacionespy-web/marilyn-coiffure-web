import type { ImagePosition } from './image'

export type AdminRole = 'admin'

export interface Profile {
  id: string
  email: string
  role: AdminRole
  fullName: string
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  parentCategoryId: string | null
  name: string
  slug: string
  description: string
  icon: string
  coverImageUrl: string
  coverImagePath: string
  coverImagePosition: ImagePosition
  ctaLabel: string
  ctaHref: string
  active: boolean
  displayOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface AdminStyle {
  id: string
  categoryId: string
  subcategoryId: string | null
  name: string
  slug: string
  shortDescription: string
  fullDescription: string
  imageUrl: string
  imagePath: string
  imagePosition: ImagePosition
  tags: string[]
  featured: boolean
  active: boolean
  displayOrder: number
  estimatedDuration: string
  priceFrom: number | null
  professionalIds: string[]
}

export interface AdminProfessional {
  id: string
  name: string
  slug: string
  role: string
  shortDescription: string
  fullDescription: string
  imageUrl: string
  imagePath: string
  imagePosition: ImagePosition
  whatsappNumber: string
  specialties: string[]
  featured: boolean
  active: boolean
  displayOrder: number
  availabilityNote: string
  instagramUrl: string
  styleIds: string[]
  works: AdminProfessionalWork[]
}

export interface AdminProfessionalWork {
  id: string
  professionalId: string
  type: 'photo' | 'before_after'
  title: string
  imageUrl: string
  imagePath: string
  imagePosition: ImagePosition
  beforeImageUrl: string
  beforeImagePath: string
  beforeImagePosition: ImagePosition
  afterImageUrl: string
  afterImagePath: string
  afterImagePosition: ImagePosition
  active: boolean
  displayOrder: number
}

export interface AdminProduct {
  id: string
  name: string
  slug: string
  category: string
  lineName: string
  shortDescription: string
  fullDescription: string
  imageUrl: string
  imagePath: string
  imagePosition: ImagePosition
  featured: boolean
  active: boolean
  displayOrder: number
  price: number | null
  stockStatus: string
}

export interface SiteSettings {
  salonName: string
  generalWhatsappNumber: string
  domain: string
  instagramUrl: string
  facebookUrl: string
  heroTitle: string
  heroDescription: string
  heroImageUrl: string
  heroImagePath: string
  heroImageZoom: number
  heroImagePositionX: number
  heroImagePositionY: number
  homeBeforeAfterTitle: string
  homeBeforeAfterText: string
  homeBeforeImageUrl: string
  homeBeforeImagePath: string
  homeBeforeImageZoom: number
  homeBeforeImagePositionX: number
  homeBeforeImagePositionY: number
  homeAfterImageUrl: string
  homeAfterImagePath: string
  homeAfterImageZoom: number
  homeAfterImagePositionX: number
  homeAfterImagePositionY: number
  finalEditorialImageUrl: string
  finalEditorialImagePath: string
  finalEditorialImageZoom: number
  finalEditorialImagePositionX: number
  finalEditorialImagePositionY: number
  aboutTitle: string
  aboutText: string
  ctaTitle: string
  ctaDescription: string
  formDisclaimer: string
  locationMapsUrl: string
  locationEmbedUrl: string
  locationAddress: string
  address: string
  openingHours: string
  seoTitle: string
  seoDescription: string
  specialties: Array<{ title: string; description: string }>
  homeVisualBlocks: HomeVisualBlock[]
}

export interface HomeVisualBlock {
  id: 'color' | 'cuts' | 'treatments' | 'events'
  eyebrow: string
  title: string
  text: string
  imageUrl: string
  imagePath: string
  imagePosition: ImagePosition
  href: string
}

export interface AuthState {
  loading: boolean
  authenticated: boolean
  authorized: boolean
  profile: Profile | null
  message: string
}

export interface UploadResult {
  path: string
  publicUrl: string
}

export interface AdminFormState {
  saving: boolean
  dirty: boolean
  message: string
  error: string
}

export interface DashboardSummary {
  totalStyles: number
  activeStyles: number
  featuredStyles: number
  totalProfessionals: number
  activeProfessionals: number
  totalCategories: number
}
