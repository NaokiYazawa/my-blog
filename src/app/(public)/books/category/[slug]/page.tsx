import { allBooks } from "contentlayer/generated";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/content/book-card";
import { BOOK_CATEGORIES } from "@/config/books";
import { constructMetadata, getBlurDataURL } from "@/lib/utils";

export async function generateStaticParams() {
  return BOOK_CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const category = BOOK_CATEGORIES.find(
    (category) => category.slug === slug,
  );
  if (!category) {
    return;
  }

  const { title, description } = category;

  return constructMetadata({
    title: `${title} Books – qodio`,
    description,
  });
}

export default async function BookCategory({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const category = BOOK_CATEGORIES.find((ctg) => ctg.slug === slug);

  if (!category) {
    notFound();
  }

  const books = await Promise.all(
    allBooks
      .filter((book) => book.category === category.slug && book.published)
      .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
      .map(async (book) => ({
        ...book,
        blurDataURL: await getBlurDataURL(book.image),
      })),
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book, idx) => (
        <BookCard key={book._id} data={book} priority={idx <= 2} />
      ))}
    </div>
  );
}
