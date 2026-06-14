// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { siteMetadata } from "@/src/lib/site";

export function loader() {
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /private/\nSitemap: ${siteMetadata.siteUrl}/sitemap.xml\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
