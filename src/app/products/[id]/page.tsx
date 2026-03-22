import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetails } from "@/components/products/ProductDetails";
import { getProductById } from "@/services/productService";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Kane & Kaori",
      description: "The requested fragrance could not be found.",
    };
  }

  return {
    title: `${product.name} | Kane & Kaori`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Kane & Kaori`,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <section className="section-wrap">
      <ProductDetails product={product} />
    </section>
  );
}
