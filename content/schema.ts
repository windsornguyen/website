// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Blog post schema.
 *
 * MDX files call `definePost({...})` to get compile-time type checking
 * on metadata. Derived fields (canonical, citation) are computed, not stored.
 */

export type PostStatus = "draft" | "published";

declare const blogSlugBrand: unique symbol;

export type BlogSlug = string & {
  readonly [blogSlugBrand]: "BlogSlug";
};

const blogSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseBlogSlug(value: string): BlogSlug | undefined {
  if (!blogSlugPattern.test(value)) {
    return undefined;
  }

  return value as BlogSlug;
}

export function assertBlogSlug(value: string): BlogSlug {
  const slug = parseBlogSlug(value);

  if (!slug) {
    throw new Error(`Invalid blog slug "${value}". Use lowercase kebab-case.`);
  }

  return slug;
}

/**
 * Canonical tag vocabulary. Add new tags here. The compiler
 * will reject any tag not in this union across all MDX files.
 */
export type Tag =
  | "personal"
  | "distributed-systems"
  | "cuda"
  | "gpu"
  | "infra"
  | "reflection"
  | "analysis"
  | "research"
  | "systems";

export type BlogPostMetadata = {
  slug: BlogSlug;
  title: string;
  subtitle?: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: Tag[];
  status: PostStatus;
};

export type ResolvedPostMetadata = BlogPostMetadata & {
  canonical: string;
};

export type BlogPostMetadataInput = Omit<BlogPostMetadata, "slug"> & {
  slug: string;
};

/**
 * Type-safe metadata declaration for MDX blog posts.
 * Computes `canonical` from `slug` so authors never hand-type it.
 *
 * Usage in MDX:
 * ```ts
 * export const postMetadata = definePost({
 *   slug: "my-post",
 *   title: "My Post",
 *   ...
 * });
 * ```
 */
export function definePost(metadata: BlogPostMetadataInput): ResolvedPostMetadata {
  const slug = assertBlogSlug(metadata.slug);

  return {
    ...metadata,
    slug,
    canonical: `/blog/${slug}`,
  };
}

/**
 * BibTeX citation for a blog post.
 * Researchers can copy this to cite the post in papers.
 */
export function toBibtex(post: ResolvedPostMetadata, author = "Windsor Nguyễn"): string {
  const year = new Date(post.publishedAt).getFullYear();
  const key = `nguyen${year}${post.slug.replace(/-/g, "")}`;

  return [
    `@article{${key},`,
    `  author = {${author}},`,
    `  title = {${post.title}},`,
    `  year = {${year}},`,
    `  url = {https://windsornguyen.com${post.canonical}},`,
    `}`,
  ].join("\n");
}
