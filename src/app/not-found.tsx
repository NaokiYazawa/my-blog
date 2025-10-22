import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mx-4 mt-4 text-center font-semibold">
        このページはすでに削除されているか、URLが間違っている可能性があります。
      </p>
      <Image
        src="/_static/illustrations/rocket-crashed.svg"
        alt="404"
        width={400}
        height={400}
        className="pointer-events-none mb-8 mt-6 dark:invert"
      />
      <Button asChild size="lg" variant="outline" className="rounded-full">
        <Link href="/">トップへ戻る</Link>
      </Button>
    </div>
  );
}
