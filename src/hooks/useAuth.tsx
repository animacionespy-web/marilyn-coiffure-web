import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, supabaseConfiguration } from '../lib/supabase'
import type { AuthState, Profile } from '../types/admin'

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const initialState: AuthState = {
  loading: true,
  authenticated: false,
  authorized: false,
  profile: null,
  message: '',
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function resolveProfile(session: Session | null): Promise<AuthState> {
  if (!session || !supabase) return { ...initialState, loading: false }
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, created_at, updated_at')
    .eq('id', session.user.id)
    .maybeSingle()
  if (error) {
    if (import.meta.env.DEV) console.error('[Marilyn Coiffure] No se pudo validar el perfil', error)
    return {
      loading: false,
      authenticated: true,
      authorized: false,
      profile: null,
      message: 'No pudimos verificar tus permisos. Intentá nuevamente.',
    }
  }
  if (!data || data.role !== 'admin') {
    return {
      loading: false,
      authenticated: true,
      authorized: false,
      profile: null,
      message: 'Esta cuenta no tiene permisos de administración.',
    }
  }
  const profile: Profile = {
    id: data.id,
    email: data.email ?? session.user.email ?? '',
    role: 'admin',
    fullName: data.full_name ?? '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
  return { loading: false, authenticated: true, authorized: true, profile, message: '' }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)

  useEffect(() => {
    let active = true
    if (!supabase) {
      setState({ ...initialState, loading: false, message: supabaseConfiguration.message })
      return
    }
    supabase.auth.getSession().then(({ data }) => resolveProfile(data.session)).then((next) => {
      if (active) setState(next)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((current) => ({ ...current, loading: true }))
      window.setTimeout(() => resolveProfile(session).then((next) => {
        if (active) setState(next)
      }), 0)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    signIn: async (email, password) => {
      if (!supabase) throw new Error(supabaseConfiguration.message)
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw new Error('Correo o contraseña incorrectos.')
    },
    signOut: async () => {
      if (!supabase) return
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error('No pudimos cerrar la sesión. Intentá nuevamente.')
      window.location.assign('/admin/login')
    },
  }), [state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.')
  return context
}
