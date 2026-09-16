import { ImageResponse } from "next/og";
import { site } from "./lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0f16",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "#f5810f",
            }}
          />
          <div style={{ fontSize: 30, color: "#94a3af", letterSpacing: 2 }}>
            FIRM EXPO
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 74,
            fontWeight: 700,
            color: "#f2f5f8",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Where companies digitally expose their innovations
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 32,
            color: "#f5810f",
          }}
        >
          {site.tagline}
        </div>
      </div>
    ),
    size
  );
}
