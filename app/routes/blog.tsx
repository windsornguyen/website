// Copyright (c) 2026 Windsor Nguyen. MIT License.

import type { Route } from "./+types/blog";

import { parseBlogSlug } from "@/content/schema";
import { mdxComponents } from "@/mdx-components";
import { getPostBySlug } from "@/src/lib/content";
import { siteMetadata } from "@/src/lib/site";

import { buildPageMeta } from "../meta";

function notFound(): never {
  throw new Response("Post not found", { status: 404 });
}

export function loader({ params }: Route.LoaderArgs) {
  const slug = parseBlogSlug(params.slug);
  if (!slug) {
    notFound();
  }

  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return {
    canonical: post.canonical,
    description: post.description,
    publishedAt: post.publishedAt,
    slug: post.slug,
    title: post.title,
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [];
  }

  return buildPageMeta({
    canonicalPath: data.canonical,
    description: data.description,
    title: siteMetadata.titleTemplate.replace("%s", data.title),
  });
}

export default function BlogPostRoute({ loaderData }: Route.ComponentProps) {
  const slug = parseBlogSlug(loaderData.slug);
  if (!slug) {
    throw new Error(`Loader returned invalid blog slug "${loaderData.slug}".`);
  }

  const post = getPostBySlug(slug);
  if (!post) {
    throw new Error(`Loaded blog post "${slug}" is missing from the content registry.`);
  }

  return <post.Component components={mdxComponents} />;
}
