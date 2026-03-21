import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

export const siteMetadata = {
  title: "Windsor Nguyen",
  titleTemplate: "%s | Windsor Nguyen",
  description: "Windsor's personal website",
  siteUrl: "https://windsornguyen.com",
  twitterHandle: "@windsornguyen",
} as const;

export type MdxPageComponent = ComponentType<{ components?: MDXComponents }>;

export type BlogPostMetadata = {
  slug: string;
  title: string;
  description: string;
  canonical: string;
  publishedAt: string;
};

type BlogPostModule = {
  default: MdxPageComponent;
  postMetadata: BlogPostMetadata;
};

export type BlogPostEntry = BlogPostMetadata & {
  Component: MdxPageComponent;
};

const blogModules = import.meta.glob<BlogPostModule>("../../content/blog/*.mdx", { eager: true });

const blogPosts = Object.values(blogModules)
  .map(({ default: Component, postMetadata }) => ({
    ...postMetadata,
    Component,
  }))
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

const postsBySlug = new Map(blogPosts.map((post) => [post.slug, post]));

export function getAllPosts(): BlogPostEntry[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPostEntry | undefined {
  return postsBySlug.get(slug);
}
