import { createClient } from "@supabase/supabase-js";

// Client pubblico — per uso futuro lato client se necessario
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Client admin — per tutte le operazioni nelle API routes
// Bypassa RLS — mai esporre lato client
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
