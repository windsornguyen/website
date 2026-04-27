-- RLS is enabled but is not the auth boundary — application routes are.
-- All writes go through API routes using the service-role client, which
-- bypasses RLS by design. We keep RLS on with a select-only policy so
-- direct anon access (with the publishable key, if it leaks) can still
-- read public stats but cannot mutate.

alter table public.page_views enable row level security;

-- Public reads (view counts are not sensitive).
create policy "page_views_select" on public.page_views
  for select using (true);
