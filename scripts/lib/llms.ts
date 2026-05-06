// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Shared helpers for llms.txt generation and its tests.
 */

/** Matches `fieldName: "double-quoted value"` */
const doubleQuoted = (name: string) => new RegExp(`${name}:\\s*"([^"]+)"`);

/** Matches `fieldName: 'single-quoted value'` */
const singleQuoted = (name: string) => new RegExp(`${name}:\\s*'([^']+)'`);

/** Matches `import ... from "...";` lines (with trailing newline) */
const importLine = /^import\s+.*;\s*\n/gm;

/**
 * Matches the entire `export const postMetadata = definePost({ ... });` block.
 * Uses non-greedy [\s\S]*? to stop at the first closing `});`.
 */
const definePostBlock = /export\s+const\s+postMetadata\s*=\s*definePost\(\{[\s\S]*?\}\);?\s*\n*/m;

/** Matches the first markdown H1 heading in a prose document. */
const titleHeading = /^#\s+.*\n*/;

export function parseField(name: string, source: string): string {
  const dq = source.match(doubleQuoted(name));
  if (dq) {
    return dq[1];
  }

  const sq = source.match(singleQuoted(name));
  if (sq) {
    return sq[1];
  }

  throw new Error(`Missing "${name}" in post metadata`);
}

/**
 * Strips JS preamble (imports, definePost export) from an MDX source,
 * leaving only the prose markdown that readers/LLMs care about.
 */
export function stripPreamble(source: string): string {
  return source.replace(importLine, "").replace(definePostBlock, "").trim();
}

export function stripTitleHeading(source: string): string {
  return source.replace(titleHeading, "").trim();
}
