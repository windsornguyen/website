-- Seed data for local development.

insert into public.page_views (slug, count) values
  ('reflecting-on-2024', 1247),
  ('first-post', 438)
on conflict (slug) do update set count = excluded.count;
