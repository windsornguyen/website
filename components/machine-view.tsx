// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { useLocation } from "@tanstack/react-router";

import { getAllPosts, getPostBySlug, siteMetadata } from "@/src/content/contentManifest";
import { buildHomeMachineMarkdown, buildPostMachineMarkdown } from "@/src/lib/machine-markdown";

export default function MachineView() {
  const location = useLocation();
  const blogMatch = location.pathname.match(/^\/blog\/(.+)$/);

  const content = blogMatch
    ? (() => {
        const post = getPostBySlug(blogMatch[1]);
        return post ? buildPostMachineMarkdown(siteMetadata, post) : "404 — Post not found.";
      })()
    : buildHomeMachineMarkdown(siteMetadata, getAllPosts());

  return (
    <pre className="machine-pre whitespace-pre-wrap break-words">
      {content}
    </pre>
  );
}
