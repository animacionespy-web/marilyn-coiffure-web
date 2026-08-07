import type { Style } from '../../types/style'
import { PositionedImage } from '../PositionedImage'

interface SelectedStyleContextProps {
  style: Style
  onContinueWithoutStyle: () => void
}

export function SelectedStyleContext({ style, onContinueWithoutStyle }: SelectedStyleContextProps) {
  return (
    <aside className="professional-style-context" aria-labelledby="professional-style-title">
      <PositionedImage src={style.image} alt="" width="160" height="190" position={style.imagePosition} />
      <div>
        <p className="eyebrow">Tu selección anterior</p>
        <h2 id="professional-style-title">Estilo seleccionado: {style.name}</h2>
        <p>Podés conservar este estilo al elegir una profesional o continuar sin una selección previa.</p>
      </div>
      <div className="professional-style-context__actions">
        <a className="button button--outline" href="/estilos">Cambiar estilo</a>
        <button type="button" className="context-link" onClick={onContinueWithoutStyle}>
          Continuar sin estilo
        </button>
      </div>
    </aside>
  )
}
