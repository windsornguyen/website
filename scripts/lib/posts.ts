import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type BlogPostMetadata = {
  slug: string;
  title: string;
  description: string;
  canonical: string;
  publishedAt: string;
};

export type BlogPostEntry = BlogPostMetadata & {
  path: string;
};

const blogDirectory = path.resolve(process.cwd(), "content/blog");

function parseStringField(name: keyof BlogPostMetadata, source: string) {
  const match = source.match(new RegExp(`${name}:\\s*["']([^"']+)["']`));

  if (!match) {
    throw new Error(`Missing "${name}" in post metadata.`);
  }

  return match[1];
}

export function parsePostMetadata(source: string): BlogPostMetadata {
  return {
    slug: parseStringField("slug", source),
    title: parseStringField("title", source),
    description: parseStringField("description", source),
    canonical: parseStringField("canonical", source),
    publishedAt: parseStringField("publishedAt", source),
  };
}

export function slugifyTitle(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function renderTimestampLabel(isoTimestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(new Date(isoTimestamp));
}

export function renderPostTemplate(metadata: BlogPostMetadata) {
  return `import AnimatedName from "@/components/animated-name";

export const postMetadata = {
  slug: "${metadata.slug}",
  title: "${metadata.title}",
  description: "${metadata.description}",
  canonical: "${metadata.canonical}",
  publishedAt: "${metadata.publishedAt}",
};

# ${metadata.title}

<AnimatedName />

<br />
<small>
  <em>Last updated: ${renderTimestampLabel(metadata.publishedAt)}.</em>
</small>

Start writing here.
`;
}

export async function readPostEntries() {
  const entries = await readdir(blogDirectory, { withFileTypes: true });
  const posts = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
      .map(async (entry) => {
        const postPath = path.join(blogDirectory, entry.name);
        const source = await readFile(postPath, "utf8");
        const metadata = parsePostMetadata(source);

        return {
          ...metadata,
          path: postPath,
        };
      }),
  );

  return posts.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export function validatePostEntries(posts: BlogPostEntry[]) {
  const errors: string[] = [];
  const seenSlugs = new Set<string>();

  for (const post of posts) {
    if (!post.slug) {
      errors.push(`${post.path}: slug cannot be empty`);
    }

    if (seenSlugs.has(post.slug)) {
      errors.push(`${post.path}: duplicate slug "${post.slug}"`);
    }

    seenSlugs.add(post.slug);

    if (post.canonical !== `/blog/${post.slug}`) {
      errors.push(`${post.path}: canonical must be "/blog/${post.slug}", got "${post.canonical}"`);
    }

    if (Number.isNaN(Date.parse(post.publishedAt))) {
      errors.push(`${post.path}: publishedAt must be a valid ISO timestamp`);
    }
  }

  return errors;
}

export async function writePostFile(metadata: BlogPostMetadata, force = false) {
  const postPath = path.join(blogDirectory, `${metadata.slug}.mdx`);

  if (!force) {
    try {
      await readFile(postPath, "utf8");
      throw new Error(`Post already exists at ${postPath}. Use --force to overwrite.`);
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("ENOENT")) {
        throw error;
      }
    }
  }

  await writeFile(postPath, renderPostTemplate(metadata), "utf8");

  return postPath;
}
