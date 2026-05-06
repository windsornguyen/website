// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { useLocation } from "@tanstack/react-router";

import { parseBlogSlug } from "@/content/schema";
import { getAllPosts, getPostBySlug } from "@/src/lib/content";
import { siteMetadata } from "@/src/lib/site";
import { buildHomeMachineMarkdown, buildPostMachineMarkdown } from "@/src/lib/machine-markdown";

export default function MachineView() {
  const location = useLocation();
  const blogMatch = location.pathname.match(/^\/blog\/(.+)$/);
  const content = blogMatch
    ? buildBlogMachineMarkdown(blogMatch[1])
    : buildHomeMachineMarkdown(siteMetadata, getAllPosts());

  return <pre className="machine-pre break-words whitespace-pre-wrap">{content}</pre>;
}

function buildBlogMachineMarkdown(slugParam: string): string {
  const slug = parseBlogSlug(slugParam);
  if (!slug) {
    return "404: Post not found.";
  }

  const post = getPostBySlug(slug);
  if (!post) {
    return "404: Post not found.";
  }

  const markdown = buildPostMachineMarkdown(siteMetadata, post);

  return markdown;
}
