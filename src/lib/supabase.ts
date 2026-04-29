// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Supabase admin client.
 *
 * Server-only. Uses the service-role key, so it bypasses RLS by design.
 * All database access goes through this client from server routes; the
 * browser never sees Supabase keys.
 *
 * Lazily initialized: env validation happens on first call, not at module
 * load. TanStack Start eagerly imports every route file at server boot, so
 * a module-level throw here would take down the entire dev server even for
 * pages that never touch the database.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url) throw new Error("Missing SUPABASE_URL");
  if (!key) throw new Error("Missing SUPABASE_SECRET_KEY");

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
