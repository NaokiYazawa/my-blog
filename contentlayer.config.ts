import {
  type ComputedFields,
  defineDocumentType,
  makeSource,
} from "contentlayer2/source-files";

const defaultComputedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
  images: {
    type: "list",
    resolve: (doc) => {
      return (
        doc.body.raw.match(/(?<=<Image[^>]*\bsrc=")[^"]+(?="[^>]*\/>)/g) || []
      );
    },
  },
};

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "articles/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    date: {
      type: "date",
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
    image: {
      type: "string",
      required: true,
    },
    authors: {
      type: "list",
      of: { type: "string" },
      required: true,
    },
    categories: {
      type: "list",
      of: {
        type: "enum",
        options: ["nextjs", "supabase", "ddd", "ai"],
      },
      required: true,
    },
    related: {
      type: "list",
      of: {
        type: "string",
      },
    },
  },
  computedFields: defaultComputedFields,
}));

export const Book = defineDocumentType(() => ({
  name: "Book",
  filePathPattern: "books/*/index.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    image: {
      type: "string",
      required: true,
    },
    authors: {
      type: "list",
      of: { type: "string" },
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
    publishDate: {
      type: "date",
      required: true,
    },
    category: {
      type: "enum",
      options: ["free", "paid"],
      default: "programming",
    },
  },
  computedFields: {
    ...defaultComputedFields,
    bookSlug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[1],
    },
  },
}));

export const Chapter = defineDocumentType(() => ({
  name: "Chapter",
  filePathPattern: "books/*/chapters/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    order: {
      type: "number",
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
  },
  computedFields: {
    ...defaultComputedFields,
    bookSlug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[1],
    },
    chapterSlug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop(),
    },
  },
}));

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: "pages/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
  },
  computedFields: defaultComputedFields,
}));

// MDX 処理は @next/mdx が行うため、mdx オプションを削除
// contentlayer はメタデータと型生成のみに使用
export default makeSource({
  contentDirPath: "./src/content",
  documentTypes: [Page, Post, Book, Chapter],
});
