"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types/product";

type ProductFormProps = {
  product?: Product;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [image, setImage] = useState(product?.image ?? "");

  async function handleUpload(file: File) {
    const supabase = getSupabaseBrowserClient();
    const filePath = `products/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      setMessage(error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    setImage(publicUrl);
    setMessage("Image uploaded. Save the product to publish it.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowserClient();
    const payload = {
      name: String(formData.get("name") ?? ""),
      slug: slugify(String(formData.get("name") ?? "")),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price")),
      inventory: Number(formData.get("inventory")),
      category: String(formData.get("category") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      featured: formData.get("featured") === "on",
      image_url: image,
    };

    const query = product
      ? supabase.from("products").update(payload).eq("id", product.id)
      : supabase.from("products").insert(payload);

    const { error } = await query;
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/studio/products");
    router.refresh();
  }

  return (
    <form className="grid gap-4 rounded-[2rem] border border-white/75 bg-white/88 p-6 shadow-[0_20px_55px_rgba(0,0,0,0.10)]" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Product name" name="name" defaultValue={product?.name} required />
        <Input label="Category" name="category" defaultValue={product?.category} required />
        <Input label="Price" name="price" type="number" min="0" defaultValue={product?.price} required />
        <Input label="Inventory" name="inventory" type="number" min="0" defaultValue={product?.inventory} required />
      </div>
      <Textarea label="Description" name="description" defaultValue={product?.description} required />
      <Input label="Scent notes" name="notes" defaultValue={product?.notes.join(", ")} hint="Separate notes with commas" required />
      <label className="grid gap-2 text-sm text-[var(--muted)]">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Product image</span>
        <input
          className="rounded-2xl border border-[var(--border)] bg-white/85 p-3 file:mr-3 file:rounded-full file:border-0 file:bg-[var(--surface)] file:px-3 file:py-2 file:text-xs file:font-semibold"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void handleUpload(file);
            }
          }}
        />
        <Input label="Image URL" name="image" value={image} onChange={(event) => setImage(event.target.value)} required />
      </label>
      <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/75 px-4 py-3 text-sm text-[var(--foreground)]">
        <input className="h-4 w-4 accent-[var(--accent)]" type="checkbox" name="featured" defaultChecked={product?.featured} />
        Feature on the homepage
      </label>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : product ? "Update product" : "Create product"}</Button>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}

