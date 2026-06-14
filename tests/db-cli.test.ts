// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const tsxCli = join(dirname(require.resolve("tsx/package.json")), "dist/cli.mjs");

describe("db cli", () => {
  it("names the missing local Supabase command", () => {
    const emptyPath = mkdtempSync(join(tmpdir(), "website-empty-path-"));
    const result = spawnSync(process.execPath, [tsxCli, "scripts/db.ts", "status"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: { ...process.env, PATH: emptyPath },
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Missing required command: supabase");
  });
});
