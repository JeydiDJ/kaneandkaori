import type { MetadataRoute } from "next";

import { getAbsoluteUrl } from "@/lib/seo";
import { getProducts } from "@/services/productService";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/products",
    "/about",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
    "/contact",
  ];

  const staticRoutes = routes.map((route) => ({
    url: getAbsoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" as const : "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  try {
    const products = await getProducts();
    const productRoutes = products.map((product) => ({
      url: getAbsoluteUrl(`/products/${product.slug}`),
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: product.featured ? 0.9 : 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("Failed to build dynamic sitemap entries", error);
    return staticRoutes;
  }
}
