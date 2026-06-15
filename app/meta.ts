// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { siteMetadata } from "@/src/lib/site";

type PageMeta = {
  canonicalPath: string;
  description: string;
  title: string;
};

export function buildPageMeta({ canonicalPath, description, title }: PageMeta) {
  const url = `${siteMetadata.siteUrl}${canonicalPath}`;
  const image = `${siteMetadata.siteUrl}/opengraph-image.png`;
  const imageAlt = "Pixelated Windsor Nguyen with a blue background";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: siteMetadata.title },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: siteMetadata.twitterHandle },
    { name: "twitter:creator", content: siteMetadata.twitterHandle },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt },
  ];
}
