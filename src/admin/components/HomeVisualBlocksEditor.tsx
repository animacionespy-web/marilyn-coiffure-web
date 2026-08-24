import { PositionedImage } from '../../components/PositionedImage'
import { DEFAULT_IMAGE_POSITION } from '../../types/image'
import type { HomeVisualBlock } from '../../types/admin'
import { ImagePositionEditor } from './ImagePositionEditor'
import { ImageUploadField } from './ImageUploadField'

const blockLabels: Record<HomeVisualBlock['id'], string> = {
  color: 'Color & Transformaciones',
  cuts: 'Cortes & Styling',
  treatments: 'Tratamientos & Salud capilar',
  events: 'Novias & Eventos',
}

export function HomeVisualBlocksEditor({ blocks, onChange, onRetirePath }: {
  blocks: HomeVisualBlock[]
  onChange: (blocks: HomeVisualBlock[]) => void
  onRetirePath: (path: string) => void
}) {
  const updateBlock = (id: HomeVisualBlock['id'], patch: Partial<HomeVisualBlock>) => {
    onChange(blocks.map((block) => block.id === id ? { ...block, ...patch } : block))
  }

  return (
    <section className="admin-home-blocks" aria-labelledby="home-blocks-title">
      <div className="admin-home-blocks__heading">
        <p className="eyebrow">Servicios de la Home</p>
        <h2 id="home-blocks-title">Bloques visuales principales</h2>
        <p>Cada panel reproduce la imagen y los textos que verán las clientas en la portada.</p>
      </div>

      <div className="admin-home-blocks__grid">
        {blocks.map((block) => (
          <article className="admin-home-block" key={block.id}>
            <header><span>Bloque público</span><h3>{blockLabels[block.id]}</h3></header>
            <div className="admin-home-block__preview">
              {block.imageUrl ? <PositionedImage src={block.imageUrl} alt={`Vista previa de ${block.title}`} position={block.imagePosition} /> : <span>Imagen pendiente</span>}
              <div><small>{block.eyebrow}</small><strong>{block.title}</strong><p>{block.text}</p></div>
            </div>
            <div className="admin-home-block__fields">
              <label>Etiqueta breve<input maxLength={30} value={block.eyebrow} onChange={(event) => updateBlock(block.id, { eyebrow: event.target.value })} /></label>
              <label>Título<input maxLength={80} value={block.title} onChange={(event) => updateBlock(block.id, { title: event.target.value })} /></label>
              <label>Texto<textarea rows={3} maxLength={220} value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} /></label>
            </div>
            <ImageUploadField folder="home" label={`Imagen de ${blockLabels[block.id]}`} imageUrl={block.imageUrl} imagePosition={block.imagePosition} onUploaded={(result) => {
              if (block.imagePath) onRetirePath(block.imagePath)
              updateBlock(block.id, { imageUrl: result.publicUrl, imagePath: result.path, imagePosition: { ...DEFAULT_IMAGE_POSITION } })
            }} />
            <ImagePositionEditor usage="home-block" imageUrl={block.imageUrl} imageAlt={`Vista previa de ${block.title}`} value={block.imagePosition} title={block.title} category={block.eyebrow} description={block.text} onSave={(imagePosition) => updateBlock(block.id, { imagePosition })} />
          </article>
        ))}
      </div>
    </section>
  )
}
