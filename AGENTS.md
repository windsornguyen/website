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

## Consistency

When renaming a value that serves as both a display label and a runtime discriminant,
update every reference site. A partial rename compiles but silently breaks at runtime.
