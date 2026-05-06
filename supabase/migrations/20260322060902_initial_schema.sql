-- Extensions required by the application.

create extension if not exists "pgcrypto" with schema "extensions";
-- Tracks view counts per blog post slug.
-- One row per slug, incremented atomically via the RPC function.

create table if not exists public.page_views (
  slug text primary key,
  count bigint not null default 0,
  updated_at timestamptz not null default now()
);

comment on table public.page_views is 'Per-post view counts, keyed by blog slug.';
-- Atomically increments the view count for a slug.
-- Inserts a new row if the slug doesn't exist yet (upsert).

create or replace function public.increment_page_view(page_slug text)
returns bigint
language sql
as $$
  insert into public.page_views (slug, count, updated_at)
  values (page_slug, 1, now())
  on conflict (slug)
  do update set
    count = page_views.count + 1,
    updated_at = now()
  returning count;
$$;
-- RLS is enabled but is not the auth boundary — application routes are.
-- Service-role writes bypass RLS by design. Only a permissive select
-- policy is defined; mutations from anon/authenticated are denied by
-- default (no insert/update/delete policy = no access).

alter table public.page_views enable row level security;

create policy "page_views_select" on public.page_views
  for select using (true);
