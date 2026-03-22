import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | Kane & Kaori",
  description: "Review your selected fragrances and prepare for checkout.",
};

export default function CartLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
