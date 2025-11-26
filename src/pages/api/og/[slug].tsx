import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const config = {
  runtime: "edge",
}

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const title = searchParams.get("title") || "Narkin's Builders Blog"
    const date = searchParams.get("date") || ""
    const readTime = searchParams.get("readTime") || "5 min read"

    // Format date
    const formattedDate = date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : ""

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundImage: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          padding: "60px 80px",
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "-0.02em",
            }}
          >
            Narkin's Builders
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#94a3b8",
              fontWeight: 400,
            }}
          >
            Real Estate Blog
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            maxWidth: "900px",
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
              margin: 0,
              textShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Footer Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
            color: "#cbd5e1",
            fontSize: 24,
          }}
        >
          {formattedDate && (
            <>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span>📅</span>
                <span>{formattedDate}</span>
              </div>
              <div style={{ color: "#64748b" }}>•</div>
            </>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>⏱️</span>
            <span>{readTime}</span>
          </div>
          <div style={{ color: "#64748b" }}>•</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#3b82f6",
              padding: "8px 20px",
              borderRadius: "8px",
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            Bahria Town Karachi
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error("OG Image generation error:", e.message)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
