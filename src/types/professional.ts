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
}

export interface ProfessionalSelection {
  mode: 'specific' | 'any'
  professionalId?: string
  selectedAt: string
}
