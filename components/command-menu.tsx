// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";

import { getAllPosts } from "@/src/lib/content";

type CommandMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CommandMenuContext = createContext<CommandMenuContextValue>({
  open: false,
  setOpen: () => {},
});

export function useCommandMenu() {
  return useContext(CommandMenuContext);
}

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <CommandMenuContext value={{ open, setOpen }}>
      {children}
      <CommandMenuDialog open={open} onOpenChange={setOpen} />
    </CommandMenuContext>
  );
}

function CommandMenuDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const posts = getAllPosts();

  function go(to: string) {
    onOpenChange(false);
    void navigate({ to });
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command menu"
      className="cmdk-dialog"
      loop
    >
      <div className="cmdk-overlay" onClick={() => onOpenChange(false)} />

      <div className="cmdk-panel">
        <Command.Input placeholder="Where to?" />

        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Pages">
            <Command.Item onSelect={() => go("/")}>Home</Command.Item>
          </Command.Group>

          <Command.Group heading="Writing">
            {posts.map((post) => (
              <Command.Item
                key={post.slug}
                value={`${post.title} ${post.description}`}
                onSelect={() => go(`/blog/${post.slug}`)}
              >
                <span className="cmdk-item-title">{post.title}</span>
                <span className="cmdk-item-subtitle">{post.description}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Links">
            <Command.Item
              onSelect={() => window.open("https://github.com/windsornguyen", "_blank")}
            >
              GitHub
            </Command.Item>
            <Command.Item onSelect={() => window.open("https://x.com/windsornguyen", "_blank")}>
              Twitter / X
            </Command.Item>
            <Command.Item
              onSelect={() => window.open("https://www.linkedin.com/in/windsornguyen", "_blank")}
            >
              LinkedIn
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
