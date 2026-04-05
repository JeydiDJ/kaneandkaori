import type { Metadata } from "next";
import Link from "next/link";

import { buildMetadata, getAbsoluteUrl } from "@/lib/seo";
import { getPublishedBlogPosts } from "@/services/blogService";

export const metadata: Metadata = buildMetadata({
  title: "Blog | Kane & Kaori",
  description:
    "Explore Kane & Kaori's editorial journal on fragrance, ritual, presence, and the details that shape how scent lives in everyday life.",
  path: "/blog",
  keywords: [
    "perfume blog",
    "fragrance journal",
    "perfume projection",
    "fragrance ritual",
    "Kane and Kaori blog",
  ],
});

function formatDate(value: string | null) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const [featuredPost, ...remainingPosts] = posts;
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Kane & Kaori Blog",
    description:
      "Editorial writing on fragrance, ritual, presence, and the details that shape how scent lives in everyday life.",
    url: getAbsoluteUrl("/blog"),
    publisher: {
      "@type": "Organization",
      name: "Kane & Kaori",
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: getAbsoluteUrl(`/blog/${post.slug}`),
    })),
  };

  return (
    <div className="relative overflow-hidden">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-8 h-64 w-64 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute right-[-4rem] top-40 h-72 w-72 rounded-full bg-[rgba(113,112,108,0.16)] blur-3xl" />
        <div className="absolute bottom-16 left-1/3 h-56 w-56 rounded-full bg-white/40 blur-3xl" />
      </div>

      <section className="section-wrap relative">
        <div className="rounded-[2.4rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.65),rgba(255,255,255,0.22))] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10 md:p-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Journal</p>
              <h1 className="display-font mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
                Notes on fragrance,
                <br />
                ritual, and presence.
              </h1>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            The Kane & Kaori journal explores the details that shape fragrance in real life, from projection and wear to memory, mood, and everyday ritual.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {featuredPost ? (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-[#3d3833] bg-[#3d3833] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-[#f8f3eb] shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-all duration-200 hover:border-black hover:bg-black hover:text-white sm:px-7 sm:py-3"
              >
                Read the feature
              </Link>
            ) : null}
            <Link
              href="/contact"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-[#b99667] bg-transparent px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-[#8f6c3f] transition-all duration-200 hover:border-[#cda87a] hover:bg-[#cda87a] hover:text-[#18110b] sm:px-7 sm:py-3"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {featuredPost ? (
        <section className="section-wrap relative pt-0">
          <article className="overflow-hidden rounded-[2.5rem] border border-white/75 bg-[linear-gradient(150deg,rgba(255,255,255,0.72),rgba(243,237,225,0.38))] shadow-[0_32px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-[linear-gradient(180deg,rgba(0,0,0,0.92),rgba(61,56,51,0.88))] p-8 text-[#f3ede1] sm:p-10 md:p-12">
                <h2 className="display-font text-4xl leading-tight sm:text-5xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-5 max-w-xl leading-8 text-[#e9decd]">{featuredPost.excerpt}</p>
                <div className="mt-8 flex flex-wrap gap-4 text-sm uppercase tracking-[0.16em] text-[#cfbea1]">
                  <span>{formatDate(featuredPost.publishedAt)}</span>
                  <span>{featuredPost.authorName}</span>
                </div>
              </div>

              <div className="grid gap-6 p-8 sm:p-10 md:p-12">
                <div className="rounded-[1.8rem] border border-[var(--border)] bg-white/70 p-6">
                  <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">Featured article</p>
                  <p className="mt-4 text-base leading-8 text-[var(--muted)]">
                    {featuredPost.seoDescription || featuredPost.excerpt}
                  </p>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="mt-6 inline-flex text-sm font-semibold text-[var(--foreground)] underline-offset-4 hover:underline"
                  >
                    Read article
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </section>
      ) : (
        <section className="section-wrap pt-0">
          <div className="rounded-[2.2rem] border border-white/70 bg-white/65 p-7 text-[var(--muted)] shadow-[0_18px_40px_rgba(0,0,0,0.07)] backdrop-blur-lg sm:p-10">
            The blog is live, but there are no published posts yet.
          </div>
        </section>
      )}

      <section className="section-wrap pt-0">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Recent Stories</p>
            <h2 className="display-font mt-2 text-3xl sm:text-4xl md:text-5xl">Latest published posts</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {remainingPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-[1.8rem] border border-white/70 bg-white/65 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.07)] backdrop-blur-lg"
            >
              <h3 className="display-font text-2xl leading-tight">{post.title}</h3>
              <p className="mt-4 leading-7 text-[var(--muted)]">{post.excerpt}</p>
              <div className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                {formatDate(post.publishedAt)} • {post.authorName}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-flex text-sm font-semibold text-[var(--foreground)] underline-offset-4 hover:underline"
              >
                Read article
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
