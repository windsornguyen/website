// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { stripPreamble } from "@/scripts/lib/llms";

export type MachineSiteMetadata = {
  title: string;
  siteUrl: string;
};

export type MachinePostSummary = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
};

export type MachinePostContent = MachinePostSummary & {
  rawSource: string;
  updatedAt?: string;
  tags?: string[];
};

export function formatMachineDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function buildHomeMachineMarkdown(
  site: MachineSiteMetadata,
  posts: MachinePostSummary[],
): string {
  return [
    `# ${site.title}`,
    "",
    "> Co-Founder and CTO of [Dedalus Labs](https://dedaluslabs.ai).",
    "",
    "## Writing",
    "",
    ...posts.map(
      (post) =>
        `- [${post.title}](${site.siteUrl}/blog/${post.slug}) — ${post.description} (${formatMachineDate(post.publishedAt)})`,
    ),
    "",
    "## Links",
    "",
    "- [@windsornguyen](https://x.com/windsornguyen)",
    "- [Google Scholar](https://scholar.google.com/citations?user=R9DN_W4AAAAJ&hl=en&oi=sra)",
    "- [LinkedIn](https://www.linkedin.com/in/windsornguyen)",
    "- [GitHub](https://github.com/windsornguyen)",
    "",
    "---",
    "",
    `Source: ${site.siteUrl}/llms.txt`,
  ].join("\n");
}

export function buildPostMachineMarkdown(
  site: MachineSiteMetadata,
  post: MachinePostContent,
): string {
  if (!post.rawSource) {
    throw new Error(`Missing rawSource for published post "${post.slug}"`);
  }

  const prose = stripPreamble(post.rawSource);

  return [
    `# ${post.title}`,
    "",
    `> ${post.description}`,
    `> Published: ${formatMachineDate(post.publishedAt)}`,
    post.updatedAt ? `> Updated: ${formatMachineDate(post.updatedAt)}` : null,
    post.tags?.length ? `> Tags: ${post.tags.join(", ")}` : null,
    "",
    "---",
    "",
    prose,
    "",
    "---",
    "",
    `Source: ${site.siteUrl}/blog/${post.slug}.md`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}
