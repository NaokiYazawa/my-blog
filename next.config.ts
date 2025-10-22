import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

const nextConfig: NextConfig = {
  /* config options here */

  // MDX ファイルをページとして認識
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // Disable CSS minification to fix Tailwind CSS v4 compatibility issue
  // cssnano-simple in Next.js 15.5.3 doesn't support Tailwind v4's new syntax
  // (@custom-variant, @theme inline, etc.)
  experimental: {
    optimizeCss: false, // Disable CSS optimization
  },

  webpack: (config, { dev, isServer }) => {
    // Disable CSS minification in production to avoid cssnano compatibility issues
    // while keeping JavaScript minification enabled
    if (!dev && !isServer) {
      config.optimization.minimizer = config.optimization.minimizer?.filter(
        (minimizer: any) =>
          !minimizer.constructor.name.includes("CssMinimizerPlugin")
      );
    }
    return config;
  },
};

// @next/mdx の設定（contentlayer から移行）
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkGfm, remarkBreaks],
    rehypePlugins: [
      rehypeSlug,
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;

            if (codeEl.tagName !== "code") return;

            const codeContent = codeEl.children?.[0].value;
            const className = codeEl.properties?.className?.[0];

            // Store raw content for all code blocks
            node.__rawString__ = codeContent;

            // Mark Mermaid blocks for special handling
            if (className === "language-mermaid") {
              node.__isMermaid__ = true;
              node.__mermaidContent__ = codeContent;
            }
          }
        });
      },
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: false,
          filterMetaString: (string: string) =>
            string.replace(/filename="[^"]*"/, ""),
          onVisitLine(
            node: Node & { children: Array<{ type: string; value: string }> },
          ) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(
            node: Node & { properties: { className?: string[] } },
          ) {
            if (!node.properties.className) {
              node.properties.className = [];
            }
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(
            node: Node & { properties: { className?: string[] } },
          ) {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "figure") {
            if (!("data-rehype-pretty-code-figure" in node.properties)) {
              return;
            }

            const preElement = node.children.at(-1);
            if (preElement.tagName !== "pre") {
              return;
            }

            // Transfer all stored properties to the final pre element
            preElement.properties.__rawString__ = node.__rawString__;
            if (node.__isMermaid__) {
              preElement.properties.__isMermaid__ = true;
              preElement.properties.__mermaidContent__ =
                node.__mermaidContent__;
            }
          }
        });
      },
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});

// contentlayer と @next/mdx の両方を適用
export default withContentlayer(withMDX(nextConfig));
