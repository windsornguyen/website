import { describe, expect, it } from "vitest";

import { getAllPosts, getPostBySlug, siteMetadata } from "../src/content/contentManifest";

describe("content manifest", () => {
  it("exposes the expected site metadata", () => {
    expect(siteMetadata.siteUrl).toBe("https://windsornguyen.com");
    expect(siteMetadata.twitterHandle).toBe("@windsornguyen");
  });

  it("indexes blog posts by slug", () => {
    const firstPost = getPostBySlug("first-post");
    const reflectionPost = getPostBySlug("reflecting-on-2024");

    expect(firstPost?.canonical).toBe("/blog/first-post");
    expect(reflectionPost?.canonical).toBe("/blog/reflecting-on-2024");
  });

  it("returns posts newest-first", () => {
    const posts = getAllPosts();

    expect(posts.map((post) => post.slug)).toEqual(["reflecting-on-2024", "first-post"]);
  });
});
