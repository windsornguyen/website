// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Blog post view counts — client-safe surface.
 *
 * Static fallbacks for SSG/prerender plus pure formatting helpers.
 * The async, Supabase-backed read/write path lives in views-server.ts
 * and is server-only (it imports the admin client which requires
 * SUPABASE_SECRET_KEY).
 */

import type { BlogSlug } from "../../content/schema";

type ViewCount = number;

const STATIC_VIEWS: Partial<Record<string, ViewCount>> = {
  "reflecting-on-2024": 1_247,
  "first-post": 438,
};

export function getViewCountSync(slug: BlogSlug): ViewCount {
  return STATIC_VIEWS[slug] ?? 0;
}

export function formatViewCount(count: ViewCount): string {
  let formattedCount: string;

  if (count >= 1_000_000) {
    formattedCount = `${(count / 1_000_000).toFixed(1)}M`;
  } else if (count >= 1_000) {
    formattedCount = `${(count / 1_000).toFixed(1)}k`;
  } else {
    formattedCount = count.toLocaleString();
  }

  const noun = count === 1 ? "view" : "views";
  const label = `${formattedCount} ${noun}`;

  return label;
}
