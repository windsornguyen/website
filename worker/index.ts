// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { parseBlogSlug } from "../content/schema";
import type { BlogSlug } from "../content/schema";
import { isPublishedPostSlug } from "../src/generated/posts";
import { createSupabaseAdmin } from "../src/lib/supabase-admin";
import { getViewCountWithClient, incrementViewCountWithClient } from "../src/lib/views-server";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SECRET_KEY: string;
};

const viewPathPattern = /^\/api\/views\/([^/]+)$/;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const slug = parseKnownViewSlug(url.pathname);

    if (!slug) {
      return json({ error: "Unknown blog post" }, 404);
    }

    if (request.method !== "GET" && request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, { Allow: "GET, POST" });
    }

    const supabase = createSupabaseAdmin({
      url: env.SUPABASE_URL,
      secretKey: env.SUPABASE_SECRET_KEY,
    });

    let views: number;

    try {
      views =
        request.method === "GET"
          ? await getViewCountWithClient(supabase, slug)
          : await incrementViewCountWithClient(supabase, slug);
    } catch (cause) {
      return json({ error: formatStorageError(cause) }, 500);
    }

    return json({ slug, views });
  },
};

function parseKnownViewSlug(pathname: string): BlogSlug | undefined {
  const match = viewPathPattern.exec(pathname);
  if (!match) {
    return undefined;
  }

  const decoded = decodePathSegment(match[1]);
  if (!decoded) {
    return undefined;
  }

  const slug = parseBlogSlug(decoded);
  if (!slug || !isPublishedPostSlug(slug)) {
    return undefined;
  }

  return slug;
}

function decodePathSegment(value: string): string | undefined {
  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}

function formatStorageError(cause: unknown): string {
  return cause instanceof Error ? cause.message : "View count storage unavailable";
}

function json(body: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}
