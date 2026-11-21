// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabaseAdminConfig = {
  url: string;
  secretKey: string;
};

export type SupabaseAdminClient = SupabaseClient;

export function createSupabaseAdmin(config: SupabaseAdminConfig): SupabaseAdminClient {
  if (!config.url) {
    throw new Error("Missing SUPABASE_URL");
  }

  if (!config.secretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY");
  }

  return createClient(config.url, config.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
