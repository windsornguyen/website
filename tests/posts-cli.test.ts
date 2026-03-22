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
    const metadata = parsePostMetadata(`import { definePost } from "../schema";

export const postMetadata = definePost({
  slug: "first-post",
  title: "first post",
  description: "blah.",
  publishedAt: "2024-11-09T14:20:00-05:00",
  status: "published",
});`);

    expect(metadata.slug).toBe("first-post");
    expect(metadata.status).toBe("published");
  });

  it("renders a starter post template with definePost", () => {
    const template = renderPostTemplate({
      slug: "new-post",
      title: "new post",
      description: "TODO.",
      publishedAt: "2026-03-21T00:00:00.000Z",
      status: "draft",
    });

    expect(template).toContain("definePost");
    expect(template).toContain("# new post");
    expect(template).toContain('status: "draft"');
    expect(template).not.toContain("canonical");
  });

  it("renders a human-readable timestamp label", () => {
    expect(renderTimestampLabel("2026-03-21T00:00:00.000Z")).toContain("2026");
  });

  it("reports duplicate slugs and invalid status", () => {
    const errors = validatePostEntries([
      {
        slug: "first-post",
        title: "first post",
        description: "blah.",
        publishedAt: "2024-11-09T14:20:00-05:00",
        status: "published",
        path: "content/blog/first-post.mdx",
      },
      {
        slug: "first-post",
        title: "duplicate",
        description: "duplicate",
        publishedAt: "2024-11-10T14:20:00-05:00",
        status: "published",
        path: "content/blog/duplicate.mdx",
      },
    ]);

    expect(errors).toEqual([
      'content/blog/duplicate.mdx: duplicate slug "first-post"',
    ]);
  });
});
