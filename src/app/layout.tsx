import "./globals.css";

import type { Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { fontGeist, fontHeading, fontInter, fontSans } from "@/assets/fonts";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { cn, constructMetadata } from "@/lib/utils";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  ...constructMetadata(),
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

export default function RootLayout({ children }: RootLayoutProps) {
  // JSON-LD structured data for Organization
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "qodio コーディオ",
    url: siteConfig.url,
    logo: `${siteConfig.url}/_static/logo-light.png`,
    sameAs: [siteConfig.links.twitter, siteConfig.links.github],
  };

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\u003c'),
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontInter.variable,
          fontHeading.variable,
          fontGeist.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
