import type { Book } from "contentlayer/generated";

import { BookCard } from "./book-card";

export function BookList({
  books,
}: {
  books: (Book & {
    blurDataURL: string;
  })[];
}) {
  return (
    <main className="space-y-8">
      <BookCard data={books[0]} horizontale priority />

      <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
        {books.slice(1).map((book, idx) => (
          <BookCard data={book} key={book._id} priority={idx <= 2} />
        ))}
      </div>
    </main>
  );
}
