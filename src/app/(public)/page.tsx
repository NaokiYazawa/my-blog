import { allPosts } from "contentlayer/generated";
import { ArticleHeaderLayout } from "@/components/content/article-header-layout";
import { Articles } from "@/components/content/blog-posts";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { constructMetadata, getBlurDataURL } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "qodio コーディオ",
  description: "Comprehensive articles and guides from Next SaaS Starter.",
});

export default async function IndexPage() {
  const posts = await Promise.all(
    allPosts
      .filter((post) => post.published)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image),
      })),
  );

  return (
    <>
      <ArticleHeaderLayout />
      <MaxWidthWrapper className="pb-16">
        <Articles posts={posts} />
      </MaxWidthWrapper>
    </>
  );
}
