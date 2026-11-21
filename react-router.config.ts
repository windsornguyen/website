// Copyright (c) 2026 Windsor Nguyen. MIT License.

import type { Config } from "@react-router/dev/config";

import { readPostEntries } from "./scripts/lib/posts";

async function prerenderPaths() {
  const posts = await readPostEntries();
  const blogPaths = posts
    .filter((post) => post.status === "published")
    .map((post) => `/blog/${post.slug}`);

  return ["/", "/robots.txt", "/sitemap.xml", ...blogPaths];
}

export default {
  prerender: {
    paths: prerenderPaths,
    concurrency: 4,
  },
  routeDiscovery: { mode: "initial" },
  ssr: true,
} satisfies Config;
