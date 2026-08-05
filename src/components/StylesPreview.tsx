import { siteContent } from '../data/siteContent'

export function StylesPreview() {
  return (
    <section className="styles-preview section" id="estilos" aria-labelledby="styles-title">
      <div className="container">
        <div className="section-heading styles-preview__heading">
          <p className="eyebrow">Inspiración Marilyn</p>
          <h2 id="styles-title">Estilos que hablan de vos</h2>
          <p>
            Una primera mirada a las experiencias que formarán parte de nuestro próximo catálogo.
          </p>
        </div>

        <div className="styles-grid">
          {siteContent.styles.map((style, index) => (
            <article className="style-card" key={style.category}>
              <div className={`style-card__visual ${style.visualClass}`} aria-hidden="true">
                <span>0{index + 1}</span>
              </div>
              <div className="style-card__body">
                <p>{style.category}</p>
                <h3>{style.title}</h3>
                <span>{style.description}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="styles-preview__footer">
          <a className="button button--outline" href="#estilos" aria-label="Ver todos los estilos próximamente">
            Ver todos los estilos
          </a>
          <span>Catálogo completo disponible en la próxima etapa</span>
        </div>
      </div>
    </section>
  )
}
