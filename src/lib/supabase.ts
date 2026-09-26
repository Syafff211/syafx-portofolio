import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Mengecek apakah konfigurasi Supabase tersedia.
 *
 * Tidak melakukan throw agar aplikasi tetap bisa menjalankan
 * halaman development ketika environment variable belum tersedia.
 */
export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabasePublishableKey);

let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabase = createClient(
    supabaseUrl as string,
    supabasePublishableKey as string
  );
}

export { supabase };
