import { ArticleHeaderLayout } from "@/components/content/article-header-layout";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function ArticleCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ArticleHeaderLayout />
      <MaxWidthWrapper className="pb-16">{children}</MaxWidthWrapper>
    </>
  );
}
