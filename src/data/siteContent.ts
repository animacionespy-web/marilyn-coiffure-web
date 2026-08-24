export const siteContent = {
  brand: 'Marilyn Coiffure',
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Esencia', href: '/#esencia' },
    { label: 'Servicios', href: '/#servicios' },
    { label: 'Estilos', href: '/estilos' },
    { label: 'Profesionales', href: '/profesionales' },
    { label: 'Productos', href: '/productos' },
    { label: 'Equipo', href: '/#equipo' },
  ],
  actions: {
    availability: { label: 'Reservar turno', href: '/consulta' },
    styles: { label: 'Ver estilos', href: '/estilos' },
  },
  hero: {
    eyebrow: 'Belleza · cuidado · estilo',
    title: 'Belleza que evoluciona con vos',
    description:
      'El mismo trato cercano de siempre, con técnicas que evolucionan y una mirada profesional para cuidar cada etapa de tu cabello.',
    mobileDescription: 'El mismo trato cercano de siempre, con la técnica de hoy.',
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
  about: {
    eyebrow: 'Nuestra esencia',
    title: 'Un salón que creció con sus clientas.',
    paragraphs: [
      'Empezamos atendiendo a las mamás. Hoy atendemos también a sus hijas, y muchas veces las tres se sientan en la misma sala.',
      'Esa continuidad es lo que nos define: conocemos el cabello de nuestras clientas a lo largo del tiempo, no en una sola visita. Y por eso seguimos formándonos, cambiando técnicas y actualizando lo que hacemos, sin cambiar la forma en la que tratamos a la gente.',
    ],
    qualities: [
      { title: 'Experiencia', description: 'Años de oficio y formación técnica constante.' },
      { title: 'Cercanía', description: 'Te escuchamos antes de tocar tu cabello.' },
      { title: 'Criterio profesional', description: 'Te explicamos qué conviene hacer y cuándo.' },
      { title: 'Evolución', description: 'Técnicas y protocolos que se actualizan.' },
    ],
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
