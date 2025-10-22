import { BookHeaderLayout } from "@/components/content/book-header-layout";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function BookCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BookHeaderLayout />
      <MaxWidthWrapper className="pb-16">{children}</MaxWidthWrapper>
    </>
  );
}
