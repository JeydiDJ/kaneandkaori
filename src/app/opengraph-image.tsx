import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import heroPerfume from "@/assets/hero-assets/hero-perfume.png";

export const alt = "Kane & Kaori";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function OpenGraphImage() {
  const heroPerfumeBuffer = await readFile(
    join(process.cwd(), "src", "assets", "hero-assets", "hero-perfume.png"),
  );
  const heroPerfumeUrl = `data:image/png;base64,${heroPerfumeBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at 14% 12%, rgba(255,255,255,0.92), transparent 28%), radial-gradient(circle at 92% 18%, rgba(113,112,108,0.16), transparent 24%), linear-gradient(180deg, #f3ede1 0%, #efe6d7 100%)",
          color: "#18110b",
          padding: "42px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "18px",
            border: "1px solid rgba(255,255,255,0.68)",
            borderRadius: "34px",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.36), rgba(255,255,255,0.12))",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "-30px",
            top: "32px",
            width: "520px",
            height: "520px",
            borderRadius: "999px",
            background: "radial-gradient(circle, rgba(255,255,255,0.66), rgba(255,255,255,0))",
            filter: "blur(12px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "110px",
            width: "260px",
            height: "260px",
            borderRadius: "999px",
            background: "radial-gradient(circle, rgba(113,112,108,0.18), rgba(113,112,108,0))",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "-46px",
            top: "-22px",
            width: "610px",
            height: "610px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.32,
            transform: "rotate(8deg)",
          }}
        >
          <img
            src={heroPerfumeUrl}
            alt=""
            width={heroPerfume.width}
            height={heroPerfume.height}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "blur(5px) saturate(0.95)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "18px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#6f6d69",
            }}
          >
            Kane & Kaori
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 700,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 92,
                lineHeight: 0.94,
                color: "#16100b",
              }}
            >
              Fragrance for
              <br />
              becoming.
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 560,
                fontSize: 28,
                lineHeight: 1.35,
                color: "#6f6d69",
              }}
            >
              Purposeful scents shaped by memory, clarity, and everyday ritual.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "14px 22px",
                borderRadius: "999px",
                background: "#3d3833",
                color: "#f8f3eb",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Explore the collection
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#8f6c3f",
              }}
            >
              kaneandkaori.com
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
