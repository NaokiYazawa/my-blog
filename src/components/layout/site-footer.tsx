import Link from "next/link";
import type * as React from "react";
import { ModeToggle } from "@/components/layout/mode-toggle";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      <MaxWidthWrapper className="py-5">
        <div className="container mx-auto flex max-w-6xl items-center justify-between">
          <p className="text-left text-sm text-muted-foreground">
            &copy; 2025 <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              farstep
            </Link>
          </p>
          <ModeToggle />
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
