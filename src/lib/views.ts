// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Blog post view counts — client-safe surface.
 *
 * Static fallbacks for SSG/prerender plus pure formatting helpers.
 * The async, Supabase-backed read/write path lives in views-server.ts
 * and is server-only (it imports the admin client which requires
 * SUPABASE_SECRET_KEY).
 */

const STATIC_VIEWS: Record<string, number> = {
  "reflecting-on-2024": 1_247,
  "first-post": 438,
};

export function getViewCountSync(slug: string): number {
  return STATIC_VIEWS[slug] ?? 0;
}

export function formatViewCount(count: number): string {
  const n =
    count >= 1_000_000
      ? `${(count / 1_000_000).toFixed(1)}M`
      : count >= 1_000
        ? `${(count / 1_000).toFixed(1)}k`
        : count.toLocaleString();

  return `${n} ${count === 1 ? "view" : "views"}`;
}
