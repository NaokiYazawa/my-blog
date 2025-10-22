import { env } from "@/env";
import type { SiteConfig } from "@/types";

const site_url = process.env.NGROK_URL || env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "qodio コーディオ",
  description: "Next.js、React、JavaScriptなどのWeb開発技術に関する実践的な記事と学習ガイドを提供するプログラミングブログ",
  url: site_url,
  ogImage: `${site_url}/_static/opengraph-image.jpg`,
  links: {
    twitter: "https://x.com/farstep_",
    github: "https://github.com/qodio-dev/site",
  },
  mailSupport: "support@qodio.dev",
};
