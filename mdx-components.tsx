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
      className="mt-5 mb-1 text-base font-medium text-gray-800"
      style={{ letterSpacing: "-0.02em" }}
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3
      className="mt-4 mb-1 text-sm font-medium text-gray-800"
      style={{ letterSpacing: "-0.01em" }}
      {...props}
    />
  ),
  h4: (props: HeadingProps) => <h4 className="text-sm font-medium" {...props} />,
  p: (props: ParagraphProps) => (
    <p
      className="mt-0.5 text-[15px] leading-relaxed text-gray-600"
      style={{ letterSpacing: "-0.011em" }}
      {...props}
    />
  ),
  ol: (props: ListProps) => (
    <ol className="list-decimal space-y-0.5 pl-5 text-[15px] text-gray-600" {...props} />
  ),
  ul: (props: ListProps) => (
    <ul className="list-disc space-y-0.5 pl-5 text-[15px] text-gray-600" {...props} />
  ),
  li: (props: ListItemProps) => <li className="pl-0.5" {...props} />,
  em: (props: ComponentPropsWithoutRef<"em">) => <em className="font-medium" {...props} />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-gray-800" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className =
      "text-gray-900 underline decoration-gray-300 underline-offset-2 transition-colors hover:decoration-gray-500";
    if (href?.startsWith("/")) {
      return (
        <ViewTransitionLink to={href} className={className} {...props}>
          {children}
        </ViewTransitionLink>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
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
    <blockquote className="ml-[0.075em] border-l-2 border-gray-200 pl-4 text-gray-500" {...props} />
  ),
};
