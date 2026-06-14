// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { siteMetadata } from "@/src/lib/site";

import { buildPageMeta } from "../meta";

export function meta() {
  return buildPageMeta({
    canonicalPath: "/",
    description: "Homepage of Windsor's personal website.",
    title: siteMetadata.titleTemplate.replace("%s", "Home"),
  });
}

export default function HomeRoute() {
  return null;
}
