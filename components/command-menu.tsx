import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";

import { getAllPosts } from "@/src/content/contentManifest";

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

  const itemClass =
    "cursor-pointer rounded-lg px-3 py-2 text-[14px] text-gray-700 data-[selected=true]:bg-cream-dark data-[selected=true]:text-gray-900";

  const groupHeadingClass =
    "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-gray-400";

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command menu"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
    >
      <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange(false)} />

      <div className="bg-cream relative w-full max-w-[480px] rounded-xl border border-gray-200 shadow-2xl">
        <Command.Input
          placeholder="Search..."
          className="w-full border-b border-gray-100 bg-transparent px-4 py-3 text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
        />

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="px-4 py-6 text-center text-[13px] text-gray-400">
            No results.
          </Command.Empty>

          <Command.Group heading="Pages" className={groupHeadingClass}>
            <Command.Item onSelect={() => go("/")} className={itemClass}>
              Home
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Writing" className={groupHeadingClass}>
            {posts.map((post) => (
              <Command.Item
                key={post.slug}
                value={`${post.title} ${post.description}`}
                onSelect={() => go(`/blog/${post.slug}`)}
                className={itemClass}
              >
                <div className="font-medium">{post.title}</div>
                <div className="text-[12px] text-gray-400">{post.description}</div>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Links" className={groupHeadingClass}>
            <Command.Item
              onSelect={() => window.open("https://github.com/windsornguyen", "_blank")}
              className={itemClass}
            >
              GitHub
            </Command.Item>
            <Command.Item
              onSelect={() => window.open("https://x.com/windsornguyen", "_blank")}
              className={itemClass}
            >
              Twitter / X
            </Command.Item>
            <Command.Item
              onSelect={() => window.open("https://www.linkedin.com/in/windsornguyen", "_blank")}
              className={itemClass}
            >
              LinkedIn
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="border-t border-gray-100 px-4 py-2 text-[11px] text-gray-400">
          <kbd className="bg-cream-dark rounded px-1.5 py-0.5 font-mono text-[10px]">esc</kbd> to
          close
        </div>
      </div>
    </Command.Dialog>
  );
}
