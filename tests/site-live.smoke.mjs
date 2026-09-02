import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const siteUrl = process.env.SITE_URL;
assert.ok(siteUrl, "SITE_URL is required");

async function fetchPage(pathname) {
  const response = await fetch(new URL(pathname, siteUrl));
  const body = await response.text();

  assert.equal(
    response.status,
    200,
    `${pathname} returned ${response.status}: ${body.slice(0, 200)}`,
  );
  return body;
}

test("production serves every route in the built sitemap", async () => {
  const builtSitemap = await readFile("build/client/sitemap.xml", "utf8");
  const routes = [...builtSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(routes.length > 0, "built sitemap has no routes");

  const pages = new Map(
    await Promise.all(
      routes.map(async (route) => [new URL(route).pathname, await fetchPage(route)]),
    ),
  );

  assert.match(pages.get("/"), /Windsor Nguyen/);
  assert.match(pages.get("/blog/first-post"), /wanted to start a blog/);
  assert.match(pages.get("/blog/reflecting-on-2024"), /Get at least/);
  assert.match(pages.get("/blog/one-year-at-dedalus"), /Princeton dorm room/);
});

test("production serves crawler metadata", async () => {
  const [robots, sitemap] = await Promise.all([
    fetchPage("/robots.txt"),
    fetchPage("/sitemap.xml"),
  ]);

  assert.match(robots, /Sitemap: https:\/\/windsornguyen\.com\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/windsornguyen\.com\/blog\/one-year-at-dedalus/);
});
