// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createSupabaseAdmin, type SupabaseAdminClient } from "./supabase-admin";

let cached: SupabaseAdminClient | null = null;

export function getSupabase(): SupabaseAdminClient {
  if (cached) {
    return cached;
  }

  cached = createSupabaseAdmin(readSupabaseAdminConfig());

  return cached;
}

function readSupabaseAdminConfig() {
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
