"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchAdminJson } from "@/lib/admin-client";
import { mapBlogPostRow } from "@/lib/supabase-mappers";
import type { BlogPost } from "@/types/blog";

function formatStatus(post: BlogPost) {
  if (!post.isPublished) {
    return "Draft";
  }

  return post.featured ? "Published • Featured" : "Published";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminJson<unknown[]>("/api/admin/blog");
        setPosts((data ?? []).map((row) => mapBlogPostRow(row as never)));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load blog posts right now.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">
        Loading blog posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Editorial</p>
          <h1 className="display-font mt-3 text-3xl md:text-5xl">Manage blog posts</h1>
        </div>
        <Link
          href="/studio/blog/create"
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)] shadow-[0_12px_26px_rgba(0,0,0,0.28)] transition hover:brightness-95"
        >
          Add post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-[2rem] border border-white/75 bg-white/88 p-6 text-[var(--muted)] shadow-[0_16px_45px_rgba(0,0,0,0.08)]">
          No blog posts yet. Create the first article for the marketing team.
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="grid gap-4 rounded-[2rem] border border-white/75 bg-white/88 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.08)] md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xl font-semibold leading-snug">{post.title}</p>
                  <span className="rounded-full border border-[var(--border)] bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    {formatStatus(post)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {post.category || "Uncategorized"} • {post.authorName} • {formatDate(post.publishedAt)}
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link
                  href={`/studio/blog/edit/${post.id}`}
                  className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-3 text-center text-sm font-semibold transition hover:bg-[var(--surface)]/75"
                >
                  Edit
                </Link>
                {post.isPublished ? (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-3 text-center text-sm font-semibold transition hover:bg-[var(--surface)]/75"
                  >
                    View live
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
