import { allBooks, allChapters } from "contentlayer/generated";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// ✅ Node.js Runtime を明示的に指定（OpenNext Cloudflare互換）
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; chapter: string }> }
) {
  try {
    const { slug, chapter: chapterSlug } = await params;
    const chapter = allChapters.find(
      (ch) => ch.bookSlug === slug && ch.chapterSlug === chapterSlug
    );

    if (!chapter) {
      return new Response("Not found", { status: 404 });
    }

    const book = allBooks.find((book) => book.bookSlug === slug);

    if (!book) {
      return new Response("Book not found", { status: 404 });
    }

    // Fetch Noto Sans JP font for Japanese text support (Google Fonts official)
    // Using STATIC Bold weight (700) font for better readability in OG images
    // IMPORTANT: The previous variable font URL did not work because ImageResponse (Satori)
    // does not properly support fontWeight changes with variable fonts.
    // This URL is a static Bold (700) only font extracted from Google Fonts API
    // Fetch logo from public URL (OpenNext Cloudflare compatible)
    // Using light logo for light background OG image
    const origin = new URL(request.url).origin;
    const logoUrl = `${origin}/_static/logo-light.png`;

    const [notoSansJPRes, logoRes] = await Promise.all([
      fetch(
        // Static Noto Sans JP Bold (700) ONLY - NOT variable font
        // This static font is required because ImageResponse (Satori engine)
        // does not properly support fontWeight with variable fonts
        "https://fonts.gstatic.com/s/notosansjp/v55/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf"
      ),
      fetch(logoUrl),
    ]);

    if (!notoSansJPRes.ok || !logoRes.ok) {
      console.error(
        `Fetch failed: NotoSansJP=${notoSansJPRes.status}, Logo=${logoRes.status}`
      );
      return new Response("Failed to load resources", { status: 500 });
    }

    const notoSansJP = await notoSansJPRes.arrayBuffer();
    const logoBuffer = await logoRes.arrayBuffer();

    // Convert logo to base64 Data URL for ImageResponse
    // IMPORTANT: Satori (ImageResponse engine) requires base64 Data URL for <img> src
    // Official docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
    const logoBase64 = Buffer.from(logoBuffer).toString("base64");
    const logoSrc = `data:image/png;base64,${logoBase64}`;

    // Dynamic font size based on title length for optimal readability
    // Book title: smaller, gray, provides context
    const bookTitle =
      book.title.length > 40
        ? `${book.title.substring(0, 40)}...`
        : book.title;

    // Chapter title: larger, black, main content
    const chapterHeading =
      chapter.title.length > 60
        ? `${chapter.title.substring(0, 60)}...`
        : chapter.title;

    const chapterFontSize = chapterHeading.length > 40 ? "56px" : "72px";

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
            {/* Titles: Book (context) + Chapter (main) with visual hierarchy */}
            <div
              tw="flex flex-col"
              style={{
                flex: 1,
                justifyContent: "flex-start",
                width: "100%",
                gap: "20px",
              }}
            >
              {/* Book Title - Context (smaller, gray) */}
              <div
                tw="flex"
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: 700,
                  fontSize: "28px",
                  lineHeight: 1.4,
                  color: "#71717a",
                  letterSpacing: "-0.01em",
                }}
              >
                {bookTitle}
              </div>

              {/* Chapter Title - Main Content (larger, black) */}
              <div
                tw="flex"
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: 700,
                  fontSize: chapterFontSize,
                  lineHeight: 1.3,
                  color: "#171717",
                  letterSpacing: "-0.01em",
                }}
              >
                {chapterHeading}
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
