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

const rawModules = import.meta.glob("../../content/blog/*.mdx", {
  eager: true,
  query: "?raw",
});

function slugFromPath(filepath: string): string {
  return filepath.replace(/^.*\//, "").replace(/\.mdx$/, "");
}

const rawBySlug = new Map<string, string>();
for (const [filepath, module] of Object.entries(rawModules)) {
  // Vite 5+ with ?raw returns { default: "string content" } when import is not specified
  const content = (module as any)?.default ?? module;
  if (typeof content === "string") {
    rawBySlug.set(slugFromPath(filepath), content);
  } else {
    console.warn(`[contentManifest] rawModules content is not a string for ${filepath}:`, typeof content);
  }
}

const blogPosts = Object.entries(blogModules)
  .map(([filepath, { default: Component, postMetadata }]) => {
    const rawSource = rawBySlug.get(postMetadata.slug) ?? rawBySlug.get(slugFromPath(filepath));
    if (typeof rawSource !== "string") {
      console.error(`[contentManifest] Could not find rawSource for ${filepath}. Available keys:`, Array.from(rawBySlug.keys()));
    }
    return {
      ...postMetadata,
      Component,
      rawSource: rawSource ?? "",
    };
  })
  .filter((post) => post.status === "published")
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

for (const post of blogPosts) {
  if (!post.rawSource) {
    throw new Error(`Missing rawSource for published post "${post.slug}"`);
  }
}

const postsBySlug = new Map(blogPosts.map((post) => [post.slug, post]));

export function getAllPosts(): BlogPostEntry[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPostEntry | undefined {
  return postsBySlug.get(slug);
}
