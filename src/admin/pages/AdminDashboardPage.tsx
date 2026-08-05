import { useEffect, useState } from 'react'
import { AdminError, AdminLoading } from '../components/AdminFeedback'
import { AdminPageHeader } from '../components/AdminPageHeader'
import { dashboardService } from '../../services/content'
import type { DashboardSummary } from '../../types/admin'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

const emptySummary: DashboardSummary = {
  totalStyles: 0,
  activeStyles: 0,
  featuredStyles: 0,
  totalProfessionals: 0,
  activeProfessionals: 0,
  totalCategories: 0,
}

export function AdminDashboardPage() {
  const [summary, setSummary] = useState(emptySummary)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [request, setRequest] = useState(0)
  useDocumentMeta('Resumen administrativo | Marilyn Coiffure', 'Panel privado de Marilyn Coiffure.')

  useEffect(() => {
    setLoading(true)
    setError('')
    dashboardService.getSummary().then(setSummary).catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar el resumen.')
    }).finally(() => setLoading(false))
  }, [request])

  return (
    <>
      <AdminPageHeader eyebrow="Panel administrativo" title="Resumen del contenido" description="Una vista general de lo que está publicado en Marilyn Coiffure." actions={<a className="admin-button admin-button--secondary" href="/" target="_blank" rel="noopener noreferrer">Ver sitio ↗</a>} />
      {loading ? <AdminLoading /> : error ? <AdminError message={error} onRetry={() => setRequest((value) => value + 1)} /> : (
        <>
          <section className="admin-metrics" aria-label="Resumen del contenido">
            {[
              ['Estilos', summary.totalStyles, `${summary.activeStyles} activos`],
              ['Profesionales', summary.totalProfessionals, `${summary.activeProfessionals} activas`],
              ['Categorías', summary.totalCategories, 'organizadas'],
              ['Destacados', summary.featuredStyles, 'en portada'],
            ].map(([label, value, detail]) => (
              <article className="admin-metric-card" key={label}>
                <span>{label}</span><strong>{value}</strong><small>{detail}</small>
              </article>
            ))}
          </section>
          <section className="admin-panel" aria-labelledby="quick-actions-title">
            <div className="admin-panel__heading"><div><p className="eyebrow">Acciones rápidas</p><h2 id="quick-actions-title">¿Qué querés actualizar?</h2></div></div>
            <div className="admin-quick-actions">
              <a href="/admin/estilos?nuevo=1"><span>✦</span><strong>Agregar estilo</strong><small>Servicio, fotografía y profesionales</small></a>
              <a href="/admin/profesionales?nuevo=1"><span>◇</span><strong>Agregar profesional</strong><small>Perfil y número de contacto</small></a>
              <a href="/admin/contenido"><span>¶</span><strong>Editar portada</strong><small>Textos e imagen principal</small></a>
              <a href="/admin/configuracion"><span>↗</span><strong>Configurar WhatsApp</strong><small>Número general del salón</small></a>
            </div>
          </section>
        </>
      )}
    </>
  )
}
