// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { describe, expect, it } from "vitest";

import { assertBlogSlug } from "../content/schema";
import { slugifyTitle, validatePostEntries } from "../scripts/lib/posts";

describe("slugifyTitle", () => {
  it("lowercases and replaces non-alphanumeric runs with hyphens", () => {
    expect(slugifyTitle("  Hello, CUDA World!  ")).toBe("hello-cuda-world");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugifyTitle("--already-slugged--")).toBe("already-slugged");
  });

  it("rejects invalid slugs at the content boundary", () => {
    expect(() => assertBlogSlug("Not A Slug")).toThrow("Invalid blog slug");
  });
});

describe("validatePostEntries", () => {
  it("rejects duplicate slugs", () => {
    const errors = validatePostEntries([
      {
        slug: assertBlogSlug("a"),
        title: "",
        description: "",
        publishedAt: "2024-01-01T00:00:00Z",
        status: "published",
        path: "a.mdx",
      },
      {
        slug: assertBlogSlug("a"),
        title: "",
        description: "",
        publishedAt: "2024-01-02T00:00:00Z",
        status: "published",
        path: "b.mdx",
      },
    ]);

    expect(errors).toContainEqual(expect.stringContaining('duplicate slug "a"'));
  });

  it("rejects invalid publishedAt timestamps", () => {
    const errors = validatePostEntries([
      {
        slug: assertBlogSlug("bad-date"),
        title: "",
        description: "",
        publishedAt: "not-a-date",
        status: "published",
        path: "c.mdx",
      },
    ]);

    expect(errors).toContainEqual(expect.stringContaining("publishedAt"));
  });

  it("passes for valid entries", () => {
    const errors = validatePostEntries([
      {
        slug: assertBlogSlug("ok"),
        title: "ok",
        description: "ok",
        publishedAt: "2024-01-01T00:00:00Z",
        status: "published",
        path: "ok.mdx",
      },
    ]);

    expect(errors).toEqual([]);
  });
});
