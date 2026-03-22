#!/usr/bin/env -S tsx
// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Generates llms.txt, llms-full.txt, and per-post .md files in public/.
 *
 * Run manually:  tsx scripts/generate-llms.ts
 * Or via pnpm:   pnpm llms
 */

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { parseField, stripPreamble } from "./lib/llms";

const SITE_URL = "https://windsornguyen.com";
const BLOG_DIR = path.resolve("content/blog");
const OUT_DIR = path.resolve("public");
const MD_DIR = path.join(OUT_DIR, "blog");

type PostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  status: string;
};

async function readPosts(): Promise<(PostMeta & { markdown: string })[]> {
  const entries = await readdir(BLOG_DIR, { withFileTypes: true });
  const posts = await Promise.all(
    entries
      .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
      .map(async (e) => {
        const source = await readFile(path.join(BLOG_DIR, e.name), "utf8");
        return {
          slug: parseField("slug", source),
          title: parseField("title", source),
          description: parseField("description", source),
          publishedAt: parseField("publishedAt", source),
          status: parseField("status", source),
          markdown: stripPreamble(source),
        };
      }),
  );

  return posts
    .filter((p) => p.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

async function main() {
  const posts = await readPosts();
  await mkdir(MD_DIR, { recursive: true });

  // --- Per-post .md files ---
  for (const post of posts) {
    const md = `# ${post.title}\n\n${post.markdown}\n`;
    await writeFile(path.join(MD_DIR, `${post.slug}.md`), md, "utf8");
  }

  // --- llms.txt (curated index) ---
  const index = [
    "# Windsor Nguyen",
    "",
    "> Personal website and blog of Windsor Nguyen, Co-Founder and CTO of Dedalus Labs.",
    "",
    "## Writing",
    "",
    ...posts.map(
      (p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}.md): ${p.description}`,
    ),
    "",
    "## Links",
    "",
    `- [GitHub](https://github.com/windsornguyen)`,
    `- [Google Scholar](https://scholar.google.com/citations?user=R9DN_W4AAAAJ&hl=en&oi=sra)`,
    `- [LinkedIn](https://www.linkedin.com/in/windsornguyen)`,
    `- [Twitter / X](https://x.com/windsornguyen)`,
    "",
  ].join("\n");

  await writeFile(path.join(OUT_DIR, "llms.txt"), index, "utf8");

  // --- llms-full.txt (all content concatenated) ---
  const full = [
    "# Windsor Nguyen — Full Content",
    "",
    "> Complete blog content for LLM consumption.",
    "",
    ...posts.flatMap((p) => [
      `## ${p.title}`,
      "",
      p.markdown,
      "",
      "---",
      "",
    ]),
  ].join("\n");

  await writeFile(path.join(OUT_DIR, "llms-full.txt"), full, "utf8");

  console.log(`Generated llms.txt, llms-full.txt, and ${posts.length} .md files`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
