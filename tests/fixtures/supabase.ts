// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Vitest global setup for the integration project: boots the pinned local
 * Supabase stack, resets it to migrations + seed, and hands tests the keys.
 */

import { spawnSync } from "node:child_process";

import type { TestProject } from "vitest/node";

export type SupabaseFixture = {
  url: string;
  secretKey: string;
  anonKey: string;
};

declare module "vitest" {
  interface ProvidedContext {
    supabase: SupabaseFixture;
  }
}

function supabase(args: string[], stdio: "inherit" | "pipe" = "inherit"): string {
  const result = spawnSync("pnpm", ["exec", "supabase", ...args], { encoding: "utf8", stdio });
  if (result.status !== 0) {
    throw new Error(`supabase ${args.join(" ")} exited ${result.status}\n${result.stderr ?? ""}`);
  }
  return result.stdout ?? "";
}

function statusEnv(): Map<string, string> {
  const entries = supabase(["status", "-o", "env"], "pipe")
    .trim()
    .split("\n")
    .map((line) => line.split("=", 2) as [string, string])
    .map(([key, value]) => [key, value.replace(/^"|"$/g, "")] as const);
  return new Map(entries);
}

function required(env: Map<string, string>, key: string): string {
  const value = env.get(key);
  if (!value) {
    throw new Error(`supabase status did not report ${key}`);
  }
  return value;
}

export default async function setup(project: TestProject): Promise<void> {
  supabase(["start"]);
  supabase(["db", "reset"]);
  const env = statusEnv();
  project.provide("supabase", {
    url: required(env, "API_URL"),
    secretKey: required(env, "SECRET_KEY"),
    anonKey: required(env, "ANON_KEY"),
  });
}
