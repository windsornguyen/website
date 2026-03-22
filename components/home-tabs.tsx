import { useState } from "react";

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
  "text-gray-900 underline decoration-gray-300 underline-offset-2 transition-colors hover:decoration-gray-500";

export default function HomeTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("Writing");
  const posts = getAllPosts();

  return (
    <div className="mt-4">
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-[13px] font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {activeTab === "Writing" && (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <ViewTransitionLink
                  to={`/blog/${post.slug}`}
                  className="group flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-[15px] font-medium text-gray-900 group-hover:text-blue-600">
                      {post.title}
                    </div>
                    <div className="text-[13px] leading-snug text-gray-400">{post.description}</div>
                  </div>
                  <time className="shrink-0 pt-0.5 text-[13px] text-gray-400 tabular-nums">
                    {formatDate(post.publishedAt)}
                  </time>
                </ViewTransitionLink>
              </li>
            ))}
          </ul>
        )}

        {activeTab === "Research" && <p className="text-[13px] text-gray-400">Coming soon.</p>}

        {activeTab === "Projects" && <p className="text-[13px] text-gray-400">Coming soon.</p>}

        {activeTab === "Bio" && (
          <div
            className="space-y-1 text-[15px] leading-relaxed text-gray-600"
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
    </div>
  );
}
