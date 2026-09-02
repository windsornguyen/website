// Copyright (c) 2026 Windsor Nguyen. MIT License.

import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";

import { CommandMenuProvider } from "@/components/command-menu";
import Footer from "@/components/footer";
import { MachineModeProvider, useMachineMode } from "@/components/machine-mode";
import MachineView from "@/components/machine-view";
import SiteChrome from "@/components/site-chrome";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { siteMetadata } from "@/src/lib/site";
import appCss from "@/src/styles.css?url";

import { buildPageMeta } from "./meta";

const gaId = import.meta.env.VITE_GA_ID;

export function links() {
  return [
    { rel: "stylesheet", href: appCss },
    { rel: "icon", href: "/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
  ];
}

export function meta() {
  return buildPageMeta({
    canonicalPath: "/",
    description: siteMetadata.description,
    title: siteMetadata.title,
  });
}

export function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {gaId ? <GoogleAnalyticsScripts gaId={gaId} /> : null}
        <Meta />
        <Links />
      </head>
      <body className="antialiased" style={{ letterSpacing: 0 }}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <RootLayout />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <RootLayout>
        <NotFoundPage />
      </RootLayout>
    );
  }

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown route error";

  return (
    <RootLayout>
      <main className="space-y-4 pt-12">
        <h1 className="text-fg text-2xl font-medium">Route error</h1>
        <p className="text-fg-emphasis leading-snug">{message}</p>
      </main>
    </RootLayout>
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
      className="text-fg-muted hover:text-fg-secondary flex h-7 w-7 items-center justify-center rounded-full transition-colors"
      aria-label="Toggle theme"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="block dark:hidden"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden dark:block"
      >
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
      className="text-fg-muted hover:text-fg-secondary flex h-7 w-7 items-center justify-center rounded-full transition-colors"
      aria-label="Toggle machine mode"
      title={machine ? "Human mode" : "Machine mode"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {machine ? (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        ) : (
          <>
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M9 9h.01" />
            <path d="M15 9h.01" />
            <path d="M9 15h6" />
          </>
        )}
      </svg>
    </button>
  );
}

function Nav() {
  return (
    <nav className="mx-auto flex w-full max-w-[60ch] items-center justify-between py-3">
      <Link to="/" className="text-fg hover:text-fg-secondary text-sm font-medium tracking-tight">
        Windsor Nguyen
      </Link>
      <div className="flex items-center gap-0.5">
        <ThemeToggle />
        <MachineToggle />
      </div>
    </nav>
  );
}

function RootLayout({ children = <Outlet /> }: Readonly<{ children?: ReactNode }>) {
  return (
    <ThemeProvider defaultTheme="system">
      <MachineModeProvider>
        <CommandMenuProvider>
          <LayoutShell>{children}</LayoutShell>
        </CommandMenuProvider>
      </MachineModeProvider>
    </ThemeProvider>
  );
}

function LayoutShell({ children }: Readonly<{ children: ReactNode }>) {
  const { machine } = useMachineMode();

  return (
    <div className="bg-surface text-fg flex min-h-screen flex-col px-8">
      <header className="bg-surface sticky top-0 z-10">
        <Nav />
      </header>
      <main className="mx-auto w-full max-w-[60ch] flex-1 pt-1">
        {machine ? <MachineView /> : <SiteChrome>{children}</SiteChrome>}
      </main>
      {!machine && <Footer />}
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="space-y-4 pt-12">
      <h1 className="text-fg text-2xl font-medium">404</h1>
      <p className="text-fg-emphasis leading-snug">This page does not exist.</p>
      <Link className="text-blue-500 hover:text-blue-700" to="/">
        Go Home
      </Link>
    </main>
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
