import { describe, expect, it } from "vitest";

import {
  parsePostMetadata,
  renderPostTemplate,
  renderTimestampLabel,
  slugifyTitle,
  validatePostEntries,
} from "../scripts/lib/posts";

describe("posts cli helpers", () => {
  it("slugifies titles into URL-safe slugs", () => {
    expect(slugifyTitle("  Hello, CUDA World!  ")).toBe("hello-cuda-world");
  });

  it("parses metadata fields from an mdx source string", () => {
    const metadata = parsePostMetadata(`export const postMetadata = {
  slug: "first-post",
  title: "first post",
  description: "blah.",
  canonical: "/blog/first-post",
  publishedAt: "2024-11-09T14:20:00-05:00",
};`);

    expect(metadata.slug).toBe("first-post");
    expect(metadata.canonical).toBe("/blog/first-post");
  });

  it("renders a usable starter post template", () => {
    const template = renderPostTemplate({
      slug: "new-post",
      title: "new post",
      description: "TODO.",
      canonical: "/blog/new-post",
      publishedAt: "2026-03-21T00:00:00.000Z",
    });

    expect(template).toContain("# new post");
    expect(template).toContain('canonical: "/blog/new-post"');
  });

  it("renders a human-readable timestamp label", () => {
    expect(renderTimestampLabel("2026-03-21T00:00:00.000Z")).toContain("2026");
  });

  it("reports bad canonicals and duplicate slugs", () => {
    const errors = validatePostEntries([
      {
        slug: "first-post",
        title: "first post",
        description: "blah.",
        canonical: "/blog/wrong",
        publishedAt: "2024-11-09T14:20:00-05:00",
        path: "content/blog/first-post.mdx",
      },
      {
        slug: "first-post",
        title: "duplicate",
        description: "duplicate",
        canonical: "/blog/first-post",
        publishedAt: "2024-11-10T14:20:00-05:00",
        path: "content/blog/duplicate.mdx",
      },
    ]);

    expect(errors).toEqual([
      'content/blog/first-post.mdx: canonical must be "/blog/first-post", got "/blog/wrong"',
      'content/blog/duplicate.mdx: duplicate slug "first-post"',
    ]);
  });
});
