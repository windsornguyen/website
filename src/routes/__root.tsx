import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";

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
  shellComponent: RootDocument,
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-white p-8 pt-0 text-gray-900 md:pt-8">
      <main className="mx-auto w-full max-w-[60ch] space-y-6">
        <Outlet />
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {gaId ? <GoogleAnalyticsScripts gaId={gaId} /> : null}
        <HeadContent />
      </head>
      <body className="tracking-tight antialiased">
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
