import { AdminPageHeader } from '../components/AdminPageHeader'
import { SiteSettingsForm } from '../components/SiteSettingsForm'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

export function AdminSettingsPage() {
  useDocumentMeta('Configuración | Administración Marilyn Coiffure', 'Configuración privada del sitio.')
  return <><AdminPageHeader eyebrow="Configuración general" title="Datos del salón" description="Centralizá contacto, redes, dominio y metadatos SEO." /><SiteSettingsForm section="configuration" /></>
}
