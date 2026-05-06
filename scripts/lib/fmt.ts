// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * CLI output formatting helpers. Dev-only — not bundled in the site build.
 */

import pc from "picocolors";

export { pc };

const ansiEscapePattern = new RegExp(String.raw`\x1b\[[0-9;]*m`, "g");

export function heading(text: string) {
  console.log(`\n${pc.bold(text)}\n`);
}

export function success(text: string) {
  console.log(`${pc.green("✓")} ${text}`);
}

export function error(text: string) {
  console.error(`${pc.red("✗")} ${text}`);
}

export function info(text: string) {
  console.log(`${pc.dim("→")} ${text}`);
}

export function table(rows: string[][], headers?: string[]) {
  const cols = (headers ?? rows[0]).length;
  const widths = Array.from({ length: cols }, () => 0);

  const allRows = headers ? [headers, ...rows] : rows;

  for (const row of allRows) {
    for (let i = 0; i < cols; i++) {
      widths[i] = Math.max(widths[i], stripAnsi(row[i] ?? "").length);
    }
  }

  function pad(str: string, width: number) {
    return str + " ".repeat(Math.max(0, width - stripAnsi(str).length));
  }

  function formatRow(row: string[]) {
    return row.map((cell, i) => pad(cell, widths[i])).join("  ");
  }

  if (headers) {
    console.log(pc.dim(formatRow(headers)));
    console.log(pc.dim(widths.map((w) => "─".repeat(w)).join("  ")));
  }

  for (const row of rows) {
    console.log(formatRow(row));
  }
}

function stripAnsi(str: string): string {
  return str.replace(ansiEscapePattern, "");
}
