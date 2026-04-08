import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/cart", "/studio", "/studio/", "/api/"],
      },
    ],
    sitemap: "/sitemap.xml",
  };
}
