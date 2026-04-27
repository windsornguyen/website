// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Deterministic seed data generator.
 * Outputs SQL that can be piped into supabase/seed.sql.
 *
 * Usage: tsx seed/index.ts > supabase/seed.sql
 */

const POSTS = [
  { slug: "reflecting-on-2024", views: 1_247 },
  { slug: "first-post", views: 438 },
];

function generateSeedSql(): string {
  const lines: string[] = [
    "-- DO NOT EDIT BY HAND. Regenerate: tsx seed/index.ts > supabase/seed.sql",
    "",
  ];

  const values = POSTS.map(
    (post) => `  ('${post.slug}', ${post.views}, now())`,
  ).join(",\n");

  lines.push(
    "insert into public.page_views (slug, count, updated_at) values",
    values,
    "on conflict (slug) do update set count = excluded.count;",
    "",
  );

  return lines.join("\n");
}

console.log(generateSeedSql());
