#!/usr/bin/env -S tsx
// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { execSync } from "node:child_process";
import { cac } from "cac";

import { error, info, pc, success } from "./lib/fmt";

const cli = cac("db");

function run(cmd: string) {
  execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
}

function dryRun(cmd: string, execute: boolean) {
  if (execute) {
    run(cmd);
  } else {
    info(`Dry run: ${pc.dim(cmd)}`);
    info(`Pass ${pc.bold("--execute")} to apply.`);
  }
}

cli.command("start", "Start local Supabase").action(() => run("supabase start"));
cli.command("stop", "Stop local Supabase").action(() => run("supabase stop"));
cli.command("status", "Show local Supabase status").action(() => run("supabase status"));

cli.command("plan", "List pending migrations").action(() => run("supabase migration list"));

cli
  .command("migrate", "Apply pending migrations to local DB")
  .option("--execute", "Actually apply (dry-run by default)")
  .action((options: { execute?: boolean }) => {
    dryRun("supabase migration up --local", options.execute ?? false);
  });

cli
  .command("reset", "Drop, migrate, and seed the local DB")
  .option("--execute", "Actually reset (dry-run by default)")
  .action((options: { execute?: boolean }) => {
    dryRun("supabase db reset", options.execute ?? false);
  });

cli
  .command("diff", "Generate a migration from declarative schema diff")
  .option("--name <name>", "Migration name (required)")
  .option("--execute", "Write the migration file (dry-run by default)")
  .action((options: { name?: string; execute?: boolean }) => {
    if (!options.name) throw new Error("--name is required");
    if (options.execute) {
      run(`supabase db diff -f ${options.name}`);
      success(`Created migration: ${options.name}`);
    } else {
      info("Schema diff (dry run):");
      run("supabase db diff");
      info(`Pass ${pc.bold("--execute")} to write migration file.`);
    }
  });

cli
  .command("new", "Create an empty migration file")
  .option("--name <name>", "Migration name (required)")
  .action((options: { name?: string }) => {
    if (!options.name) throw new Error("--name is required");
    run(`supabase migration new ${options.name}`);
  });

cli
  .command("seed", "Regenerate seed.sql from seed/ fixtures and apply")
  .option("--execute", "Apply seed to local DB (dry-run by default)")
  .action((options: { execute?: boolean }) => {
    info("Generating seed.sql from fixtures...");
    run("tsx seed/index.ts > supabase/seed.sql");
    success("Wrote supabase/seed.sql");

    if (options.execute) {
      run("supabase db reset");
      success("Seeded local database.");
    } else {
      info(`Pass ${pc.bold("--execute")} to apply seed (resets DB).`);
    }
  });

cli
  .command("types", "Generate TypeScript types from local DB")
  .option("--execute", "Write the types file (dry-run by default)")
  .action((options: { execute?: boolean }) => {
    if (options.execute) {
      info("Generating types from local schema...");
      run("supabase gen types typescript --local > src/lib/database.types.ts");
      info("Running oxlint...");
      run("pnpm exec oxlint --fix src/lib/database.types.ts");
      info("Running oxfmt...");
      run("pnpm exec oxfmt --write src/lib/database.types.ts");
      success("Generated src/lib/database.types.ts");
    } else {
      info("Would generate src/lib/database.types.ts");
      info(`Pass ${pc.bold("--execute")} to write.`);
    }
  });

cli
  .command("push", "Push migrations to a remote Supabase project")
  .option("--env <env>", "Target environment: preview | production (required)")
  .option("--execute", "Actually push (dry-run by default)")
  .action((options: { env?: string; execute?: boolean }) => {
    if (!options.env) throw new Error("--env is required");

    if (options.env === "production" && options.execute) {
      error("Production push requires running supabase db push directly.");
      error("Set SUPABASE_DB_URL and run: supabase db push");
      process.exitCode = 1;
      return;
    }

    dryRun("supabase db push", options.execute ?? false);
  });

cli
  .command("query", "Run SQL against the local database")
  .option("--sql <sql>", "SQL to execute (required)")
  .action((options: { sql?: string }) => {
    if (!options.sql) throw new Error("--sql is required");
    run(`supabase db query "${options.sql}"`);
  });

cli.help();
cli.parse();
