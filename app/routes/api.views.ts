// Copyright (c) 2026 Windsor Nguyen. MIT License.

import type { Route } from "./+types/api.views";

import { parseBlogSlug } from "@/content/schema";
import type { BlogSlug } from "@/content/schema";
import { getPostBySlug } from "@/src/lib/content";
import { getViewCount, incrementViewCount } from "@/src/lib/views-server";

export async function loader({ params }: Route.LoaderArgs) {
  const slug = parseKnownBlogSlug(params.slug);
  if (!slug) {
    return Response.json({ error: "Unknown blog post" }, { status: 404 });
  }

  const count = await getViewCount(slug);
  return Response.json({ slug, views: count });
}

export async function action({ params, request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { headers: { Allow: "GET, POST" }, status: 405 },
    );
  }

  const slug = parseKnownBlogSlug(params.slug);
  if (!slug) {
    return Response.json({ error: "Unknown blog post" }, { status: 404 });
  }

  const count = await incrementViewCount(slug);
  return Response.json({ slug, views: count });
}

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
