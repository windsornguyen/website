// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";

import { useCommandMenu } from "@/components/command-menu";
import ViewTransitionLink from "@/components/view-transition-link";
import { mdxComponents } from "@/mdx-components";
import { getAllPosts } from "@/src/lib/content";
import { formatViewCount, getViewCountSync } from "@/src/lib/views";
import Bio from "@/content/bio.mdx";
import Research from "@/content/research.mdx";

const tabs = ["Writing", "Research", "Projects", "Bio"] as const;
type Tab = (typeof tabs)[number];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

const linkClass =
  "underline decoration-link-line underline-offset-2 transition-colors hover:decoration-link-line-hover";

function SearchButton() {
  const { setOpen } = useCommandMenu();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="border-edge text-caption text-fg-ghost hover:border-fg-muted hover:text-fg-muted mb-1 flex h-6 min-w-20 shrink-0 items-center justify-between rounded-md border px-2 transition-colors sm:w-28"
      aria-label="Search"
    >
      <kbd className="font-sans font-medium tracking-normal">⌘ K</kbd>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </button>
  );
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const location = useLocation();
  const onBlogPost = location.pathname.startsWith("/blog/");
  const [activeTab, setActiveTab] = useState<Tab>("Writing");
  const [enterDirection, setEnterDirection] = useState<"from-left" | "from-right" | "fade">("fade");
  const posts = getAllPosts();

  const showRoute = activeTab === "Writing" && onBlogPost;

  function handleTabClick(tab: Tab) {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = tabs.indexOf(tab);

    if (nextIndex === currentIndex) {
      return;
    }

    setEnterDirection(nextIndex > currentIndex ? "from-left" : "from-right");
    setActiveTab(tab);
  }

  return (
    <>
      <p
        className="text-body text-fg-secondary mt-0.5 leading-relaxed"
        style={{ letterSpacing: "-0.011em" }}
      >
        Co-Founder and CTO of{" "}
        <a
          href="https://dedaluslabs.ai"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Dedalus Labs
        </a>
        .
      </p>

      <div className="border-edge mt-4 flex items-center justify-between border-b">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`text-label px-3 py-1.5 font-medium transition-colors ${
                activeTab === tab
                  ? "border-fg text-fg border-b-2"
                  : "text-fg-muted hover:text-fg-secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <SearchButton />
      </div>

      <div
        key={activeTab}
        className={`pt-2.5 ${
          enterDirection === "from-left"
            ? "animate-tab-in-from-left"
            : enterDirection === "from-right"
              ? "animate-tab-in-from-right"
              : "animate-tab-in"
        }`}
      >
        {showRoute && children}

        {activeTab === "Writing" && !onBlogPost && (
          <ul className="space-y-0">
            {posts.map((post) => (
              <li key={post.slug}>
                <ViewTransitionLink
                  to={`/blog/${post.slug}`}
                  className="hover:bg-surface-active flex items-start justify-between gap-4 rounded-sm px-2 py-2 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-body text-fg font-medium">{post.title}</div>
                    <div className="text-label text-fg-muted leading-snug">{post.description}</div>
                  </div>
                  <div className="text-label text-fg-muted flex shrink-0 flex-col items-end gap-0.5 pt-0.5 tabular-nums">
                    <time>{formatDate(post.publishedAt)}</time>
                    <span className="text-caption">
                      {formatViewCount(getViewCountSync(post.slug))}
                    </span>
                  </div>
                </ViewTransitionLink>
              </li>
            ))}
          </ul>
        )}

        {activeTab === "Research" && <Research components={mdxComponents} />}

        {activeTab === "Projects" && (
          <p className="text-label text-fg-muted py-12 text-center">Coming soon.</p>
        )}

        {activeTab === "Bio" && <Bio components={mdxComponents} />}
      </div>
    </>
  );
}
