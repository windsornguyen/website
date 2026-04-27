# windsornguyen.com

Personal site and blog. Statically prerendered with TanStack Start; MDX content, Tailwind v4, Nitro on Vercel.

View counts persist in Supabase through a service-role admin client. Server-only — the browser never sees a Supabase key.

## Run

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # vitest
pnpm check        # lint, format, typecheck, markdownlint
```

`SUPABASE_URL` and `SUPABASE_SECRET_KEY` must be set for the views API. Without them the server throws at module load.

## Layout

- `content/` — MDX prose. `content/blog/*.mdx` are posts (each exports typed metadata via `definePost`); `bio.mdx` and `research.mdx` back the tabs of the same name.
- `src/routes/` — TanStack file-based routes. `/api/views/$slug` is the only thing touching Supabase.
- `src/lib/` — `views.ts` is client-safe (formatting + static fallback for prerender); `views-server.ts` and `supabase.ts` are server-only.
- `supabase/` — declarative schema, migrations, seed. RLS is on but is not the auth boundary; mutations are denied for anon and bypassed by the service-role client.
- `scripts/` — `pnpm site` for post CRUD, `pnpm db` wraps the Supabase CLI, `pnpm llms` regenerates `/llms.txt` and per-post `.md` mirrors.

Repo-wide conventions (MDX shape, design tokens, env files, CSS specificity) live in `AGENTS.md`.

## License

MIT.
