// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Supabase admin client.
 *
 * Server-only. Uses the service-role key, so it bypasses RLS by design.
 * All database access goes through this client from server routes; the
 * browser never sees Supabase keys.
 *
 * RLS is enabled on tables but is not the auth boundary — application
 * routes are. Anything touching this module is server-side only.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url) throw new Error("Missing SUPABASE_URL");
if (!key) throw new Error("Missing SUPABASE_SECRET_KEY");

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
