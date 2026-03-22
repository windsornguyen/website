// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createFileRoute } from "@tanstack/react-router";

import { siteMetadata } from "../content/contentManifest";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: siteMetadata.titleTemplate.replace("%s", "Home"),
      },
      {
        name: "description",
        content: "Homepage of Windsor's personal website.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${siteMetadata.siteUrl}/`,
      },
    ],
  }),
  component: () => null,
});
