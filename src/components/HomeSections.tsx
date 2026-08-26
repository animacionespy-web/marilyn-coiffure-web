import type { ReactNode } from 'react'
import { AboutSection } from './AboutSection'
import { AvailabilityCTA } from './AvailabilityCTA'
import {
  EditorialClosingImage,
  EditorialColorSection,
  EditorialEventsSection,
  EditorialProcessSection,
  EditorialTransformationsSection,
  EditorialTreatmentsSection,
} from './EditorialHomeSections'
import { Hero } from './Hero'
import { LocationSection } from './LocationSection'
import { ProfessionalsPreview } from './ProfessionalsPreview'
import { ProductsPreview } from './ProductsPreview'
import { SpecialtyHighlights } from './SpecialtyHighlights'

export type HomeEditorSectionId =
  | 'hero'
  | 'essence'
  | 'services'
  | 'color'
  | 'process'
  | 'transformations'
  | 'events'
  | 'treatments'
  | 'products'
  | 'professionals'
  | 'closing'
  | 'cta'
  | 'location'
  | 'footer'

export const homeEditorSectionLabels: Record<HomeEditorSectionId, string> = {
  hero: 'Portada',
  essence: 'Nuestra esencia',
  services: 'Servicios principales',
  color: 'Color y diagnóstico',
  process: 'Experiencia Marilyn',
  transformations: 'Antes y después',
  events: 'Novias y eventos',
  treatments: 'Tratamientos',
  products: 'Productos',
  professionals: 'Profesionales',
  closing: 'Imagen editorial final',
  cta: 'Consulta de disponibilidad',
  location: 'Ubicación',
  footer: 'Footer',
}

interface HomeSectionsEditorProps {
  selectedSection?: HomeEditorSectionId | null
  onEditSection?: (section: HomeEditorSectionId) => void
  onEditServiceBlock?: (blockId: string) => void
  onEditProfessional?: (professionalId: string, target: 'profile' | 'works') => void
  onEditProduct?: (productId: string) => void
}

export function AdminVisualSectionToolbar({ id, onEdit }: { id: HomeEditorSectionId; onEdit?: (section: HomeEditorSectionId) => void }) {
  const label = homeEditorSectionLabels[id]
  return (
    <div className="admin-visual-section__toolbar" data-admin-action>
      <span className="admin-visual-section__name">{label}</span>
      <button className="admin-visual-section__edit" type="button" onClick={() => onEdit?.(id)}>
        <span aria-hidden="true">✎</span>
        <span className="admin-visual-section__edit-short">Editar</span>
        <span className="admin-visual-section__edit-long">Editar {label}</span>
      </button>
    </div>
  )
}

function EditableSection({ id, editor, children }: { id: HomeEditorSectionId; editor?: HomeSectionsEditorProps; children: ReactNode }) {
  if (!editor) return <>{children}</>
  const selected = editor.selectedSection === id
  return (
    <div className={`admin-visual-section ${selected ? 'is-selected' : ''}`} data-section={id}>
      <AdminVisualSectionToolbar id={id} onEdit={editor.onEditSection} />
      {children}
    </div>
  )
}

export function HomeSections({ editor }: { editor?: HomeSectionsEditorProps } = {}) {
  return (
    <>
      <EditableSection id="hero" editor={editor}><Hero /></EditableSection>
      <EditableSection id="essence" editor={editor}><AboutSection /></EditableSection>
      <EditableSection id="services" editor={editor}><SpecialtyHighlights editorMode={Boolean(editor)} onEditBlock={editor?.onEditServiceBlock} /></EditableSection>
      <EditableSection id="color" editor={editor}><EditorialColorSection /></EditableSection>
      <EditableSection id="process" editor={editor}><EditorialProcessSection /></EditableSection>
      <EditableSection id="transformations" editor={editor}><EditorialTransformationsSection /></EditableSection>
      <EditableSection id="events" editor={editor}><EditorialEventsSection /></EditableSection>
      <EditableSection id="treatments" editor={editor}><EditorialTreatmentsSection /></EditableSection>
      <EditableSection id="products" editor={editor}><ProductsPreview editorMode={Boolean(editor)} onEditProduct={editor?.onEditProduct} /></EditableSection>
      <EditableSection id="professionals" editor={editor}><ProfessionalsPreview editorMode={Boolean(editor)} onEditProfessional={editor?.onEditProfessional} /></EditableSection>
      <EditableSection id="closing" editor={editor}><EditorialClosingImage /></EditableSection>
      <EditableSection id="cta" editor={editor}><AvailabilityCTA /></EditableSection>
      <EditableSection id="location" editor={editor}><LocationSection /></EditableSection>
    </>
  )
}
