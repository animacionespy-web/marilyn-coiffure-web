import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { VisualHomeEditor } from '../components/VisualHomeEditor'

export function AdminContentPage() {
  useDocumentMeta('Contenido del sitio | Administración Marilyn Coiffure', 'Edición privada del contenido público.')
  return <VisualHomeEditor />
}
