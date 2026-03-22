# Agent Guidelines

## MDX Etiquette

- **Blog content is immutable.** Never edit blog post MDX files unless explicitly asked.
  They reflect the author's voice at the time of writing.
- **Keep MDX pure.** React logic belongs in components, not inline in MDX. MDX files
  should read like markdown with occasional component imports.

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
