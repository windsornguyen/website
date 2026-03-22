import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import ViewTransitionLink from "@/components/view-transition-link";
import { mdxComponents } from "@/mdx-components";
import HomePage from "../../content/home.mdx";
import { getAllPosts, siteMetadata } from "../content/contentManifest";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: siteMetadata.titleTemplate.replace("%s", "Home"),
      },
      {
        name: "description",
        content: "Homepage of Windsor's personal website.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${siteMetadata.siteUrl}/`,
      },
    ],
  }),
  component: HomeRoute,
});

const tabs = ["writing", "research", "projects"] as const;
type Tab = (typeof tabs)[number];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function HomeRoute() {
  const [activeTab, setActiveTab] = useState<Tab>("writing");
  const posts = getAllPosts();

  return (
    <div className="space-y-5">
      <section>
        <HomePage components={mdxComponents} />
      </section>

      <hr className="border-gray-200" />

      <div>
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
          {activeTab === "writing" && (
            <ul className="space-y-2.5">
              {posts.map((post) => (
                <li key={post.slug}>
                  <ViewTransitionLink
                    to={`/blog/${post.slug}`}
                    className="group flex items-baseline justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[15px] font-medium text-gray-900 group-hover:text-blue-600">
                        {post.title}
                      </span>
                      <span className="ml-2 text-[13px] text-gray-400">{post.description}</span>
                    </div>
                    <time className="shrink-0 text-[13px] tabular-nums text-gray-400">
                      {formatDate(post.publishedAt)}
                    </time>
                  </ViewTransitionLink>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "research" && (
            <p className="text-[13px] text-gray-400">coming soon.</p>
          )}

          {activeTab === "projects" && (
            <p className="text-[13px] text-gray-400">coming soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
