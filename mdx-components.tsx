// Copyright (c) 2026 Windsor Nguyen. MIT License.

import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import { highlight } from "sugar-high";

import Code from "@/components/code";
import ViewTransitionLink from "@/components/view-transition-link";

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;

const linkClass =
  "underline decoration-link-line underline-offset-2 transition-colors hover:decoration-link-line-hover";

export const mdxComponents: MDXComponents = {
  Code,
  h1: (props: HeadingProps) => (
    <h1
      className="transition-element mb-0 text-2xl font-medium tracking-tight"
      style={{ letterSpacing: "-0.04em" }}
      {...props}
    />
  ),
  h2: (props: HeadingProps) => (
    <h2
      className="text-fg-emphasis mt-5 mb-1 text-base font-medium"
      style={{ letterSpacing: "-0.02em" }}
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3
      className="text-fg-emphasis mt-4 mb-1 text-sm font-medium"
      style={{ letterSpacing: "-0.01em" }}
      {...props}
    />
  ),
  h4: (props: HeadingProps) => <h4 className="text-sm font-medium" {...props} />,
  p: (props: ParagraphProps) => (
    <p
      className="text-body text-fg-secondary mt-4 leading-relaxed"
      style={{ letterSpacing: "-0.011em" }}
      {...props}
    />
  ),
  ol: (props: ListProps) => (
    <ol className="text-body text-fg-secondary list-decimal space-y-0.5 pl-5" {...props} />
  ),
  ul: (props: ListProps) => (
    <ul className="text-body text-fg-secondary list-disc space-y-0.5 pl-5" {...props} />
  ),
  li: (props: ListItemProps) => <li className="pl-0.5" {...props} />,
  em: (props: ComponentPropsWithoutRef<"em">) => <em className="font-medium" {...props} />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="text-fg-emphasis font-semibold" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    if (href?.startsWith("/")) {
      return (
        <ViewTransitionLink to={href} className={linkClass} {...props}>
          {children}
        </ViewTransitionLink>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={linkClass} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass} {...props}>
        {children}
      </a>
    );
  },
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
    const codeHTML = highlight(children as string);
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
  Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
    <table>
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote className="border-edge text-fg-muted ml-[0.075em] border-l-2 pl-4" {...props} />
  ),
  small: (props: ComponentPropsWithoutRef<"small">) => (
    <small
      className="text-caption text-fg-muted [&>p]:text-caption [&>p]:text-fg-muted my-3 block italic [&>p]:italic"
      {...props}
    />
  ),
};
