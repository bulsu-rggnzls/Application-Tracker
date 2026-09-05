import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigError =
  !supabaseUrl || !supabaseAnonKey || supabaseAnonKey.startsWith('PASTE_')
    ? 'Supabase is not configured. Open .env in the project root and paste your full publishable key into VITE_SUPABASE_ANON_KEY, then restart the dev server.'
    : null

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
