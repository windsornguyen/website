-- Tracks view counts per blog post slug.
-- One row per slug, incremented atomically via the RPC function.

create table if not exists public.page_views (
  slug text primary key,
  count bigint not null default 0,
  updated_at timestamptz not null default now()
);

comment on table public.page_views is 'Per-post view counts, keyed by blog slug.';

-- RLS is enabled but is not the auth boundary — application routes are.
-- All writes go through API routes using the service-role client, which
-- bypasses RLS by design. We keep RLS on with a select-only policy so
-- direct anon access (with the publishable key, if it leaks) can still
-- read public stats but cannot mutate.

alter table public.page_views enable row level security;

-- Public reads (view counts are not sensitive).
create policy "page_views_select" on public.page_views
  for select using (true);
