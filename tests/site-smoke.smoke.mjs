import { execFileSync, spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import assert from "node:assert/strict";

const serverPort = 4310;
const serverUrl = `http://127.0.0.1:${serverPort}`;

let serverProcess;

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(serverUrl);

      if (response.ok) {
        return;
      }
    } catch {}

    await delay(200);
  }

  throw new Error("Timed out waiting for the built site to start.");
}

test.before(async () => {
  execFileSync("pnpm", ["build"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
    stdio: "inherit",
  });

  serverProcess = spawn("node", [".output/server/index.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(serverPort),
    },
    stdio: "ignore",
  });

  serverProcess.unref();

  await waitForServer();
});

test.after(async () => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill("SIGTERM");
    await delay(250);
  }
});

test("homepage renders the personal site content", async () => {
  const html = await fetch(`${serverUrl}/`).then((response) => response.text());

  assert.match(html, /Windsor Nguyen/);
  assert.match(html, /princeton/);
  assert.match(html, /\/blog\/first-post/);
  assert.match(html, /\/blog\/reflecting-on-2024/);
});

test("blog posts render through the dynamic blog route", async () => {
  const firstPostHtml = await fetch(`${serverUrl}/blog/first-post`).then((response) =>
    response.text(),
  );
  const reflectionHtml = await fetch(`${serverUrl}/blog/reflecting-on-2024`).then((response) =>
    response.text(),
  );

  assert.match(firstPostHtml, /first post/);
  assert.match(firstPostHtml, /wanted to start a blog/);
  assert.match(reflectionHtml, /reflecting on 2024/);
  assert.match(reflectionHtml, /Get at least/);
});

test("robots and sitemap are exposed", async () => {
  const robotsText = await fetch(`${serverUrl}/robots.txt`).then((response) => response.text());
  const sitemapXml = await fetch(`${serverUrl}/sitemap.xml`).then((response) => response.text());

  assert.match(robotsText, /Sitemap: https:\/\/windsornguyen\.com\/sitemap\.xml/);
  assert.match(sitemapXml, /https:\/\/windsornguyen\.com\/blog\/first-post/);
  assert.match(sitemapXml, /https:\/\/windsornguyen\.com\/blog\/reflecting-on-2024/);
});
