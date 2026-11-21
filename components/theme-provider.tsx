// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

type Theme = "dark" | "light" | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// localStorage is the source of truth; same-tab writes notify via this set,
// cross-tab writes arrive through the native "storage" event.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const theme = useSyncExternalStore(
    subscribe,
    () => (localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme,
    () => defaultTheme,
  );

  useEffect(() => {
    const root = document.documentElement;

    const css = document.createElement("style");
    css.textContent = "*, *::before, *::after { transition: none !important; }";
    document.head.appendChild(css);

    root.classList.remove("light", "dark");

    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    root.classList.add(resolved);

    // Force a reflow so the browser applies the no-transition override
    // before we remove it, ensuring zero animation frames leak through.
    void document.body.offsetHeight;
    document.head.removeChild(css);
  }, [theme]);

  function setTheme(next: Theme) {
    localStorage.setItem(storageKey, next);
    for (const listener of listeners) {
      listener();
    }
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}
