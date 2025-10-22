import { allBooks } from "contentlayer/generated";
import { BookList } from "@/components/content/book-list";
import { constructMetadata, getBlurDataURL } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Books – SaaS Starter",
  description: "Comprehensive guides and books from Next SaaS Starter.",
});

export default async function BooksPage() {
  const publishedBooks = allBooks
    .filter((book) => book.published)
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));

  const books = await Promise.all(
    publishedBooks.map(async (book) => ({
      ...book,
      blurDataURL: await getBlurDataURL(book.image),
    })),
  );

  return <BookList books={books} />;
}
