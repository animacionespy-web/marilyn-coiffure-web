import { useState, type FormEvent } from 'react'
import type { ConsultationFormData, ConsultationFormErrors } from '../../types/consultation'
import { FormField } from './FormField'

interface AvailabilityFormProps {
  form: ConsultationFormData
  errors: ConsultationFormErrors
  minDate: string
  recipientMissing: boolean
  statusMessage: string
  onChange: <Key extends keyof ConsultationFormData>(field: Key, value: ConsultationFormData[Key]) => void
  onClear: () => void
  onSubmit: () => void
}

const requiredFields: Array<keyof ConsultationFormData> = [
  'clientName',
  'clientWhatsapp',
  'desiredDate',
  'desiredTime',
]

export function AvailabilityForm({
  form,
  errors,
  minDate,
  recipientMissing,
  statusMessage,
  onChange,
  onClear,
  onSubmit,
}: AvailabilityFormProps) {
  const [touched, setTouched] = useState<Partial<Record<keyof ConsultationFormData, boolean>>>({})
  const [attempted, setAttempted] = useState(false)
  const hasErrors = Object.keys(errors).length > 0
  const disabled = hasErrors || recipientMissing

  const visibleError = (field: keyof ConsultationFormData) =>
    attempted || touched[field] || (form[field] !== '' && Boolean(errors[field])) ? errors[field] : undefined

  const markTouched = (field: keyof ConsultationFormData) => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAttempted(true)
    setTouched(Object.fromEntries(requiredFields.map((field) => [field, true])))
    if (!disabled) onSubmit()
  }

  const clear = () => {
    if (!window.confirm('¿Querés limpiar todos los datos escritos en el formulario?')) return
    setTouched({})
    setAttempted(false)
    onClear()
  }

  return (
    <form className="availability-form" onSubmit={submit} noValidate>
      <div className="availability-form__heading">
        <p className="eyebrow">Tus datos</p>
        <h2>Prepará tu consulta</h2>
        <p>Los campos marcados con * son obligatorios. No se guardarán como una reserva.</p>
      </div>

      <FormField id="client-name" label="Tu nombre" required error={visibleError('clientName')}>
        <input
          id="client-name"
          type="text"
          value={form.clientName}
          placeholder="Escribí tu nombre"
          maxLength={60}
          autoComplete="name"
          aria-invalid={Boolean(visibleError('clientName'))}
          aria-describedby={visibleError('clientName') ? 'client-name-error' : undefined}
          onBlur={() => markTouched('clientName')}
          onChange={(event) => onChange('clientName', event.target.value)}
        />
      </FormField>

      <FormField
        id="client-whatsapp"
        label="Tu número de WhatsApp"
        required
        help="Acepta espacios, guiones y paréntesis. Ej.: 0981 123 456"
        error={visibleError('clientWhatsapp')}
      >
        <input
          id="client-whatsapp"
          type="tel"
          inputMode="tel"
          value={form.clientWhatsapp}
          placeholder="Ej.: 0981 123 456"
          maxLength={24}
          autoComplete="tel"
          aria-invalid={Boolean(visibleError('clientWhatsapp'))}
          aria-describedby={visibleError('clientWhatsapp') ? 'client-whatsapp-help client-whatsapp-error' : 'client-whatsapp-help'}
          onBlur={() => markTouched('clientWhatsapp')}
          onChange={(event) => onChange('clientWhatsapp', event.target.value)}
        />
      </FormField>

      <fieldset className="date-time-fields">
        <legend>Fecha y horario deseados</legend>
        <FormField id="desired-date" label="Fecha deseada" required error={visibleError('desiredDate')}>
          <input
            id="desired-date"
            type="date"
            min={minDate}
            value={form.desiredDate}
            aria-invalid={Boolean(visibleError('desiredDate'))}
            aria-describedby={visibleError('desiredDate') ? 'desired-date-error' : undefined}
            onBlur={() => markTouched('desiredDate')}
            onChange={(event) => onChange('desiredDate', event.target.value)}
          />
        </FormField>
        <FormField
          id="desired-time"
          label="Horario deseado"
          required
          help="Este horario será consultado con la profesional."
          error={visibleError('desiredTime')}
        >
          <input
            id="desired-time"
            type="time"
            value={form.desiredTime}
            aria-invalid={Boolean(visibleError('desiredTime'))}
            aria-describedby={visibleError('desiredTime') ? 'desired-time-help desired-time-error' : 'desired-time-help'}
            onBlur={() => markTouched('desiredTime')}
            onChange={(event) => onChange('desiredTime', event.target.value)}
          />
        </FormField>
      </fieldset>

      <FormField id="hair-length" label="Largo aproximado del cabello" help="No se utilizará para calcular precios automáticamente.">
        <select
          id="hair-length"
          value={form.hairLength}
          aria-describedby="hair-length-help"
          onChange={(event) => onChange('hairLength', event.target.value as ConsultationFormData['hairLength'])}
        >
          <option value="">Seleccionar una opción</option>
          <option value="Corto">Corto</option>
          <option value="Medio">Medio</option>
          <option value="Largo">Largo</option>
          <option value="Muy largo">Muy largo</option>
          <option value="Prefiero explicarlo por WhatsApp">Prefiero explicarlo por WhatsApp</option>
        </select>
      </FormField>

      <FormField id="contact-preference" label="Preferencia de contacto">
        <select
          id="contact-preference"
          value={form.contactPreference}
          onChange={(event) => onChange('contactPreference', event.target.value as ConsultationFormData['contactPreference'])}
        >
          <option value="">Sin preferencia</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Llamada">Llamada</option>
          <option value="Indistinto">Indistinto</option>
        </select>
      </FormField>

      <FormField id="observation" label="Observación" error={visibleError('observation')}>
        <textarea
          id="observation"
          value={form.observation}
          placeholder="Contanos algún detalle importante sobre el servicio que buscás."
          maxLength={300}
          rows={5}
          aria-invalid={Boolean(visibleError('observation'))}
          aria-describedby="observation-counter"
          onBlur={() => markTouched('observation')}
          onChange={(event) => onChange('observation', event.target.value)}
        />
        <small className="character-counter" id="observation-counter">{form.observation.length}/300</small>
      </FormField>

      <div className="availability-form__status" aria-live="polite">
        {recipientMissing
          ? 'Falta configurar el número destinatario del salón.'
          : hasErrors
            ? 'Completá los campos obligatorios para habilitar el envío.'
            : 'El mensaje está listo para revisar y abrir en WhatsApp.'}
        {statusMessage && <strong>{statusMessage}</strong>}
      </div>

      <div className="availability-form__actions">
        <button className="button button--whatsapp" type="submit" disabled={disabled}>
          <span aria-hidden="true">↗</span> Consultar por WhatsApp
        </button>
        <button className="clear-form-button" type="button" onClick={clear}>Limpiar formulario</button>
      </div>
      <p className="form-disclaimer">
        Al continuar, se abrirá WhatsApp con el mensaje preparado. Podrás revisarlo antes de enviarlo.
      </p>
    </form>
  )
}
