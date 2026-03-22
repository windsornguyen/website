// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Blog post view counts.
 *
 * Currently in-memory mock data. Eventually backed by Vercel KV,
 * Supabase, or a similar persistent store. The API surface stays
 * the same — swap the backing store, not the callers.
 */

const views: Record<string, number> = {
  "reflecting-on-2024": 1_247,
  "first-post": 438,
};

export function getViewCount(slug: string): number {
  return views[slug] ?? 0;
}

export function incrementViewCount(slug: string): number {
  views[slug] = (views[slug] ?? 0) + 1;
  return views[slug];
}

export function getAllViewCounts(): Record<string, number> {
  return { ...views };
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
