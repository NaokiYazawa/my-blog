"use client";

import { usePathname } from "next/navigation";
import { BookHeaderLayout } from "@/components/content/book-header-layout";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const shouldShowHeader = pathname === "/books";

  // カテゴリページ（/books/category/[slug]）では独自のレイアウトを使用
  const isCategoryPage = pathname.match(/^\/books\/category\/[^/]+$/);

  // 章ページ（/books/[slug]/[chapter]）では独自のレイアウトを使用
  const isChapterPage = pathname.match(/^\/books\/[^/]+\/[^/]+$/);

  return (
    <>
      {shouldShowHeader && <BookHeaderLayout />}
      {!isChapterPage && !isCategoryPage ? (
        <MaxWidthWrapper className="pb-6 md:pb-10">
          {children}
        </MaxWidthWrapper>
      ) : (
        children
      )}
    </>
  );
}
