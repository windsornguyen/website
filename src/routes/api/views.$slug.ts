// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createFileRoute } from "@tanstack/react-router";

import { getViewCount, incrementViewCount } from "@/src/lib/views";

export const Route = createFileRoute("/api/views/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const count = getViewCount(params.slug);
        return Response.json({ slug: params.slug, views: count });
      },

      POST: async ({ params }) => {
        const count = incrementViewCount(params.slug);
        return Response.json({ slug: params.slug, views: count });
      },
    },
  },
});
