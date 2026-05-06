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

type SupabaseAdminConfig = {
  url: string;
  secretKey: string;
};

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cached) {
    return cached;
  }

  const config = readSupabaseAdminConfig();

  cached = createClient(config.url, config.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}

function readSupabaseAdminConfig(): SupabaseAdminConfig {
  const config = {
    url: readRequiredEnv("SUPABASE_URL"),
    secretKey: readRequiredEnv("SUPABASE_SECRET_KEY"),
  };

  return config;
}

function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}
