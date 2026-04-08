import { buildSitemapXml, getSitemapDocuments } from "@/lib/sitemap";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  const documents = await getSitemapDocuments();
  const document = documents.find((item) => item.path === "/sitemaps/pages.xml");

  if (!document) {
    return new Response("Not found", { status: 404 });
  }

  const baseUrl = new URL(request.url).origin;
  const xml = buildSitemapXml(document.entries, baseUrl);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
