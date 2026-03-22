import { createFileRoute } from "@tanstack/react-router";

import { mdxComponents } from "@/mdx-components";
import HomePage from "../../content/home.mdx";
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
  component: HomeRoute,
});

function HomeRoute() {
  return <HomePage components={mdxComponents} />;
}
