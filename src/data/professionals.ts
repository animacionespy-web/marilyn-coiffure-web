import type {
  Professional,
  ProfessionalSpecialty,
  ProfessionalSpecialtyFilter,
} from '../types/professional'

export const professionalFilters: ProfessionalSpecialtyFilter[] = [
  'Todas',
  'Coloración',
  'Cortes',
  'Peinados',
  'Quinceañeras',
  'Tratamientos',
]

export const professionalFilterSpecialties: Record<
  Exclude<ProfessionalSpecialtyFilter, 'Todas'>,
  ProfessionalSpecialty[]
> = {
  Coloración: ['Coloración', 'Balayage', 'Mechas'],
  Cortes: ['Cortes'],
  Peinados: ['Peinados', 'Recogidos', 'Brushing'],
  Quinceañeras: ['Quinceañeras'],
  Tratamientos: ['Tratamientos', 'Hidratación'],
}

export const professionals: Professional[] = [
  {
    id: 'professional-001',
    slug: 'marilyn',
    name: 'Marilyn',
    role: 'Directora estilista',
    specialties: ['Coloración', 'Balayage', 'Mechas', 'Asesoría de imagen'],
    shortDescription: 'Una mirada integral para crear color y estilo en armonía con cada clienta.',
    fullDescription:
      'Su propuesta comienza con una conversación y una evaluación cuidadosa del cabello. Trabaja cada cambio de imagen de forma personalizada, priorizando la armonía, el cuidado y un resultado que se sienta propio.',
    image: '/images/professionals/marilyn.svg',
    imageAlt: 'Retrato provisional reservado para Marilyn',
    whatsappNumber: '',
    active: true,
    featured: true,
    order: 1,
    styleIds: ['color-001', 'color-002', 'color-003', 'color-004'],
    availabilityNote: 'Disponibilidad sujeta a consulta y confirmación.',
    scheduleNote: 'Horarios a confirmar con el salón.',
  },
  {
    id: 'professional-002',
    slug: 'laura',
    name: 'Laura',
    role: 'Estilista',
    specialties: ['Cortes', 'Brushing', 'Balayage'],
    shortDescription: 'Cortes con movimiento y terminaciones pulidas para el día a día.',
    fullDescription:
      'Combina formas actuales con propuestas prácticas y fáciles de mantener. Cada corte se adapta a la textura, las facciones y la rutina de la clienta.',
    image: '/images/professionals/laura.svg',
    imageAlt: 'Retrato provisional reservado para Laura',
    whatsappNumber: '',
    active: true,
    featured: true,
    order: 2,
    styleIds: ['cut-001', 'cut-002', 'cut-003', 'cut-004'],
    availabilityNote: 'Disponibilidad sujeta a consulta y confirmación.',
  },
  {
    id: 'professional-003',
    slug: 'camila',
    name: 'Camila',
    role: 'Especialista en eventos',
    specialties: ['Peinados', 'Recogidos', 'Quinceañeras'],
    shortDescription: 'Peinados elegantes y cómodos para acompañar momentos especiales.',
    fullDescription:
      'Diseña peinados y recogidos considerando el look completo, los accesorios y la duración del evento. La propuesta final se acuerda después de evaluar el cabello.',
    image: '/images/professionals/camila.svg',
    imageAlt: 'Retrato provisional reservado para Camila',
    whatsappNumber: '',
    active: true,
    featured: true,
    order: 3,
    styleIds: ['style-001', 'style-002', 'style-003', 'quinces-001', 'quinces-002'],
    availabilityNote: 'Disponibilidad sujeta a consulta y confirmación.',
  },
  {
    id: 'professional-004',
    slug: 'sofia',
    name: 'Sofía',
    role: 'Colorista',
    specialties: ['Coloración', 'Mechas', 'Balayage'],
    shortDescription: 'Matices luminosos y transiciones suaves con especial atención al cuidado.',
    fullDescription:
      'Trabaja propuestas de iluminación y color adaptadas a la base y al historial del cabello. La técnica se define después de una evaluación profesional previa.',
    image: '/images/professionals/sofia.svg',
    imageAlt: 'Retrato provisional reservado para Sofía',
    whatsappNumber: '',
    active: true,
    featured: false,
    order: 4,
    styleIds: ['color-001', 'color-002', 'color-003', 'color-004'],
    availabilityNote: 'Disponibilidad sujeta a consulta y confirmación.',
  },
  {
    id: 'professional-005',
    slug: 'valentina',
    name: 'Valentina',
    role: 'Especialista en cuidado capilar',
    specialties: ['Tratamientos', 'Hidratación', 'Asesoría de imagen'],
    shortDescription: 'Cuidado personalizado para recuperar suavidad, brillo y manejabilidad.',
    fullDescription:
      'Evalúa las necesidades visibles del cabello para orientar una experiencia de hidratación o reparación. Los pasos definitivos se seleccionan durante la consulta.',
    image: '/images/professionals/valentina.svg',
    imageAlt: 'Retrato provisional reservado para Valentina',
    whatsappNumber: '',
    active: true,
    featured: false,
    order: 5,
    styleIds: ['treatment-001', 'treatment-002'],
    availabilityNote: 'Disponibilidad sujeta a consulta y confirmación.',
  },
  {
    id: 'professional-006',
    slug: 'ana',
    name: 'Ana',
    role: 'Estilista integral',
    specialties: ['Cortes', 'Peinados', 'Brushing'],
    shortDescription: 'Versatilidad y atención cercana para cortes y peinados de ocasión.',
    fullDescription:
      'Acompaña desde cambios sutiles hasta preparaciones para eventos, siempre con una propuesta ajustada al estilo y a las preferencias de cada clienta.',
    image: '/images/professionals/ana.svg',
    imageAlt: 'Retrato provisional reservado para Ana',
    whatsappNumber: '',
    active: true,
    featured: false,
    order: 6,
    availabilityNote: 'Disponibilidad sujeta a consulta y confirmación.',
  },
]

export const activeProfessionals = professionals
  .filter((professional) => professional.active)
  .sort((first, second) => first.order - second.order)

export function findProfessionalById(id: string) {
  return activeProfessionals.find((professional) => professional.id === id)
}

export function findProfessionalBySlug(slug: string) {
  return activeProfessionals.find((professional) => professional.slug === slug)
}
