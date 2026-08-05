export const siteContent = {
  brand: 'Marilyn Coiffure',
  navigation: [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Estilos', href: '#estilos' },
    { label: 'Profesionales', href: '#salon' },
    { label: 'Contacto', href: '#contacto' },
  ],
  actions: {
    availability: { label: 'Consultar disponibilidad', href: '#contacto' },
    styles: { label: 'Ver estilos', href: '#estilos' },
  },
  hero: {
    eyebrow: 'Belleza · cuidado · estilo',
    title: 'Realzá tu belleza con un estilo único',
    description:
      'Coloración, peinados y cuidado capilar pensados para acompañar tu esencia con atención dedicada y resultados que se sienten propios.',
    imagePlaceholder: 'Espacio reservado para la fotografía de la dueña',
  },
  specialties: [
    {
      number: '01',
      title: 'Coloración',
      description: 'Tonos y matices pensados para iluminar tu estilo.',
    },
    {
      number: '02',
      title: 'Peinados',
      description: 'Acabados elegantes para cada momento especial.',
    },
    {
      number: '03',
      title: 'Quinceañeras',
      description: 'Una preparación cuidada para un día inolvidable.',
    },
    {
      number: '04',
      title: 'Asesoría personalizada',
      description: 'Escucha, criterio y una propuesta creada para vos.',
    },
  ],
  styles: [
    {
      category: 'Cortes',
      title: 'Movimiento natural',
      description: 'Formas que acompañan tus facciones y tu rutina.',
      visualClass: 'style-card__visual--cut',
    },
    {
      category: 'Coloración',
      title: 'Luz y dimensión',
      description: 'Matices armoniosos con terminaciones cuidadas.',
      visualClass: 'style-card__visual--color',
    },
    {
      category: 'Peinados',
      title: 'Elegancia atemporal',
      description: 'Texturas y recogidos para ocasiones especiales.',
      visualClass: 'style-card__visual--style',
    },
  ],
  about: {
    eyebrow: 'Una experiencia personal',
    title: 'Tu cabello, tu momento, tu mejor versión',
    paragraphs: [
      'En Marilyn Coiffure cada atención comienza con una conversación. Buscamos comprender lo que te gusta, cómo vivís tu cabello y qué resultado querés sentir.',
      'La belleza y el cuidado capilar se encuentran en un ambiente sereno, con una propuesta cercana, profesional y pensada alrededor de vos.',
    ],
    qualities: ['Atención dedicada', 'Cuidado en cada detalle', 'Estilo con identidad'],
  },
  contact: {
    title: '¿Lista para encontrar tu próximo estilo?',
    description:
      'Contanos qué tenés en mente y consultá los horarios disponibles para tu atención.',
    disclaimer: 'La solicitud está sujeta a confirmación por WhatsApp.',
    provisional: 'Datos de contacto a confirmar',
  },
  socialLinks: [
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'WhatsApp', href: '#' },
  ],
} as const
