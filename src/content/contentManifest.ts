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

export type BlogPostEntry = BlogPostMetadata & {
  loadComponent: () => Promise<MdxPageComponent>;
};

const blogMetadataModules = import.meta.glob<BlogPostMetadata>("../../content/blog/*.mdx", {
  eager: true,
  import: "postMetadata",
});

const blogComponentModules = import.meta.glob<MdxPageComponent>("../../content/blog/*.mdx", {
  import: "default",
});

const blogPosts = Object.entries(blogMetadataModules)
  .map(([path, postMetadata]) => {
    const loadComponent = blogComponentModules[path];

    if (!loadComponent) {
      throw new Error(`Missing MDX component loader for blog module: ${path}`);
    }

    return {
      ...postMetadata,
      loadComponent: async () => loadComponent(),
    };
  })
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

const postsBySlug = new Map(blogPosts.map((post) => [post.slug, post]));

export function getAllPosts(): BlogPostEntry[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPostEntry | undefined {
  return postsBySlug.get(slug);
}
