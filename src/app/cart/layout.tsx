import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cart | Kane & Kaori",
  description: "Review your selected fragrances and prepare for checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
