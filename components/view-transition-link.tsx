// Copyright (c) 2026 Windsor Nguyen. MIT License.

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

import { useNavigate } from "@tanstack/react-router";

type ViewTransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  to: string;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
};

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.shiftKey
  );
}

export default function ViewTransitionLink({
  children,
  onClick,
  target,
  to,
  ...props
}: ViewTransitionLinkProps) {
  const navigate = useNavigate();

  return (
    <a
      href={to}
      target={target}
      {...props}
      onClick={(event) => {
        onClick?.(event);

        if (!isPlainLeftClick(event) || target === "_blank") {
          return;
        }

        event.preventDefault();

        const runNavigation = () => {
          void navigate({ to });
        };

        const viewTransitionDocument = document as ViewTransitionDocument;

        if (viewTransitionDocument.startViewTransition) {
          viewTransitionDocument.startViewTransition(runNavigation);
          return;
        }

        runNavigation();
      }}
    >
      {children}
    </a>
  );
}
