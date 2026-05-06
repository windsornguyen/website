// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createFileRoute, notFound } from "@tanstack/react-router";

import { parseBlogSlug } from "@/content/schema";
import { mdxComponents } from "@/mdx-components";
import { getPostBySlug } from "../lib/content";
import { siteMetadata } from "../lib/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const slug = parseBlogSlug(params.slug);

    if (!slug) {
      throw notFound();
    }

    const post = getPostBySlug(slug);

    if (!post) {
      throw notFound();
    }

    return {
      canonical: post.canonical,
      description: post.description,
      publishedAt: post.publishedAt,
      slug: post.slug,
      title: post.title,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [],
      };
    }

    return {
      meta: [
        {
          title: siteMetadata.titleTemplate.replace("%s", loaderData.title),
        },
        {
          name: "description",
          content: loaderData.description,
        },
        {
          property: "og:title",
          content: loaderData.title,
        },
        {
          property: "og:description",
          content: loaderData.description,
        },
        {
          property: "og:url",
          content: `${siteMetadata.siteUrl}${loaderData.canonical}`,
        },
      ],
      links: [
        {
          rel: "canonical",
          href: `${siteMetadata.siteUrl}${loaderData.canonical}`,
        },
      ],
    };
  },
  component: BlogPostRoute,
});

function BlogPostRoute() {
  const params = Route.useParams();
  const slug = parseBlogSlug(params.slug);

  if (!slug) {
    throw notFound();
  }

  const post = getPostBySlug(slug);

  if (!post) {
    throw notFound();
  }

  return <post.Component components={mdxComponents} />;
}
