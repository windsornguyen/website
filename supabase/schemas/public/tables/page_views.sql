-- Tracks view counts per blog post slug.
-- One row per slug, incremented atomically via the RPC function.

create table if not exists public.page_views (
  slug text primary key,
  count bigint not null default 0,
  updated_at timestamptz not null default now()
);

comment on table public.page_views is 'Per-post view counts, keyed by blog slug.';
