export const BLOG_CATEGORIES: {
  title: string;
  slug: "nextjs" | "supabase" | "ddd" | "ai";
}[] = [
  {
    title: "Next.js",
    slug: "nextjs",
  },
  {
    title: "Supabase",
    slug: "supabase",
  },
  {
    title: "DDD",
    slug: "ddd",
  },
  {
    title: "AI",
    slug: "ai",
  },
];

export const BLOG_AUTHORS: Record<
  string,
  {
    name: string;
    image: string;
    twitter: string;
  }
> = {
  kai: {
    name: "farstep",
    image: "/_static/avatars/farstep.png",
    twitter: "farstep_",
  },
};
