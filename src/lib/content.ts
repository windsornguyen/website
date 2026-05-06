// Copyright (c) 2026 Windsor Nguyen. MIT License.

import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

import type { BlogSlug, ResolvedPostMetadata } from "../../content/schema";

export type MdxPageComponent = ComponentType<{ components?: MDXComponents }>;

type BlogPostModule = {
  default: MdxPageComponent;
  postMetadata: ResolvedPostMetadata;
};

type RawMdxModule = {
  default: string;
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

function readRawMdxSource(filepath: string, module: unknown): string {
  if (typeof module === "string") {
    return module;
  }

  if (isRawMdxModule(module)) {
    return module.default;
  }

  throw new Error(`Raw MDX import for "${filepath}" did not return source text.`);
}

function isRawMdxModule(value: unknown): value is RawMdxModule {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("default" in value)) {
    return false;
  }

  return typeof value.default === "string";
}

const rawBySlug = new Map<string, string>();
for (const [filepath, module] of Object.entries(rawModules)) {
  const source = readRawMdxSource(filepath, module);
  rawBySlug.set(slugFromPath(filepath), source);
}

const blogPosts = Object.entries(blogModules)
  .map(([filepath, { default: Component, postMetadata }]) => {
    const rawSource = rawBySlug.get(postMetadata.slug) ?? rawBySlug.get(slugFromPath(filepath));

    if (typeof rawSource !== "string") {
      throw new Error(`Missing raw MDX source for "${filepath}".`);
    }

    return {
      ...postMetadata,
      Component,
      rawSource,
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

export function getPostBySlug(slug: BlogSlug): BlogPostEntry | undefined {
  return postsBySlug.get(slug);
}
