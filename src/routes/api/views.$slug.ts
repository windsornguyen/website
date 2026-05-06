// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createFileRoute } from "@tanstack/react-router";

import { parseBlogSlug } from "@/content/schema";
import type { BlogSlug } from "@/content/schema";
import { getPostBySlug } from "@/src/lib/content";
import { getViewCount, incrementViewCount } from "@/src/lib/views-server";

export const Route = createFileRoute("/api/views/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slug = parseKnownBlogSlug(params.slug);
        if (!slug) {
          return Response.json({ error: "Unknown blog post" }, { status: 404 });
        }

        const count = await getViewCount(slug);
        return Response.json({ slug, views: count });
      },

      POST: async ({ params }) => {
        const slug = parseKnownBlogSlug(params.slug);
        if (!slug) {
          return Response.json({ error: "Unknown blog post" }, { status: 404 });
        }

        const count = await incrementViewCount(slug);
        return Response.json({ slug, views: count });
      },
    },
  },
});

function parseKnownBlogSlug(value: string): BlogSlug | undefined {
  const slug = parseBlogSlug(value);
  if (!slug) {
    return undefined;
  }

  const post = getPostBySlug(slug);
  if (!post) {
    return undefined;
  }

  return slug;
}
