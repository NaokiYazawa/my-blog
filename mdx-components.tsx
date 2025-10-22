import type { MDXComponents } from "mdx/types";
import NextImage from "next/image";
import Link from "next/link";
import * as React from "react";
import { MdxCard } from "@/components/content/mdx-card";
import { Callout } from "@/components/shared/callout";
import { CopyButton } from "@/components/shared/copy-button";
import { Mermaid } from "@/components/shared/mermaid";
import { cn } from "@/lib/utils";

// @next/mdx で使用するカスタムコンポーネント
// Next.js 公式ドキュメントに従い、useMDXComponents 関数を export
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className={cn(
          "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn(
          "mt-10 scroll-m-20 border-b pb-1 text-2xl font-bold tracking-tight first:mt-0",
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className={cn(
          "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className={cn(
          "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5
        className={cn(
          "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6
        className={cn(
          "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    a: ({
      className,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={cn("font-medium underline underline-offset-4", className)}
        {...props}
      />
    ),
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p
        className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
      <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({
      className,
      ...props
    }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className={cn(
          "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
          className,
        )}
        {...props}
      />
    ),
    img: ({
      className,
      alt,
      src,
      width,
      height,
    }: React.ImgHTMLAttributes<HTMLImageElement>) => {
      if (!src || typeof src !== "string") return null;

      const imgWidth =
        typeof width === "string" ? parseInt(width, 10) || 800 : width || 800;
      const imgHeight =
        typeof height === "string" ? parseInt(height, 10) || 400 : height || 400;

      return (
        <div className="mt-5 w-full overflow-hidden rounded-lg border">
          <NextImage
            src={src}
            alt={alt || ""}
            width={imgWidth}
            height={imgHeight}
            className={cn("size-full object-cover object-center", className)}
          />
        </div>
      );
    },
    hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
    table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className={cn("w-full", className)} {...props} />
      </div>
    ),
    tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className={cn("m-0 border-t p-0 even:bg-muted", className)}
        {...props}
      />
    ),
    th: ({
      className,
      ...props
    }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
      <th
        className={cn(
          "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    td: ({
      className,
      ...props
    }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
      <td
        className={cn(
          "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    pre: ({
      className,
      __rawString__,
      __isMermaid__,
      __mermaidContent__,
      children,
      ...props
    }: React.HTMLAttributes<HTMLPreElement> & {
      __rawString__?: string;
      __isMermaid__?: boolean;
      __mermaidContent__?: string;
    }) => {
      // Check if this is a mermaid code block
      const codeElement = React.Children.only(children) as React.ReactElement<{
        className?: string;
      }>;
      const isMermaidBlock =
        __isMermaid__ ||
        codeElement?.props?.className?.includes("language-mermaid");

      // Use dedicated mermaid content if available, otherwise fallback to rawString
      const mermaidChart = __mermaidContent__ || __rawString__;

      if (isMermaidBlock && mermaidChart) {
        return <Mermaid chart={mermaidChart} className="my-6" />;
      }

      // エラー表示用のフォールバック
      if (codeElement?.props?.className?.includes("language-mermaid")) {
        return (
          <div className="my-6 p-4 border border-yellow-300 bg-yellow-50 rounded">
            <p className="text-yellow-800 font-medium">Mermaid Detection Issue</p>
            <p className="text-yellow-600 text-sm">
              Detected mermaid block but no content found
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs">Debug Info</summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    __rawString__: !!__rawString__,
                    __mermaidContent__: !!__mermaidContent__,
                    __isMermaid__,
                    mermaidChart: !!mermaidChart,
                  },
                  null,
                  2,
                )}
              </pre>
            </details>
          </div>
        );
      }

      return (
        <div className="group relative w-full overflow-hidden">
          <pre
            className={cn(
              "max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-900 py-4 dark:bg-zinc-900",
              className,
            )}
            {...props}
          >
            {children}
          </pre>
          {__rawString__ && (
            <CopyButton
              value={__rawString__}
              className={cn(
                "absolute right-4 top-4 z-20",
                "duration-250 opacity-0 transition-all group-hover:opacity-100",
              )}
            />
          )}
        </div>
      );
    },
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <code
        className={cn(
          "relative rounded-md border bg-muted px-[0.4rem] py-1 font-mono text-sm text-foreground",
          className,
        )}
        {...props}
      />
    ),
    Callout,
    Card: MdxCard,
    Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={cn(
          "mt-8 scroll-m-20 font-heading text-xl font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    Steps: ({ ...props }) => (
      <div
        className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
        {...props}
      />
    ),
    Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
      <Link
        className={cn("font-medium underline underline-offset-4", className)}
        {...props}
      />
    ),
    LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
      <Link
        className={cn(
          "flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10",
          className,
        )}
        {...props}
      />
    ),
    ...components,
  };
}
