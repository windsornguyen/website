// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { parseField, stripPreamble, stripTitleHeading } from "../scripts/lib/llms";

const BLOG_DIR = path.resolve("content/blog");
const PUBLIC_DIR = path.resolve("public");

// --- Unit tests for the stripping logic ---

describe("stripPreamble", () => {
  it("removes import lines", () => {
    const source = `import { definePost } from "../schema";\n\nHello world.`;
    expect(stripPreamble(source)).toBe("Hello world.");
  });

  it("removes the definePost export block", () => {
    const source = `import { definePost } from "../schema";

export const postMetadata = definePost({
  slug: "test",
  title: "test",
  description: "test",
  publishedAt: "2024-01-01T00:00:00Z",
  status: "published",
});

# My Post

Some content here.`;

    const result = stripPreamble(source);
    expect(result).not.toContain("import");
    expect(result).not.toContain("definePost");
    expect(result).not.toContain("export");
    expect(result).toContain("# My Post");
    expect(result).toContain("Some content here.");
  });

  it("preserves markdown links with apostrophes", () => {
    const source = `import { definePost } from "../schema";

export const postMetadata = definePost({
  slug: "x",
  title: "x",
  description: "it's a test",
  publishedAt: "2024-01-01T00:00:00Z",
  status: "published",
});

Here's a [link](https://example.com) and it's great.`;

    const result = stripPreamble(source);
    expect(result).toContain("Here's a [link](https://example.com) and it's great.");
  });
});

describe("parseField", () => {
  it("parses double-quoted fields", () => {
    expect(parseField("slug", `slug: "my-post"`)).toBe("my-post");
  });

  it("parses fields containing apostrophes in double quotes", () => {
    expect(parseField("description", `description: "it's fine"`)).toBe("it's fine");
  });

  it("throws on missing fields", () => {
    expect(() => parseField("slug", "title: 'hello'")).toThrow('Missing "slug"');
  });
});

// --- Integration tests: generated files match source content ---

describe("llms.txt parity with source MDX", () => {
  it("every published post has a .md file in public/blog/", async () => {
    const mdxFiles = await readdir(BLOG_DIR);
    for (const file of mdxFiles.filter((f) => f.endsWith(".mdx"))) {
      const source = await readFile(path.join(BLOG_DIR, file), "utf8");
      const status = parseField("status", source);
      if (status !== "published") {
        continue;
      }

      const slug = parseField("slug", source);
      const mdPath = path.join(PUBLIC_DIR, "blog", `${slug}.md`);
      const md = await readFile(mdPath, "utf8").catch(() => null);
      expect(md, `Missing .md file for published post "${slug}"`).not.toBeNull();
    }
  });

  it("generated .md files contain the prose from source MDX", async () => {
    const mdxFiles = await readdir(BLOG_DIR);
    for (const file of mdxFiles.filter((f) => f.endsWith(".mdx"))) {
      const source = await readFile(path.join(BLOG_DIR, file), "utf8");
      const status = parseField("status", source);
      if (status !== "published") {
        continue;
      }

      const slug = parseField("slug", source);
      const expectedProse = stripTitleHeading(stripPreamble(source));
      const md = await readFile(path.join(PUBLIC_DIR, "blog", `${slug}.md`), "utf8");

      expect(md, `${slug}.md is missing prose content`).toContain(expectedProse);
    }
  });

  it("generated .md files contain no JS artifacts", async () => {
    const mdFiles = (await readdir(path.join(PUBLIC_DIR, "blog"))).filter((f) => f.endsWith(".md"));

    for (const file of mdFiles) {
      const md = await readFile(path.join(PUBLIC_DIR, "blog", file), "utf8");
      expect(md, `${file} leaks "import"`).not.toMatch(/^import\s+/m);
      expect(md, `${file} leaks "definePost"`).not.toContain("definePost");
      expect(md, `${file} leaks "export const"`).not.toMatch(/^export\s+const/m);
    }
  });

  it("llms.txt lists every published post", async () => {
    const llmsTxt = await readFile(path.join(PUBLIC_DIR, "llms.txt"), "utf8");
    const mdxFiles = await readdir(BLOG_DIR);

    for (const file of mdxFiles.filter((f) => f.endsWith(".mdx"))) {
      const source = await readFile(path.join(BLOG_DIR, file), "utf8");
      const status = parseField("status", source);
      if (status !== "published") {
        continue;
      }

      const slug = parseField("slug", source);
      const title = parseField("title", source);

      expect(llmsTxt, `llms.txt missing entry for "${slug}"`).toContain(slug);
      expect(llmsTxt, `llms.txt missing title "${title}"`).toContain(title);
    }
  });

  it("llms-full.txt contains prose from every published post", async () => {
    const fullTxt = await readFile(path.join(PUBLIC_DIR, "llms-full.txt"), "utf8");
    const mdxFiles = await readdir(BLOG_DIR);

    for (const file of mdxFiles.filter((f) => f.endsWith(".mdx"))) {
      const source = await readFile(path.join(BLOG_DIR, file), "utf8");
      const status = parseField("status", source);
      if (status !== "published") {
        continue;
      }

      const slug = parseField("slug", source);
      const firstProseLine = stripPreamble(source)
        .split("\n")
        .find((l) => l.trim().length > 20);

      expect(fullTxt, `llms-full.txt missing content from "${slug}"`).toContain(firstProseLine);
    }
  });
});
