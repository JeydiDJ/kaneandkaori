import { ImageResponse } from "next/og";

export const alt = "Kane & Kaori";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at top left, rgba(248,232,205,0.95), rgba(218,195,154,0.72) 35%, rgba(44,30,20,0.98) 100%)",
          color: "#fff8ef",
          padding: "72px",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "28px",
            border: "1px solid rgba(255, 248, 239, 0.22)",
            borderRadius: "36px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "rgba(255, 248, 239, 0.78)",
            }}
          >
            Kane & Kaori
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
            <div style={{ fontSize: 82, lineHeight: 0.95 }}>Fragrance for becoming.</div>
            <div style={{ fontSize: 28, lineHeight: 1.35, color: "rgba(255, 248, 239, 0.82)" }}>
              Purposeful scents shaped by memory, ritual, and quiet transformation.
            </div>
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(255, 248, 239, 0.7)",
            }}
          >
            kaneandkaori.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
