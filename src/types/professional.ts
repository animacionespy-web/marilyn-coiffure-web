import type { ImagePosition } from './image'

export type ProfessionalSpecialty =
  | 'Coloración'
  | 'Balayage'
  | 'Mechas'
  | 'Asesoría de imagen'
  | 'Cortes'
  | 'Brushing'
  | 'Peinados'
  | 'Recogidos'
  | 'Quinceañeras'
  | 'Tratamientos'
  | 'Hidratación'

export type ProfessionalSpecialtyFilter =
  | 'Todas'
  | 'Coloración'
  | 'Cortes'
  | 'Peinados'
  | 'Quinceañeras'
  | 'Tratamientos'

export type ProfessionalWorkType = 'photo' | 'before_after'

export interface ProfessionalWork {
  id: string
  professionalId: string
  type: ProfessionalWorkType
  title: string
  image: string
  imageAlt: string
  imagePosition?: ImagePosition
  beforeImage: string
  beforeImageAlt: string
  beforeImagePosition?: ImagePosition
  afterImage: string
  afterImageAlt: string
  afterImagePosition?: ImagePosition
  active: boolean
  order: number
}

export interface Professional {
  id: string
  slug: string
  name: string
  role: string
  specialties: ProfessionalSpecialty[]
  shortDescription: string
  fullDescription: string
  image: string
  imageAlt: string
  imagePosition?: ImagePosition
  whatsappNumber: string
  active: boolean
  featured: boolean
  order: number
  styleIds?: string[]
  availabilityNote?: string
  instagramUrl?: string
  yearsExperience?: string
  scheduleNote?: string
  works?: ProfessionalWork[]
}

export interface ProfessionalSelection {
  mode: 'specific' | 'any'
  professionalId?: string
  selectedAt: string
}
