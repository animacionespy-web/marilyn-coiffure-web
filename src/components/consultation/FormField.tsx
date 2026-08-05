import type { ReactNode } from 'react'

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  help?: string
  error?: string
  children: ReactNode
}

export function FormField({ id, label, required = false, help, error, children }: FormFieldProps) {
  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      {children}
      {help && <small className="form-field__help" id={`${id}-help`}>{help}</small>}
      {error && <small className="form-field__error" id={`${id}-error`} role="alert">{error}</small>}
    </div>
  )
}
