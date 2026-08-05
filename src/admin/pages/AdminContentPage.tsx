import { AdminPageHeader } from '../components/AdminPageHeader'
import { SiteSettingsForm } from '../components/SiteSettingsForm'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

export function AdminContentPage() {
  useDocumentMeta('Contenido del sitio | Administración Marilyn Coiffure', 'Edición privada del contenido público.')
  return <><AdminPageHeader eyebrow="Contenido público" title="Contenido del sitio" description="Editá los textos principales y la imagen de portada sin modificar código." /><SiteSettingsForm section="content" /></>
}
