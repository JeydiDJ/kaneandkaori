import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ProductDetails } from "@/components/products/ProductDetails";
import { buildMetadata, getAbsoluteUrl } from "@/lib/seo";
import { getProductById } from "@/services/productService";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return buildMetadata({
      title: "Product Not Found | Kane & Kaori",
      description: "The requested fragrance could not be found.",
      path: "/products",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${product.name} | Kane & Kaori`,
    description: product.description,
    path: `/products/${product.slug}`,
    images: [product.image],
    keywords: [product.name, product.category, ...product.notes, "fragrance", "perfume"],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  if (id !== product.slug) {
    redirect(`/products/${product.slug}`);
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image],
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "Kane & Kaori",
    },
    offers: {
      "@type": "Offer",
      url: getAbsoluteUrl(`/products/${product.slug}`),
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.inventory > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <section className="section-wrap">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetails product={product} />
    </section>
  );
}
