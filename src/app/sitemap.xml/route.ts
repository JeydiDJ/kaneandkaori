import { buildSitemapIndexXml, getSitemapDocuments } from "@/lib/sitemap";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const documents = await getSitemapDocuments();
  const xml = buildSitemapIndexXml(documents);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
