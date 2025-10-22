import type { Book, Chapter } from "contentlayer/generated";
import Link from "next/link";
import BlurImage from "@/components/shared/blur-image";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDate, placeholderBlurhash } from "@/lib/utils";
import Author from "./author";

export function BookDetail({
  book,
  chapters,
}: {
  book: Book & {
    blurDataURL: string;
  };
  chapters: Chapter[];
}) {

  // 複数のカテゴリーに対応
  const category = book.category

  return (
    <div className="space-y-8 pt-6 md:pt-10">
      <div className="flex flex-col space-y-4">
        <time
          dateTime={book.publishDate}
          className="text-sm font-medium text-muted-foreground"
        >
          {formatDate(book.publishDate)}
        </time>
        <div className="flex items-center flex-wrap gap-2">
          <Link
            key={category}
            href={`/articles/category/${category}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "h-8",
            )}
          >
            {category}
          </Link>
        </div>
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl font-bold">
          {book.title}
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          {book.description}
        </p>
        <div className="flex flex-nowrap items-center space-x-5 pt-1 md:space-x-8">
          {book.authors.map((author) => (
            <Author username={author} key={book._id + author} />
          ))}
        </div>
      </div>

      {book.image && (
        <BlurImage
          alt={book.title}
          blurDataURL={book.blurDataURL ?? placeholderBlurhash}
          className="aspect-[1200/630] border object-cover md:rounded-t-xl"
          width={1200}
          height={630}
          priority
          placeholder="blur"
          src={book.image}
          sizes="(max-width: 768px) 770px, 1000px"
        />
      )}

      {chapters.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              目次
            </h2>
            <span className="text-sm text-muted-foreground">
              {chapters.length} chapters
            </span>
          </div>
          <div className="space-y-2">
            {chapters.map((chapter) => (
              <Link
                key={chapter._id}
                href={`/books/${book.bookSlug}/${chapter.chapterSlug}`}
                className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <span className="text-sm font-medium text-muted-foreground">
                  {chapter.order}.
                </span>
                <div>
                  <h3 className="font-semibold">{chapter.title}</h3>
                  {chapter.description && (
                    <p className="text-sm text-muted-foreground">
                      {chapter.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
