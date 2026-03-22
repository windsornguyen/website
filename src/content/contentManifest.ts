// Copyright (c) 2026 Windsor Nguyen. MIT License.

import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

import type { ResolvedPostMetadata } from "../../content/schema";

export const siteMetadata = {
  title: "Windsor Nguyen",
  titleTemplate: "%s | Windsor Nguyen",
  description: "Windsor's personal website",
  siteUrl: "https://windsornguyen.com",
  twitterHandle: "@windsornguyen",
} as const;

export type MdxPageComponent = ComponentType<{ components?: MDXComponents }>;

type BlogPostModule = {
  default: MdxPageComponent;
  postMetadata: ResolvedPostMetadata;
};

export type BlogPostEntry = ResolvedPostMetadata & {
  Component: MdxPageComponent;
  rawSource: string;
};

const blogModules = import.meta.glob<BlogPostModule>("../../content/blog/*.mdx", { eager: true });
const blogSources = import.meta.glob("../../content/blog/*.mdx", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

const blogPosts = Object.entries(blogModules)
  .map(([filepath, { default: Component, postMetadata }]) => ({
    ...postMetadata,
    Component,
    rawSource: blogSources[filepath] ?? "",
  }))
  .filter((post) => post.status === "published")
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

const postsBySlug = new Map(blogPosts.map((post) => [post.slug, post]));

export function getAllPosts(): BlogPostEntry[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPostEntry | undefined {
  return postsBySlug.get(slug);
}
