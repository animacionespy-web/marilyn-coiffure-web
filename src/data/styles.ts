import type { Style, StyleCategoryFilter } from '../types/style'

export const styleCategories: StyleCategoryFilter[] = [
  'Todos',
  'Cortes',
  'Coloración',
  'Peinados',
  'Quinceañeras',
  'Tratamientos',
]

export const styles: Style[] = [
  {
    id: 'cut-001',
    slug: 'bob-elegante',
    name: 'Bob elegante',
    category: 'Cortes',
    shortDescription: 'Una silueta definida, moderna y fácil de adaptar a tu estilo.',
    fullDescription:
      'Un corte de líneas limpias que enmarca el rostro y aporta una presencia sofisticada. La forma, el largo y la textura se adaptan después de evaluar tus facciones y el movimiento natural del cabello.',
    image: '/images/styles/corte-bob.svg',
    imageAlt: 'Referencia visual provisional para el corte bob elegante',
    tags: ['moderno', 'media melena', 'elegante'],
    featured: true,
    order: 1,
    active: true,
    estimatedDuration: '60 a 90 minutos',
  },
  {
    id: 'cut-002',
    slug: 'largo-en-capas',
    name: 'Largo en capas',
    category: 'Cortes',
    shortDescription: 'Capas suaves que aportan movimiento sin perder el largo.',
    fullDescription:
      'Una propuesta para dar aire, ligereza y movimiento a cabellos largos. La distribución de las capas se personaliza según la densidad, la textura y la rutina de peinado.',
    image: '/images/styles/corte-capas.svg',
    imageAlt: 'Referencia visual provisional para un corte largo en capas',
    tags: ['capas', 'cabello largo', 'movimiento'],
    featured: false,
    order: 2,
    active: true,
    estimatedDuration: '60 a 90 minutos',
  },
  {
    id: 'cut-003',
    slug: 'corte-mariposa',
    name: 'Corte mariposa',
    category: 'Cortes',
    shortDescription: 'Volumen ligero y capas envolventes alrededor del rostro.',
    fullDescription:
      'Capas amplias y conectadas que crean volumen y una caída envolvente. Se ajusta el contorno para acompañar el rostro y conservar un acabado natural.',
    image: '/images/styles/corte-mariposa.svg',
    imageAlt: 'Referencia visual provisional para el corte mariposa',
    tags: ['volumen', 'capas', 'rostro'],
    featured: false,
    order: 3,
    active: true,
  },
  {
    id: 'cut-004',
    slug: 'flequillo-cortina',
    name: 'Flequillo cortina',
    category: 'Cortes',
    shortDescription: 'Un marco suave para renovar el look con sutileza.',
    fullDescription:
      'Flequillo abierto de transición suave que se integra al resto del cabello. El largo se define según las facciones y el mantenimiento que prefieras.',
    image: '/images/styles/corte-bob.svg',
    imageAlt: 'Referencia visual provisional para un flequillo cortina',
    tags: ['flequillo', 'suave', 'contorno'],
    featured: false,
    order: 4,
    active: true,
  },
  {
    id: 'color-001',
    slug: 'balayage-miel',
    name: 'Balayage miel',
    category: 'Coloración',
    shortDescription: 'Reflejos cálidos y luminosos con una transición delicada.',
    fullDescription:
      'Una iluminación de aspecto natural con matices miel y transiciones suaves. La propuesta de color se define después de revisar la base, el historial y el estado del cabello.',
    image: '/images/styles/color-miel.svg',
    imageAlt: 'Referencia visual provisional para una coloración balayage miel',
    tags: ['balayage', 'cálido', 'luminoso'],
    featured: true,
    order: 5,
    active: true,
    estimatedDuration: 'Según evaluación del cabello',
  },
  {
    id: 'color-002',
    slug: 'rubio-beige',
    name: 'Rubio beige',
    category: 'Coloración',
    shortDescription: 'Un rubio equilibrado, suave y de apariencia sofisticada.',
    fullDescription:
      'Matices beige que buscan equilibrar calidez y neutralidad. La técnica y el nivel de aclaración se determinan según la base natural y los procesos anteriores.',
    image: '/images/styles/color-beige.svg',
    imageAlt: 'Referencia visual provisional para una coloración rubio beige',
    tags: ['rubio', 'beige', 'neutral'],
    featured: false,
    order: 6,
    active: true,
  },
  {
    id: 'color-003',
    slug: 'morena-iluminada',
    name: 'Morena iluminada',
    category: 'Coloración',
    shortDescription: 'Puntos de luz estratégicos que respetan la profundidad natural.',
    fullDescription:
      'Una iluminación sutil que conserva la identidad de una base oscura y suma dimensión. La ubicación de los reflejos se personaliza según el corte y el movimiento.',
    image: '/images/styles/color-morena.svg',
    imageAlt: 'Referencia visual provisional para el estilo morena iluminada',
    tags: ['morena', 'reflejos', 'dimensión'],
    featured: false,
    order: 7,
    active: true,
  },
  {
    id: 'color-004',
    slug: 'cobrizo-suave',
    name: 'Cobrizo suave',
    category: 'Coloración',
    shortDescription: 'Calidez delicada con reflejos cobrizos elegantes.',
    fullDescription:
      'Un cobrizo equilibrado y luminoso, adaptado al tono de piel y a la base existente. La intensidad final se acuerda durante la evaluación previa.',
    image: '/images/styles/color-miel.svg',
    imageAlt: 'Referencia visual provisional para una coloración cobrizo suave',
    tags: ['cobrizo', 'cálido', 'reflejos'],
    featured: false,
    order: 8,
    active: true,
  },
  {
    id: 'style-001',
    slug: 'ondas-glam',
    name: 'Ondas glam',
    category: 'Peinados',
    shortDescription: 'Ondas pulidas con movimiento y un acabado luminoso.',
    fullDescription:
      'Un peinado de ondas definidas y suaves, preparado para acompañar eventos y ocasiones especiales. El volumen y la terminación se adaptan al largo del cabello.',
    image: '/images/styles/peinado-ondas.svg',
    imageAlt: 'Referencia visual provisional para un peinado con ondas glam',
    tags: ['ondas', 'evento', 'glam'],
    featured: true,
    order: 9,
    active: true,
    estimatedDuration: '60 a 90 minutos',
  },
  {
    id: 'style-002',
    slug: 'recogido-elegante',
    name: 'Recogido elegante',
    category: 'Peinados',
    shortDescription: 'Una composición refinada con sujeción cómoda y duradera.',
    fullDescription:
      'Recogido de líneas cuidadas, pensado para mantener comodidad y presencia durante el evento. La altura, el volumen y los detalles se definen según el look completo.',
    image: '/images/styles/peinado-recogido.svg',
    imageAlt: 'Referencia visual provisional para un recogido elegante',
    tags: ['recogido', 'elegante', 'evento'],
    featured: false,
    order: 10,
    active: true,
  },
  {
    id: 'style-003',
    slug: 'trenza-romantica',
    name: 'Trenza romántica',
    category: 'Peinados',
    shortDescription: 'Textura suave y detalles delicados para un acabado natural.',
    fullDescription:
      'Una trenza de aspecto orgánico con volumen controlado y terminaciones delicadas. Puede integrarse en recogidos o semirrecogidos según el evento.',
    image: '/images/styles/peinado-ondas.svg',
    imageAlt: 'Referencia visual provisional para una trenza romántica',
    tags: ['trenza', 'romántico', 'textura'],
    featured: false,
    order: 11,
    active: true,
  },
  {
    id: 'treatment-001',
    slug: 'hidratacion-profunda',
    name: 'Hidratación profunda',
    category: 'Tratamientos',
    shortDescription: 'Cuidado intensivo para recuperar suavidad y flexibilidad.',
    fullDescription:
      'Una experiencia de cuidado orientada a mejorar la sensación de suavidad y manejabilidad. El protocolo se selecciona después de observar las necesidades del cabello.',
    image: '/images/styles/tratamiento-hidratacion.svg',
    imageAlt: 'Referencia visual provisional para un tratamiento de hidratación profunda',
    tags: ['hidratación', 'suavidad', 'cuidado'],
    featured: false,
    order: 12,
    active: true,
  },
  {
    id: 'treatment-002',
    slug: 'reparacion-capilar',
    name: 'Reparación capilar',
    category: 'Tratamientos',
    shortDescription: 'Rutina de cuidado adaptada a cabellos sensibilizados.',
    fullDescription:
      'Evaluación y cuidado enfocados en cabellos que atravesaron procesos químicos o presentan sensibilidad. La propuesta final depende del diagnóstico profesional.',
    image: '/images/styles/tratamiento-nutricion.svg',
    imageAlt: 'Referencia visual provisional para un tratamiento de reparación capilar',
    tags: ['reparación', 'nutrición', 'cabello sensibilizado'],
    featured: false,
    order: 13,
    active: true,
  },
  {
    id: 'quinces-001',
    slug: 'peinado-clasico-quinceanera',
    name: 'Peinado clásico de quinceañera',
    category: 'Quinceañeras',
    shortDescription: 'Un peinado especial, elegante y pensado para acompañar todo el evento.',
    fullDescription:
      'Propuesta clásica con volumen equilibrado y terminaciones cuidadas. El diseño se adapta al vestido, los accesorios y la personalidad de la quinceañera.',
    image: '/images/styles/quince-clasico.svg',
    imageAlt: 'Referencia visual provisional para un peinado clásico de quinceañera',
    tags: ['quinceañera', 'clásico', 'evento'],
    featured: true,
    order: 14,
    active: true,
  },
  {
    id: 'quinces-002',
    slug: 'semirrecogido-con-ondas',
    name: 'Semirrecogido con ondas',
    category: 'Quinceañeras',
    shortDescription: 'Movimiento, delicadeza y comodidad en un look juvenil.',
    fullDescription:
      'Un semirrecogido que combina ondas suaves con una sujeción delicada. Se personaliza para integrar accesorios y acompañar el estilo general del evento.',
    image: '/images/styles/quince-semirrecogido.svg',
    imageAlt: 'Referencia visual provisional para un semirrecogido con ondas',
    tags: ['quinceañera', 'semirrecogido', 'ondas'],
    featured: false,
    order: 15,
    active: true,
  },
]

export const activeStyles = styles
  .filter((style) => style.active)
  .sort((first, second) => first.order - second.order)

export const featuredStyles = activeStyles.filter((style) => style.featured)

export function findStyleBySlug(slug: string) {
  return activeStyles.find((style) => style.slug === slug)
}

export function findStyleById(id: string) {
  return activeStyles.find((style) => style.id === id)
}
