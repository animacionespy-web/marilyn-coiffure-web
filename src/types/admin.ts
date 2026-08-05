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
  name: string
  slug: string
  description: string
  icon: string
  active: boolean
  displayOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface AdminStyle {
  id: string
  categoryId: string
  name: string
  slug: string
  shortDescription: string
  fullDescription: string
  imageUrl: string
  imagePath: string
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
  whatsappNumber: string
  specialties: string[]
  featured: boolean
  active: boolean
  displayOrder: number
  availabilityNote: string
  instagramUrl: string
  styleIds: string[]
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
  aboutTitle: string
  aboutText: string
  ctaTitle: string
  ctaDescription: string
  formDisclaimer: string
  address: string
  openingHours: string
  seoTitle: string
  seoDescription: string
  specialties: Array<{ title: string; description: string }>
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
