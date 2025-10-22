import { allBooks, allChapters, allPosts } from "contentlayer/generated";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${siteConfig.url}${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const books = allBooks
    .filter((book) => book.published)
    .map((book) => ({
      url: `${siteConfig.url}/books/${book.bookSlug}`,
      lastModified: new Date(book.publishDate),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const chapters = allChapters
    .filter((chapter) => chapter.published)
    .map((chapter) => {
      // Get the book's publish date for this chapter
      const book = allBooks.find((b) => b.bookSlug === chapter.bookSlug);
      const lastModified = book ? new Date(book.publishDate) : new Date();

      return {
        url: `${siteConfig.url}/books/${chapter.bookSlug}/${chapter.chapterSlug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/books`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...posts,
    ...books,
    ...chapters,
  ];
}
