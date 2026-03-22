// Copyright (c) 2026 Windsor Nguyen. MIT License.

import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";

import { CommandMenuProvider } from "@/components/command-menu";
import Footer from "@/components/footer";
import { MachineModeProvider, useMachineMode } from "@/components/machine-mode";
import MachineView from "@/components/machine-view";
import SiteChrome from "@/components/site-chrome";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { siteMetadata } from "../content/contentManifest";

import appCss from "../styles.css?url";

const gaId = process.env.gaID ?? import.meta.env.VITE_GA_ID;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteMetadata.title },
      { name: "description", content: siteMetadata.description },
      { property: "og:title", content: siteMetadata.title },
      { property: "og:description", content: siteMetadata.description },
      { property: "og:url", content: siteMetadata.siteUrl },
      { property: "og:site_name", content: siteMetadata.title },
      { property: "og:image", content: `${siteMetadata.siteUrl}/opengraph-image.png` },
      { property: "og:image:alt", content: "Pixelated Windsor Nguyen with a blue background" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: siteMetadata.twitterHandle },
      { name: "twitter:creator", content: siteMetadata.twitterHandle },
      { name: "twitter:image", content: `${siteMetadata.siteUrl}/opengraph-image.png` },
      { name: "twitter:image:alt", content: "Pixelated Windsor Nguyen with a blue background" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
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

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function cycle() {
    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
    setTheme(resolved === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-fg-secondary"
      aria-label="Toggle theme"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block dark:hidden">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" /><path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" /><path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden dark:block">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  );
}

function MachineToggle() {
  const { machine, setMachine } = useMachineMode();

  return (
    <button
      type="button"
      onClick={() => setMachine(!machine)}
      className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-fg-secondary"
      aria-label="Toggle machine mode"
      title={machine ? "Human mode" : "Machine mode"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {machine ? (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        ) : (
          <>
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M9 9h.01" /><path d="M15 9h.01" /><path d="M9 15h6" />
          </>
        )}
      </svg>
    </button>
  );
}

function Nav() {
  return (
    <nav className="mx-auto flex w-full max-w-[60ch] items-center justify-between py-3">
      <Link to="/" className="text-sm font-medium tracking-tight text-fg hover:text-fg-secondary">
        Windsor Nguyen
      </Link>
      <div className="flex items-center gap-0.5">
        <ThemeToggle />
        <MachineToggle />
      </div>
    </nav>
  );
}

function RootLayout() {
  return (
    <ThemeProvider defaultTheme="system">
      <MachineModeProvider>
        <CommandMenuProvider>
          <LayoutShell />
        </CommandMenuProvider>
      </MachineModeProvider>
    </ThemeProvider>
  );
}

function LayoutShell() {
  const { machine } = useMachineMode();

  return (
    <div className="flex min-h-screen flex-col bg-surface px-8 text-fg">
      <header className="sticky top-0 z-10 bg-surface">
        <Nav />
      </header>
      <main className="mx-auto w-full max-w-[60ch] flex-1 pt-1">
        {machine ? <MachineView /> : <SiteChrome><Outlet /></SiteChrome>}
      </main>
      {!machine && <Footer />}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="space-y-4 pt-12">
      <h1 className="text-2xl font-medium text-fg">404</h1>
      <p className="leading-snug text-fg-emphasis">This page does not exist.</p>
      <Link className="text-blue-500 hover:text-blue-700" to="/">Go Home</Link>
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
