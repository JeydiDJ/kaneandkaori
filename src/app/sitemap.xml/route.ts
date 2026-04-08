import { buildSitemapIndexXml, getSitemapDocuments } from "@/lib/sitemap";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  const documents = await getSitemapDocuments();
  const baseUrl = new URL(request.url).origin;
  const xml = buildSitemapIndexXml(documents, baseUrl);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
