import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { allBooks } from "contentlayer/generated";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// ✅ Node.js Runtime を明示的に指定（OpenNext Cloudflare互換）
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const book = allBooks.find((book) => book.bookSlug === slug);

    if (!book) {
      return new Response("Not found", { status: 404 });
    }

    // Fetch Noto Sans JP font for Japanese text support (Google Fonts official)
    // Using STATIC Bold weight (700) font for better readability in OG images
    // IMPORTANT: The previous variable font URL did not work because ImageResponse (Satori)
    // does not properly support fontWeight changes with variable fonts.
    // This URL is a static Bold (700) only font extracted from Google Fonts API

    // ✅ CLOUDFLARE WORKERS COMPATIBLE: Read logo from filesystem
    // IMPORTANT: In Cloudflare Workers, HTTP fetch to the same origin does not work for static assets
    // because Workers and static assets are handled by different systems.
    // Next.js official docs recommend using fs/promises to read local assets.
    // Reference: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
    const [notoSansJPRes, logoData] = await Promise.all([
      fetch(
        // Static Noto Sans JP Bold (700) ONLY - NOT variable font
        // This static font is required because ImageResponse (Satori engine)
        // does not properly support fontWeight with variable fonts
        "https://fonts.gstatic.com/s/notosansjp/v55/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf"
      ),
      readFile(join(process.cwd(), "public/_static/logo-light.png"), "base64"),
    ]);

    if (!notoSansJPRes.ok) {
      console.error(`Fetch failed: NotoSansJP=${notoSansJPRes.status}`);
      return new Response("Failed to load font", { status: 500 });
    }

    const notoSansJP = await notoSansJPRes.arrayBuffer();

    // Convert logo to base64 Data URL for ImageResponse
    // IMPORTANT: Satori (ImageResponse engine) accepts base64 Data URL for <img> src
    // Official docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
    const logoSrc = `data:image/png;base64,${logoData}`;

    // Dynamic font size based on title length for optimal readability
    const heading =
      book.title.length > 60
        ? `${book.title.substring(0, 60)}...`
        : book.title;

    const fontSize = heading.length > 40 ? "56px" : "72px";

    return new ImageResponse(
      (
        <div
          tw="flex w-full h-full"
          style={{
            border: "36px solid #6366f1",
          }}
        >
          <div
            tw="flex relative flex-col w-full h-full"
            style={{
              background: "#ffffff",
              padding: "80px",
            }}
          >
            {/* Title - Full width, left aligned, top positioned */}
            <div
              tw="flex flex-col"
              style={{
                flex: 1,
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <div
                tw="flex"
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: 700,
                  fontSize,
                  lineHeight: 1.3,
                  color: "#171717",
                  letterSpacing: "-0.01em",
                }}
              >
                {heading}
              </div>
            </div>

            {/* Logo image - Bottom left */}
            <div
              tw="flex"
              style={{
                position: "absolute",
                bottom: "60px",
                left: "80px",
              }}
            >
              <img
                src={logoSrc}
                alt="qodio logo"
                width="180"
                height="46"
              />
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Noto Sans JP",
            data: notoSansJP,
            weight: 700,
            style: "normal",
          },
        ],
      }
    );
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.log(`Failed to generate image: ${errorMessage}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
