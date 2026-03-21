import { createFileRoute } from "@tanstack/react-router";

import { getAllPosts, siteMetadata } from "../content/contentManifest";

function buildSitemapXml() {
  const staticUrls = [
    {
      loc: siteMetadata.siteUrl,
      lastModified: new Date().toISOString(),
    },
  ];

  const blogUrls = getAllPosts().map((post) => ({
    loc: `${siteMetadata.siteUrl}${post.canonical}`,
    lastModified: post.publishedAt,
  }));

  const urls = [...staticUrls, ...blogUrls];

  const body = urls
    .map(
      ({ loc, lastModified }) => `<url>
  <loc>${loc}</loc>
  <lastmod>${lastModified}</lastmod>
</url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemapXml(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
          },
        }),
    },
  },
});
