// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { expect, it, vi } from "vitest";

import { meta } from "../app/routes/blog";
import { assertBlogSlug } from "../content/schema";

vi.mock("@/src/lib/content", () => ({ getPostBySlug: vi.fn() }));

it("publishes the loaded post's title and sharing metadata", () => {
  const slug = assertBlogSlug("example-post");
  const pathname = `/blog/${slug}`;
  const loaderData = {
    canonical: pathname,
    description: "A post about systems.",
    publishedAt: "2026-11-21T00:00:00Z",
    slug,
    title: "Example post",
  };
  const metadata = meta({
    loaderData,
    params: { slug },
    location: { pathname, search: "", hash: "", state: null, key: "default" },
    matches: [
      { id: "root", params: {}, pathname: "/", meta: [], loaderData: undefined },
      { id: "routes/blog", params: { slug }, pathname, meta: [], loaderData },
    ],
  });

  expect(metadata).toEqual(
    expect.arrayContaining([
      { title: "Example post | Windsor Nguyen" },
      { name: "description", content: "A post about systems." },
      { property: "og:title", content: "Example post | Windsor Nguyen" },
      { property: "og:description", content: "A post about systems." },
      { property: "og:url", content: `https://windsornguyen.com${pathname}` },
    ]),
  );
});
