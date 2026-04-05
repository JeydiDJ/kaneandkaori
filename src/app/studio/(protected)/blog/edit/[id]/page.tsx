"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { fetchAdminJson } from "@/lib/admin-client";
import { mapBlogPostRow } from "@/lib/supabase-mappers";
import type { BlogPost } from "@/types/blog";

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminJson<unknown>(`/api/admin/blog/${params.id}`);
        setPost(mapBlogPostRow(data as never));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load the blog post right now.",
        );
      }
    }

    void load();
  }, [params.id]);

  if (error) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">
        Loading blog post...
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Editorial</p>
        <h1 className="display-font mt-3 text-4xl md:text-5xl">Edit blog post</h1>
      </div>
      <BlogPostForm post={post} />
    </div>
  );
}
