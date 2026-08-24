import { useEffect, useMemo, useState } from 'react'
import { AvailabilityForm } from '../components/consultation/AvailabilityForm'
import { ConsultationHero } from '../components/consultation/ConsultationHero'
import { MessagePreview } from '../components/consultation/MessagePreview'
import { MissingWhatsappNotice } from '../components/consultation/MissingWhatsappNotice'
import { SelectionSummary } from '../components/consultation/SelectionSummary'
import { usePublicContent } from '../hooks/usePublicContent'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { ConsultationFormData, ConsultationSelection } from '../types/consultation'
import type { Professional } from '../types/professional'
import type { Style } from '../types/style'
import {
  buildWhatsappMessage,
  buildWhatsappUrl,
  emptyConsultationForm,
  getTodayIsoDate,
  resolveWhatsappRecipient,
  validateConsultationForm,
} from '../utils/consultation'
import { clearConsultationDraft, getConsultationDraft, saveConsultationDraft } from '../utils/consultationDraft'
import { getProfessionalSelection } from '../utils/professionalSelection'
import { getSelectedStyleId } from '../utils/styleSelection'

function getConsultationSelection(styles: Style[], professionals: Professional[]): ConsultationSelection {
  const params = new URLSearchParams(window.location.search)
  const styleSlug = params.get('estilo')
  const professionalSlug = params.get('profesional')
  const storedStyleId = getSelectedStyleId()
  const storedProfessionalSelection = getProfessionalSelection()
  const style = styleSlug
    ? styles.find((style) => style.slug === styleSlug)
    : storedStyleId
      ? styles.find((style) => style.id === storedStyleId)
      : undefined

  if (professionalSlug === 'cualquiera') return { style, anyProfessional: true }
  if (professionalSlug) {
    const professional = professionals.find((professional) => professional.slug === professionalSlug)
    return professional ? { style, professional, anyProfessional: false } : { style, anyProfessional: true }
  }
  if (storedProfessionalSelection?.mode === 'specific' && storedProfessionalSelection.professionalId) {
    const professional = professionals.find((professional) => professional.id === storedProfessionalSelection.professionalId)
    if (professional) return { style, professional, anyProfessional: false }
  }
  return { style, anyProfessional: true }
}

export function ConsultationPage() {
  const { styles, professionals, settings } = usePublicContent()
  const selection = useMemo(() => getConsultationSelection(styles, professionals), [professionals, styles])
  const [form, setForm] = useState<ConsultationFormData>(getConsultationDraft)
  const [statusMessage, setStatusMessage] = useState('')
  const today = getTodayIsoDate()

  useDocumentMeta(
    'Consultar disponibilidad | Marilyn Coiffure',
    'Elegí el día y horario deseados y enviá una consulta de disponibilidad por WhatsApp a Marilyn Coiffure.',
    '/consulta',
  )

  useEffect(() => saveConsultationDraft(form), [form])

  const errors = useMemo(() => validateConsultationForm(form, today), [form, today])
  const recipient = useMemo(
    () => resolveWhatsappRecipient(selection.professional, selection.anyProfessional, settings.generalWhatsappNumber),
    [selection, settings.generalWhatsappNumber],
  )
  const message = useMemo(() => buildWhatsappMessage(form, selection), [form, selection])
  const whatsappUrl = useMemo(() => buildWhatsappUrl(recipient.number, message), [message, recipient.number])

  const updateField = <Key extends keyof ConsultationFormData>(
    field: Key,
    value: ConsultationFormData[Key],
  ) => {
    setStatusMessage('')
    setForm((current) => ({ ...current, [field]: value }))
  }

  const clearForm = () => {
    clearConsultationDraft()
    setForm({ ...emptyConsultationForm })
    setStatusMessage('Formulario limpio.')
  }

  const submit = () => {
    if (Object.keys(validateConsultationForm(form, today)).length > 0 || !whatsappUrl) return
    const openedWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    if (openedWindow) {
      openedWindow.opener = null
      setStatusMessage('Se abrió WhatsApp para enviar tu consulta.')
    } else {
      setStatusMessage('No pudimos abrir WhatsApp. Revisá si el navegador bloqueó la nueva pestaña.')
    }
  }

  return (
    <main id="contenido-principal">
      <ConsultationHero />
      <section className="consultation-content section" aria-label="Formulario de consulta de disponibilidad">
        <div className="container">
          <SelectionSummary selection={selection} />
          {recipient.source === 'missing' && <MissingWhatsappNotice />}
          <div className="consultation-layout">
            <AvailabilityForm
              form={form}
              errors={errors}
              minDate={today}
              recipientMissing={recipient.source === 'missing'}
              statusMessage={statusMessage}
              onChange={updateField}
              onClear={clearForm}
              onSubmit={submit}
            />
            <MessagePreview message={message} recipient={recipient} />
          </div>
        </div>
      </section>
    </main>
  )
}
