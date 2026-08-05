import type { Professional } from './professional'
import type { Style } from './style'

export type HairLengthOption = '' | 'Corto' | 'Medio' | 'Largo' | 'Muy largo' | 'Prefiero explicarlo por WhatsApp'
export type ContactPreference = '' | 'WhatsApp' | 'Llamada' | 'Indistinto'

export interface ConsultationFormData {
  clientName: string
  clientWhatsapp: string
  desiredDate: string
  desiredTime: string
  observation: string
  hairLength: HairLengthOption
  contactPreference: ContactPreference
}

export type ConsultationFormErrors = Partial<Record<keyof ConsultationFormData, string>>

export interface ConsultationSelection {
  style?: Style
  professional?: Professional
  anyProfessional: boolean
}

export interface WhatsappRecipient {
  number: string
  label: string
  source: 'professional' | 'general' | 'missing'
}
