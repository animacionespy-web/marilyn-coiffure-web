import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const supabaseConfiguration = {
  configured: Boolean(supabaseUrl && supabaseAnonKey),
  message: 'Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. Configuralas en un archivo .env local.',
} as const

let client: SupabaseClient | null = null

if (supabaseConfiguration.configured) {
  client = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
} else if (import.meta.env.DEV) {
  console.info(`[Marilyn Coiffure] ${supabaseConfiguration.message}`)
}

export const supabase = client

export function requireSupabase() {
  if (!supabase) throw new Error(supabaseConfiguration.message)
  return supabase
}
