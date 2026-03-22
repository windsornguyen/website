// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createFileRoute } from "@tanstack/react-router";

import { siteMetadata } from "../content/contentManifest";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          `User-agent: *\nAllow: /\nDisallow: /private/\nSitemap: ${siteMetadata.siteUrl}/sitemap.xml\n`,
          {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
            },
          },
        ),
    },
  },
});
