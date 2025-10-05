import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Debug: Uncomment for troubleshooting
// console.log('Supabase URL:', supabaseUrl)
// console.log('Supabase Key exists:', !!supabaseKey)
// console.log('Supabase Key length:', supabaseKey?.length)

// For development, allow the backend to work without Supabase configuration
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export const isSupabaseConfigured = () => Boolean(supabase)