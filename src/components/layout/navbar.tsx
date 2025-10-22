"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/layout/mode-toggle";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { marketingConfig } from "@/config/marketing";
import { useMounted } from "@/hooks/use-mounted";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

type NavBarProps = {
  scroll?: boolean;
  large?: boolean;
};

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  const links = marketingConfig.mainNav;

  const isDark = mounted && resolvedTheme === 'dark';
  const logoSrc = isDark ? '/_static/logo-dark.png' : '/_static/logo-light.png';
  const logoWidth = isDark ? 995 : 992;
  const logoHeight = 251;
  const logoAspectRatio = `${logoWidth}/${logoHeight}`;

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
        }`}
    >
      <MaxWidthWrapper className="flex h-14 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-1.5 ">
            <Image
              src={logoSrc}
              alt="logo"
              width={logoWidth}
              height={logoHeight}
              className="h-7 w-auto"
              style={{ aspectRatio: logoAspectRatio }}
            />
          </Link>

          {links && links.length > 0 ? (
            <nav className="gap-6 flex">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-sm",
                    (
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    )
                      ? "text-foreground"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center space-x-3">
          <ModeToggle />
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
