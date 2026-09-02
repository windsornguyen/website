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
