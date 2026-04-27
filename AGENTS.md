# Agent Guidelines

## MDX Etiquette

- **Blog content is immutable.** Never edit blog post MDX files unless explicitly asked.
  They reflect the author's voice at the time of writing.
- **Keep MDX pure.** React logic belongs in components, not inline in MDX. MDX files
  should read like markdown with occasional component imports.

### Canonical MDX shape

Every blog post follows the same skeleton:

```mdx
import { definePost } from "../schema";

export const postMetadata = definePost({ ... });

# title

<small>Last updated: ...</small>

prose, in pure markdown.
```

Rules for the prose body:

- Use markdown for everything markdown supports: `*em*`, `**strong**`, `> quote`,
  `` `code` ``, lists, headings, links. Never reach for the raw HTML/JSX equivalents
  (`<em>`, `<strong>`, `<blockquote>`, `<code>`, `<br />`).
- The only HTML primitive allowed in prose is `<small>`, reserved for the metadata
  caption block at the top (and optionally the bottom). It is styled centrally in
  `mdx-components.tsx` — do not hand-wrap its contents in `<em>` for italics.
- The `import` + `definePost(...)` block at the top is the only TypeScript that
  belongs in MDX. Treat it as typed frontmatter, not as prose.

## Content Casing

All non-blog UI text uses standard English capitalization. Blog titles and body text
stay exactly as authored.

## Layout Boundaries

Interactive and content elements must never bleed outside the `max-w-[60ch]` content
column. The outer margin is reserved for future features (sticky notes, comments,
annotations in blog mode).

## Design Tokens

Never inline raw values in `className` strings (for example `text-[#33ff33]` or
`text-[13px]`). Define colors and font sizes as named tokens in the Tailwind theme
config and reference them by semantic name (for example `text-fg`, `text-label`).

## CSS Specificity

Never use `!important`. If you need it, the architecture is wrong. Theme modes
(dark, machine) work by overriding CSS custom properties, not by brute-forcing
specificity. Scope style changes to targeted selectors, not `*` wildcards.

## Consistency

When renaming a value that serves as both a display label and a runtime discriminant,
update every reference site. A partial rename compiles but silently breaks at runtime.
