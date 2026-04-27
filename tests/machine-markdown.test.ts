// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { parseField } from "../scripts/lib/llms";
import {
  buildHomeMachineMarkdown,
  buildPostMachineMarkdown,
} from "../src/lib/machine-markdown";

const FIRST_POST_PATH = path.resolve("content/blog/first-post.mdx");

describe("machine markdown builders", () => {
  it("renders the homepage writing index as real markdown links", () => {
    const markdown = buildHomeMachineMarkdown(
      { title: "Windsor Nguyen", siteUrl: "https://windsornguyen.com" },
      [
        {
          slug: "first-post",
          title: "first post",
          description: "hello world.",
          publishedAt: "2024-11-09T14:20:00-05:00",
        },
      ],
    );

    expect(markdown).toContain("# Windsor Nguyen");
    expect(markdown).toContain("## Writing");
    expect(markdown).toContain(
      "- [first post](https://windsornguyen.com/blog/first-post) — hello world. (Nov 9, 2024)",
    );
  });

  it("renders blog machine mode from the actual first-post MDX prose", async () => {
    const rawSource = await readFile(FIRST_POST_PATH, "utf8");

    const markdown = buildPostMachineMarkdown(
      { title: "Windsor Nguyen", siteUrl: "https://windsornguyen.com" },
      {
        slug: parseField("slug", rawSource),
        title: parseField("title", rawSource),
        description: parseField("description", rawSource),
        publishedAt: parseField("publishedAt", rawSource),
        tags: ["personal"],
        rawSource,
      },
    );

    expect(markdown).toContain("# first post");
    expect(markdown).toContain(
      "I've always wanted to start a blog. I think it's a good way to document my thoughts and share ideas with others.",
    );
    expect(markdown).toContain(
      'It\'s surprising difficult to create a blogging website from scratch and even more difficult to write good blog posts.',
    );
    expect(markdown).toContain("*--Windsor*");
    expect(markdown).not.toContain("definePost");
    expect(markdown).not.toMatch(/^import\s+/m);
  });

  it("throws if a published post is missing raw source", () => {
    expect(() =>
      buildPostMachineMarkdown(
        { title: "Windsor Nguyen", siteUrl: "https://windsornguyen.com" },
        {
          slug: "broken-post",
          title: "broken post",
          description: "broken",
          publishedAt: "2024-01-01T00:00:00Z",
          rawSource: "",
        },
      ),
    ).toThrow('Missing rawSource for published post "broken-post"');
  });
});
