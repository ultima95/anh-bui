import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

async function loadGoogleFont(
  family: string,
  weight: number
): Promise<ArrayBuffer> {
  const params = new URLSearchParams({
    family: `${family}:wght@${weight}`,
    display: "swap",
  });
  const css = await fetch(
    `https://fonts.googleapis.com/css2?${params}`,
    { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64)" } }
  ).then((r) => r.text());

  const fontUrl = css.match(/src: url\((.+?)\) format\(['"](?:woff2|truetype)['"]\)/)?.[1];
  if (!fontUrl) throw new Error(`Failed to load font: ${family} ${weight}`);

  return fetch(fontUrl).then((r) => r.arrayBuffer());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim() || "Anh Bui";
  const description =
    searchParams.get("description")?.trim() || "Frontend Developer";

  try {
    const [archivoBold, spaceGroteskRegular] = await Promise.all([
      loadGoogleFont("Archivo", 700),
      loadGoogleFont("Space Grotesk", 400),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
            backgroundColor: "#0a0a0a",
            position: "relative",
          }}
        >
          {/* Site name — top left */}
          <div
            style={{
              position: "absolute",
              top: "48px",
              left: "80px",
              fontSize: "18px",
              color: "#6b7280",
              fontFamily: "Space Grotesk",
              letterSpacing: "0.05em",
            }}
          >
            Anh Bui
          </div>

          {/* Page title */}
          <div
            style={{
              fontSize: "68px",
              fontWeight: 700,
              color: "#f9fafb",
              lineHeight: 1.1,
              maxWidth: "950px",
              fontFamily: "Archivo",
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              marginTop: "28px",
              fontSize: "28px",
              color: "#9ca3af",
              fontFamily: "Space Grotesk",
              maxWidth: "800px",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {description}
          </div>

          {/* Bottom accent bar */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              height: "4px",
              backgroundColor: "#6366f1",
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Archivo", data: archivoBold, weight: 700 },
          { name: "Space Grotesk", data: spaceGroteskRegular, weight: 400 },
        ],
      }
    );
  } catch {
    // Font loading failed (e.g. network issue) — return a no-font fallback
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
            backgroundColor: "#0a0a0a",
            position: "relative",
          }}
        >
          <div style={{ fontSize: "68px", fontWeight: 700, color: "#f9fafb", lineHeight: 1.1, maxWidth: "950px" }}>
            {title}
          </div>
          <div style={{ marginTop: "28px", fontSize: "28px", color: "#9ca3af", maxWidth: "800px", lineHeight: 1.5 }}>
            {description}
          </div>
          <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", height: "4px", backgroundColor: "#6366f1" }} />
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}

