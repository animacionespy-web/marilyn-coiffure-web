const specialties = [
  { icon: '◐', title: 'Coloración', description: 'Tonos y técnicas personalizadas.' },
  { icon: '✂', title: 'Cortes', description: 'Formas que acompañan tu estilo.' },
  { icon: '≈', title: 'Peinados', description: 'Acabados elegantes y naturales.' },
  { icon: '✦', title: 'Quinceañeras', description: 'Looks especiales para un gran día.' },
  { icon: '◇', title: 'Tratamientos', description: 'Cuidado, brillo y nutrición.' },
] as const

export function SpecialtyHighlights() {
  return (
    <section className="specialties section" id="servicios" aria-labelledby="specialties-title">
      <div className="container">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Servicios</p>
            <h2 id="specialties-title">Lo esencial para cuidar tu estilo</h2>
          </div>
          <p>Opciones pensadas para realzar y cuidar tu cabello.</p>
        </div>

        <div className="specialty-grid">
          {specialties.map((specialty) => (
            <article className="specialty-card" key={specialty.title}>
              <span className="specialty-card__icon" aria-hidden="true">{specialty.icon}</span>
              <div>
                <h3>{specialty.title}</h3>
                <p>{specialty.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
