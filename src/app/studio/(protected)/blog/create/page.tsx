import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default function CreateBlogPostPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Editorial</p>
        <h1 className="display-font mt-3 text-4xl md:text-5xl">Create a new blog post</h1>
      </div>
      <BlogPostForm />
    </div>
  );
}
