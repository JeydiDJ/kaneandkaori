import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Studio Login | Kane & Kaori",
  description: "Private login for the Kane & Kaori studio team.",
  path: "/studio/login",
  noIndex: true,
});

export default function StudioLoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
