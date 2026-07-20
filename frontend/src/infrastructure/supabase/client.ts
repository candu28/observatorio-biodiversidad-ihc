import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// The frontend client uses the anon key and manages the session automatically
export const supabase = createClient(supabaseUrl, supabaseAnonKey);