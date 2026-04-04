import { NextResponse } from "next/server";

import sitemap from "@/app/sitemap";

export const revalidate = 3600;

export async function GET() {
  const entries = await sitemap();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>${[
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${new Date(entry.lastModified ?? new Date()).toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency ?? "weekly"}</changefreq>
    <priority>${entry.priority ?? 0.7}</priority>
  </url>`,
    ),
    "</urlset>",
  ].join("")}`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
