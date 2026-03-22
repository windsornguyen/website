// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { useLocation } from "@tanstack/react-router";

import { getAllPosts, getPostBySlug, siteMetadata } from "@/src/content/contentManifest";
import { stripPreamble } from "@/scripts/lib/llms";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function buildHomePage(): string {
  const posts = getAllPosts();
  const lines = [
    `# ${siteMetadata.title}`,
    "",
    "> Co-Founder and CTO of [Dedalus Labs](https://dedaluslabs.ai).",
    "",
    "## Writing",
    "",
    ...posts.map(
      (p) => `- [${p.title}](${siteMetadata.siteUrl}/blog/${p.slug}) — ${p.description} (${formatDate(p.publishedAt)})`,
    ),
    "",
    "## Links",
    "",
    `- [@windsornguyen](https://x.com/windsornguyen)`,
    `- [Google Scholar](https://scholar.google.com/citations?user=R9DN_W4AAAAJ&hl=en&oi=sra)`,
    `- [LinkedIn](https://www.linkedin.com/in/windsornguyen)`,
    `- [GitHub](https://github.com/windsornguyen)`,
    "",
    "---",
    "",
    `Source: ${siteMetadata.siteUrl}/llms.txt`,
  ];

  return lines.join("\n");
}

function buildBlogPost(slug: string): string | null {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const prose = typeof post.rawSource === "string" ? stripPreamble(post.rawSource) : "";
  const lines = [
    `# ${post.title}`,
    "",
    `> ${post.description}`,
    `> Published: ${formatDate(post.publishedAt)}`,
    post.updatedAt ? `> Updated: ${formatDate(post.updatedAt)}` : null,
    post.tags?.length ? `> Tags: ${post.tags.join(", ")}` : null,
    "",
    "---",
    "",
    prose,
    "",
    "---",
    "",
    `Source: ${siteMetadata.siteUrl}/blog/${post.slug}.md`,
  ];

  return lines.filter((l) => l !== null).join("\n");
}

export default function MachineView() {
  const location = useLocation();
  const blogMatch = location.pathname.match(/^\/blog\/(.+)$/);

  const content = blogMatch
    ? buildBlogPost(blogMatch[1]) ?? "404 — Post not found."
    : buildHomePage();

  return (
    <pre className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-[#c9d1d9]">
      {content}
    </pre>
  );
}
