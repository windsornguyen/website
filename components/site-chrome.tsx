import { useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";

import { useCommandMenu } from "@/components/command-menu";
import ViewTransitionLink from "@/components/view-transition-link";
import { getAllPosts } from "@/src/content/contentManifest";

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
  "text-gray-900 underline decoration-gray-300 underline-offset-2 transition-colors hover:decoration-gray-500 dark:text-gray-100 dark:decoration-gray-600 dark:hover:decoration-gray-400";

function SearchButton() {
  const { setOpen } = useCommandMenu();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="mb-px flex h-7 items-center gap-3 rounded-md border border-gray-200 bg-white/60 px-2.5 text-[11px] text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-500 dark:border-gray-700 dark:bg-white/5 dark:text-gray-500 dark:hover:border-gray-600 dark:hover:text-gray-400"
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
  const posts = getAllPosts();

  const showRoute = activeTab === "Writing" && onBlogPost;

  function handleTabClick(tab: Tab) {
    setActiveTab(tab);
    if (tab === "Writing" && onBlogPost) {
      // Stay on the blog post — just switch tab highlight
    }
  }

  return (
    <>
      <p
        className="mt-0.5 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400"
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

      <div className="mt-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`px-3 py-1.5 text-[13px] font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <SearchButton />
      </div>

      <div className="pt-2.5">
        {showRoute && children}

        {activeTab === "Writing" && !onBlogPost && (
          <ul className="space-y-0">
            {posts.map((post) => (
              <li key={post.slug}>
                <ViewTransitionLink
                  to={`/blog/${post.slug}`}
                  className="flex items-start justify-between gap-4 rounded-sm px-2 py-2 transition-colors hover:bg-[#101828]/5 dark:hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <div className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{post.title}</div>
                    <div className="text-[13px] leading-snug text-gray-400 dark:text-gray-500">{post.description}</div>
                  </div>
                  <time className="shrink-0 pt-0.5 text-[13px] text-gray-400 tabular-nums dark:text-gray-500">
                    {formatDate(post.publishedAt)}
                  </time>
                </ViewTransitionLink>
              </li>
            ))}
          </ul>
        )}

        {activeTab === "Research" && <p className="text-[13px] text-gray-400 dark:text-gray-500">Coming soon.</p>}

        {activeTab === "Projects" && <p className="text-[13px] text-gray-400 dark:text-gray-500">Coming soon.</p>}

        {activeTab === "Bio" && (
          <div
            className="space-y-1 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400"
            style={{ letterSpacing: "-0.011em" }}
          >
            <p>
              I currently work on state space models in the{" "}
              <a
                href="https://www.minregret.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Hazan Minregret Lab
              </a>{" "}
              and the{" "}
              <a
                href="https://tridao.me/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Dao AI Lab
              </a>
              .
            </p>
            <p>
              In my free time, I lead the{" "}
              <a
                href="https://princetonalignment.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Princeton AI Alignment Group
              </a>{" "}
              and{" "}
              <a
                href="https://club.hoagie.io/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Hoagie.io
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </>
  );
}
