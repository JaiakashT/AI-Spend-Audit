// ============================================================
// Supabase browser client (uses anon key)
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Missing env vars — using mock client');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = getClient();
