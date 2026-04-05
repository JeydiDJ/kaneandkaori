import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildMetadata, getAbsoluteUrl } from "@/lib/seo";
import { getPublishedBlogPostBySlug, getPublishedBlogPosts } from "@/services/blogService";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

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

function buildParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Blog | Kane & Kaori",
      description: "Editorial from Kane & Kaori.",
      path: "/blog",
    });
  }

  return buildMetadata({
    title: post.seoTitle || `${post.title} | Kane & Kaori`,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    images: post.coverImage ? [post.coverImage] : ["/opengraph-image"],
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || getAbsoluteUrl("/opengraph-image"),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Kane & Kaori",
    },
    mainEntityOfPage: getAbsoluteUrl(`/blog/${post.slug}`),
  };

  const paragraphs = buildParagraphs(post.content);

  return (
    <article className="section-wrap">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="mx-auto max-w-4xl">
        <h1 className="display-font text-4xl leading-tight sm:text-5xl md:text-6xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-4 text-sm uppercase tracking-[0.16em] text-[var(--muted)]">
          <span>{formatDate(post.publishedAt)}</span>
          <span>{post.authorName}</span>
        </div>
        <p className="mt-8 rounded-[1.6rem] border border-white/70 bg-white/70 p-6 text-lg leading-8 text-[var(--muted)] shadow-[0_20px_55px_rgba(0,0,0,0.08)]">
          {post.excerpt}
        </p>
        {post.coverImage ? (
          <div
            aria-hidden
            className="mt-8 h-72 rounded-[2rem] border border-white/70 bg-cover bg-center shadow-[0_24px_60px_rgba(0,0,0,0.10)] sm:h-[28rem]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.10), rgba(0,0,0,0.10)), url(${post.coverImage})`,
            }}
          />
        ) : null}
        <div className="mt-10 rounded-[2rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(243,237,225,0.56))] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10">
          <div className="space-y-6 text-lg leading-9 text-[var(--muted)]">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
