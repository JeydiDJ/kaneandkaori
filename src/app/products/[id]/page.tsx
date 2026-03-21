import { notFound } from "next/navigation";

import { ProductDetails } from "@/components/products/ProductDetails";
import { getProductById } from "@/services/productService";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

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
