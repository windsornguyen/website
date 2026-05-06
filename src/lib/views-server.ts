// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Blog post view counts — server-only data path.
 *
 * Reads and writes against the page_views table via the admin client.
 * Throws on Supabase failure rather than silently returning stale numbers
 * (per AGENTS.md: never silently fail or fallback on the data layer).
 */

import type { BlogSlug } from "../../content/schema";
import { getSupabase } from "./supabase";

type PageViewRow = {
  count: number;
};

type ViewCount = number;

export async function getViewCount(slug: BlogSlug): Promise<ViewCount> {
  const { data, error } = await getSupabase()
    .from("page_views")
    .select("count")
    .eq("slug", slug)
    .maybeSingle<PageViewRow>();

  if (error) {
    throw new Error(`Failed to read view count for "${slug}": ${error.message}`);
  }

  return data?.count ?? 0;
}

export async function incrementViewCount(slug: BlogSlug): Promise<ViewCount> {
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
