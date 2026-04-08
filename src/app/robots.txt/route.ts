export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  const body = `User-agent: *
Allow: /
Disallow: /checkout
Disallow: /cart
Disallow: /studio
Disallow: /studio/
Disallow: /api/

Sitemap: ${origin}/main-sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
