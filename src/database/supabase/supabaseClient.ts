
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.PUBLIC_SUPABASE_URL || '', process.env.PUBLIC_SUPABASE_ANON_KEY || '');