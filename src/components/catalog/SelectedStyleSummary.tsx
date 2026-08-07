import type { Style } from '../../types/style'
import { PositionedImage } from '../PositionedImage'

interface SelectedStyleSummaryProps {
  style: Style
}

export function SelectedStyleSummary({ style }: SelectedStyleSummaryProps) {
  return (
    <section className="selected-style" id="estilo-seleccionado" aria-live="polite" aria-labelledby="selected-style-title">
      <div className="selected-style__image">
        <PositionedImage src={style.image} alt={style.imageAlt} width="640" height="760" position={style.imagePosition} />
      </div>
      <div>
        <p className="eyebrow">Selección guardada temporalmente</p>
        <h2 id="selected-style-title">Elegiste: {style.name}</h2>
        <p>
          En el siguiente paso vas a poder seleccionar una profesional y consultar la disponibilidad del horario deseado.
        </p>
        <div className="selected-style__actions">
          <a className="button button--light" href={`/profesionales?estilo=${style.slug}`}>
            Continuar
          </a>
          <a className="selected-style__link" href={`/estilos/${style.slug}`}>
            Revisar detalles
          </a>
        </div>
      </div>
    </section>
  )
}
