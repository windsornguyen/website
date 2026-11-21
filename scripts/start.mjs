#!/usr/bin/env node
// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const indexPath = "build/client/index.html";

if (!existsSync(indexPath)) {
  throw new Error(`Missing ${indexPath}. Run "pnpm build" before "pnpm start".`);
}

const host = process.env.HOST ?? "127.0.0.1";
const port = process.env.PORT ?? "3000";

const server = spawn("wrangler", ["dev", "--local", "--ip", host, "--port", port], {
  env: process.env,
  stdio: "inherit",
});

server.on("error", (cause) => {
  throw cause;
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.exit(0);
    return;
  }

  process.exit(code ?? 0);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.kill(signal);
  });
}
