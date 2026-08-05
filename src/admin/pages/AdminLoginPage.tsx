import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabaseConfiguration } from '../../lib/supabase'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

export function AdminLoginPage() {
  const { authenticated, authorized, loading, signIn, signOut, message } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useDocumentMeta('Acceso administrativo | Marilyn Coiffure', 'Acceso privado para administrar el contenido de Marilyn Coiffure.')

  if (!loading && authorized) {
    window.location.replace('/admin')
    return <div className="admin-login-state" role="status">Ingresando al panel…</div>
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Completá el correo y la contraseña.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await signIn(email, password)
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'No pudimos iniciar sesión.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login" id="contenido-principal">
      <a className="admin-login__brand" href="/">Marilyn Coiffure <small>Belleza &amp; estilo</small></a>
      <section className="admin-login__card" aria-labelledby="admin-login-title">
        <p className="eyebrow">Panel privado</p>
        <h1 id="admin-login-title">Acceso administrativo</h1>
        <p>Esta sección es exclusiva para la administración del sitio.</p>
        {!supabaseConfiguration.configured && (
          <div className="admin-config-notice" role="alert">
            <strong>Supabase todavía no está configurado</strong>
            <p>{supabaseConfiguration.message}</p>
          </div>
        )}
        {authenticated && !authorized ? (
          <div className="admin-config-notice" role="alert">
            <strong>Acceso denegado</strong>
            <p>{message || 'Esta cuenta no tiene el rol admin.'}</p>
            <button className="admin-button admin-button--secondary" type="button" onClick={() => signOut()}>Cerrar sesión</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <label htmlFor="admin-email">Correo electrónico</label>
            <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} disabled={submitting} />
            <label htmlFor="admin-password">Contraseña</label>
            <div className="admin-password-field">
              <input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={submitting} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {error && <p className="admin-field-error" role="alert">{error}</p>}
            <button className="admin-button admin-button--primary" type="submit" disabled={submitting || !supabaseConfiguration.configured}>
              {submitting ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        )}
        <a href="/">← Volver al sitio</a>
      </section>
    </main>
  )
}
