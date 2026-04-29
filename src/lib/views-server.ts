// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Blog post view counts — server-only data path.
 *
 * Reads and writes against the page_views table via the admin client.
 * Throws on Supabase failure rather than silently returning stale numbers
 * (per AGENTS.md: never silently fail or fallback on the data layer).
 */

import { getSupabase } from "./supabase";

export async function getViewCount(slug: string): Promise<number> {
  const { data, error } = await getSupabase()
    .from("page_views")
    .select("count")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read view count for "${slug}": ${error.message}`);
  }

  return data?.count ?? 0;
}

export async function incrementViewCount(slug: string): Promise<number> {
  const { data, error } = await getSupabase().rpc("increment_page_view", {
    page_slug: slug,
  });

  if (error || data === null) {
    throw new Error(
      `Failed to increment view count for "${slug}": ${error?.message ?? "no data returned"}`,
    );
  }

  return data;
}
