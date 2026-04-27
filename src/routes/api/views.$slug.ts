// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createFileRoute } from "@tanstack/react-router";

import { getViewCount, incrementViewCount } from "@/src/lib/views-server";

export const Route = createFileRoute("/api/views/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const count = await getViewCount(params.slug);
        return Response.json({ slug: params.slug, views: count });
      },

      POST: async ({ params }) => {
        const count = await incrementViewCount(params.slug);
        return Response.json({ slug: params.slug, views: count });
      },
    },
  },
});
