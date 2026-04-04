import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Studio | Kane & Kaori",
  description: "Private admin area for Kane & Kaori operations.",
  path: "/studio",
  noIndex: true,
});

export default function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
