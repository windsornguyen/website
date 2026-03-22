import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";

import Footer from "@/components/footer";
import { siteMetadata } from "../content/contentManifest";

import appCss from "../styles.css?url";

const gaId = process.env.gaID ?? import.meta.env.VITE_GA_ID;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: siteMetadata.title,
      },
      {
        name: "description",
        content: siteMetadata.description,
      },
      {
        property: "og:title",
        content: siteMetadata.title,
      },
      {
        property: "og:description",
        content: siteMetadata.description,
      },
      {
        property: "og:url",
        content: siteMetadata.siteUrl,
      },
      {
        property: "og:site_name",
        content: siteMetadata.title,
      },
      {
        property: "og:image",
        content: `${siteMetadata.siteUrl}/opengraph-image.png`,
      },
      {
        property: "og:image:alt",
        content: "Pixelated Windsor Nguyen with a blue background",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:site",
        content: siteMetadata.twitterHandle,
      },
      {
        name: "twitter:creator",
        content: siteMetadata.twitterHandle,
      },
      {
        name: "twitter:image",
        content: `${siteMetadata.siteUrl}/opengraph-image.png`,
      },
      {
        name: "twitter:image:alt",
        content: "Pixelated Windsor Nguyen with a blue background",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <RootDocument>
      <RootLayout />
    </RootDocument>
  );
}

function Nav() {
  return (
    <nav className="mx-auto flex w-full max-w-[60ch] items-center justify-between py-5">
      <Link
        to="/"
        className="text-sm font-medium tracking-tight text-gray-900 hover:text-gray-600"
      >
        windsor nguyen
      </Link>
      <div className="flex gap-5 text-[13px] text-gray-400">
        <Link to="/" className="hover:text-gray-900">
          home
        </Link>
        <a href="#blog" className="hover:text-gray-900">
          blog
        </a>
      </div>
    </nav>
  );
}

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F5] px-8 text-gray-900">
      <Nav />
      <main className="mx-auto w-full max-w-[60ch] flex-1 pt-6">
        <Outlet />
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="space-y-4 pt-12">
      <h1 className="text-2xl font-medium text-gray-900">404</h1>
      <p className="leading-snug text-gray-800">This page does not exist.</p>
      <Link className="text-blue-500 hover:text-blue-700" to="/">
        Go home
      </Link>
    </main>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {gaId ? <GoogleAnalyticsScripts gaId={gaId} /> : null}
        <HeadContent />
      </head>
      <body className="antialiased" style={{ letterSpacing: "-0.011em" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function GoogleAnalyticsScripts({ gaId }: { gaId: string }) {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`,
        }}
      />
    </>
  );
}
