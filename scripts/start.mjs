#!/usr/bin/env node
// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const manifestPath = ".vercel/react-router-build-result.json";

if (!existsSync(manifestPath)) {
  throw new Error(`Missing ${manifestPath}. Run "pnpm build" before "pnpm start".`);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const serverBundles = Object.values(manifest.buildManifest?.serverBundles ?? {});

if (serverBundles.length !== 1) {
  throw new Error(
    `Expected exactly one React Router server bundle, found ${serverBundles.length}.`,
  );
}

const [serverBundle] = serverBundles;

if (serverBundle.config?.runtime !== "nodejs") {
  throw new Error(`Expected a nodejs server bundle, found "${serverBundle.config?.runtime}".`);
}

if (!existsSync(serverBundle.file)) {
  throw new Error(`React Router server bundle does not exist: ${serverBundle.file}`);
}

const server = spawn("react-router-serve", [serverBundle.file], {
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
