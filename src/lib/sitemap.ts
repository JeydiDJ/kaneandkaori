import { getPublishedBlogPosts } from "@/services/blogService";
import { getProducts } from "@/services/productService";

const SITEMAP_CHUNK_SIZE = 250;

export type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

export type SitemapDocument = {
  path: string;
  updatedAt: string;
  entries: SitemapEntry[];
};

const staticRoutes: SitemapEntry[] = [
  {
    url: "/",
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: "/products",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: "/blog",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: "/about",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: "/contact",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: "/shipping",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: "/returns",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: "/privacy",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: "/terms",
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function chunkEntries<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function getLatestTimestamp(values: Array<string | null | undefined>, fallback: string) {
  const timestamps = values
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).toISOString());

  return timestamps.length > 0 ? timestamps.sort().at(-1) ?? fallback : fallback;
}

export async function getSitemapDocuments(): Promise<SitemapDocument[]> {
  const [products, posts] = await Promise.all([getProducts(), getPublishedBlogPosts()]);
  const fallbackDate = new Date().toISOString();

  const documents: SitemapDocument[] = [
    {
      path: "/sitemaps/pages.xml",
      updatedAt: fallbackDate,
      entries: staticRoutes.map((entry) => ({
        ...entry,
        lastModified: fallbackDate,
      })),
    },
  ];

  const productChunks = chunkEntries(products, SITEMAP_CHUNK_SIZE).flat();
  documents.push({
    path: "/sitemaps/products.xml",
    updatedAt: getLatestTimestamp(
      productChunks.map((product) => product.updatedAt ?? product.createdAt),
      fallbackDate,
    ),
    entries: productChunks.map((product) => ({
      url: `/products/${product.slug}`,
      lastModified: product.updatedAt ?? product.createdAt,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
  });

  const postChunks = chunkEntries(posts, SITEMAP_CHUNK_SIZE).flat();
  documents.push({
    path: "/sitemaps/blog.xml",
    updatedAt: getLatestTimestamp(
      postChunks.map((post) => post.updatedAt ?? post.publishedAt ?? post.createdAt),
      fallbackDate,
    ),
    entries: postChunks.map((post) => ({
      url: `/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt ?? post.createdAt,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  });

  return documents;
}

function toAbsoluteUrl(path: string, baseUrl: string) {
  return new URL(path, baseUrl).toString();
}

export function buildSitemapIndexXml(documents: SitemapDocument[], baseUrl: string) {
  const body = documents
    .map(
      (document) => `  <sitemap>
    <loc>${escapeXml(toAbsoluteUrl(document.path, baseUrl))}</loc>
    <lastmod>${escapeXml(document.updatedAt)}</lastmod>
  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

export function buildSitemapXml(entries: SitemapEntry[], baseUrl: string) {
  const body = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(toAbsoluteUrl(entry.url, baseUrl))}</loc>
    ${entry.lastModified ? `<lastmod>${escapeXml(new Date(entry.lastModified).toISOString())}</lastmod>` : ""}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ""}
    ${typeof entry.priority === "number" ? `<priority>${entry.priority.toFixed(1)}</priority>` : ""}
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}
