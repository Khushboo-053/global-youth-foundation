import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Force local mode for consistent deletes. Supabase integration is throwing silent RLS errors because
// the front-end is using the local dummy admin login instead of an authenticated token for Supabase.
export const isSupabaseConfigured = false;
export const supabase: SupabaseClient | null = null;
