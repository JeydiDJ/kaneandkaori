"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { fetchAdminJson } from "@/lib/admin-client";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

type BlogPostFormProps = {
  post?: BlogPost;
};

const BLOG_TEMPLATE = `Introduction

State the core problem, market shift, or opportunity this article is about.

Context

Explain what is happening in the business, customer journey, or campaign environment.

Strategy

Outline the approach, decision-making logic, and operating model.

Execution

Break down the channels, assets, workflows, or experiments that were used.

Results

Share the signals, outcomes, or lessons learned.

Next Steps

Close with what the team should keep, change, test, or scale next.`;

const BLOG_CATEGORIES = [
  "Launch Strategy",
  "Email Marketing",
  "Content Ops",
  "Lifecycle Marketing",
  "Campaign Analysis",
  "Performance Marketing",
  "Brand Strategy",
  "Customer Journey",
] as const;

export function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [category, setCategory] = useState(post?.category ?? BLOG_CATEGORIES[0]);
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!categoryMenuRef.current?.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  async function handleUpload(file: File) {
    setMessage("Uploading cover image...");
    const supabase = getSupabaseBrowserClient();
    const filePath = `blog/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      setMessage(error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(filePath);

    setCoverImage(publicUrl);
    setMessage("Cover image uploaded. Save the post to publish it.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const isPublished = formData.get("isPublished") === "on";
    const existingPublishedAt = post?.publishedAt ?? null;
    const payload = {
      title,
      slug: slugify(title),
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      cover_image_url: coverImage.trim(),
      category: String(formData.get("category") ?? "").trim(),
      author_name: String(formData.get("authorName") ?? "").trim(),
      seo_title: String(formData.get("seoTitle") ?? "").trim(),
      seo_description: String(formData.get("seoDescription") ?? "").trim(),
      is_published: isPublished,
      featured: formData.get("featured") === "on",
      published_at: isPublished ? existingPublishedAt ?? new Date().toISOString() : null,
    };

    try {
      if (post) {
        await fetchAdminJson(`/api/admin/blog/${post.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetchAdminJson("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      router.push("/studio/blog");
      router.refresh();
    } catch (submitError) {
      setMessage(
        submitError instanceof Error
          ? submitError.message
          : "The blog post could not be saved.",
      );
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!post || !window.confirm("Delete this blog post? This cannot be undone.")) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await fetchAdminJson(`/api/admin/blog/${post.id}`, {
        method: "DELETE",
      });
      router.push("/studio/blog");
      router.refresh();
    } catch (deleteError) {
      setMessage(
        deleteError instanceof Error
          ? deleteError.message
          : "The blog post could not be deleted.",
      );
      setLoading(false);
    }
  }

  return (
    <form
      className="grid gap-4 rounded-[2rem] border border-white/75 bg-white/88 p-6 shadow-[0_20px_55px_rgba(0,0,0,0.10)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Post title"
            name="title"
            defaultValue={post?.title}
            required
          />
          <label className="grid gap-2 text-sm text-[var(--muted)]">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Category
            </span>
            <div className="relative" ref={categoryMenuRef}>
              <input type="hidden" name="category" value={category} />
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(243,237,225,0.82))] px-4 py-3 text-left text-[var(--foreground)] shadow-[0_12px_28px_rgba(0,0,0,0.05)] outline-none transition duration-200 hover:border-[var(--foreground)]/20 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                aria-haspopup="listbox"
                aria-expanded={categoryMenuOpen}
                onClick={() => setCategoryMenuOpen((open) => !open)}
              >
                <span>{category}</span>
                <svg
                  viewBox="0 0 20 20"
                  className={`h-4 w-4 text-[var(--muted)] transition ${categoryMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path d="M5.75 7.75 10 12.25l4.25-4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {categoryMenuOpen ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-[1.4rem] border border-white/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(243,237,225,0.92))] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.14)] backdrop-blur-xl">
                  <div className="grid gap-1" role="listbox" aria-label="Blog categories">
                    {BLOG_CATEGORIES.map((option) => {
                      const isSelected = option === category;

                      return (
                        <button
                          key={option}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          className={`flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${
                            isSelected
                              ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                              : "text-[var(--foreground)] hover:bg-white/80"
                          }`}
                          onClick={() => {
                            setCategory(option);
                            setCategoryMenuOpen(false);
                          }}
                        >
                          <span>{option}</span>
                          {isSelected ? (
                            <span className="text-xs uppercase tracking-[0.14em]">Selected</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </label>
        </div>
        <p className="text-xs text-[var(--muted)]">
          The slug is generated from the title when you save.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Author name"
            name="authorName"
            defaultValue={post?.authorName ?? "Kane & Kaori"}
            hint="Name shown on the published article."
            required
          />
          <label className="grid gap-2 text-sm text-[var(--muted)]">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Cover image
            </span>
            <input
              className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(243,237,225,0.82))] p-3 shadow-[0_12px_28px_rgba(0,0,0,0.05)] transition duration-200 hover:border-[var(--foreground)]/20 hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(247,242,234,0.92))] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[var(--accent-contrast)] hover:file:brightness-95"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleUpload(file);
                }
              }}
            />
            <input type="hidden" name="coverImage" value={coverImage} />
            <span className="text-xs text-[var(--muted)]">
              Upload a cover image for the post. The image URL is saved automatically.
            </span>
          </label>
        </div>
      </div>

      <Textarea
        label="Excerpt"
        name="excerpt"
        defaultValue={post?.excerpt}
        placeholder="Summarize the article in 1-2 sentences for listings, SEO, and previews."
        hint="This is reused on the blog index and in metadata when no SEO description is provided."
        required
      />

      <Textarea
        label="Article content"
        name="content"
        defaultValue={post?.content ?? BLOG_TEMPLATE}
        className="min-h-72"
        hint="New posts start from the shared template. Keep blank lines between paragraphs."
        required
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="SEO title"
          name="seoTitle"
          defaultValue={post?.seoTitle}
          placeholder="Optional. Falls back to the post title."
        />
        <Input
          label="SEO description"
          name="seoDescription"
          defaultValue={post?.seoDescription}
          placeholder="Optional. Falls back to the excerpt."
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/75 px-4 py-3 text-sm text-[var(--foreground)]">
          <input
            className="h-4 w-4 accent-[var(--accent)]"
            type="checkbox"
            name="isPublished"
            defaultChecked={post?.isPublished}
          />
          Publish this post
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/75 px-4 py-3 text-sm text-[var(--foreground)]">
          <input
            className="h-4 w-4 accent-[var(--accent)]"
            type="checkbox"
            name="featured"
            defaultChecked={post?.featured}
          />
          Feature on the blog landing page
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : post ? "Update post" : "Create post"}
        </Button>
        {post ? (
          <Button type="button" variant="secondary" disabled={loading} onClick={handleDelete}>
            Delete post
          </Button>
        ) : null}
      </div>

      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}
