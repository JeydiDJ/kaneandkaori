import "server-only";

import { mapBlogPostRow } from "@/lib/supabase-mappers";
import { createSupabaseAdminClient } from "@/lib/supabase";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function getPublishedBlogPosts() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch blog posts", error);
    return [];
  }

  return data.map(mapBlogPostRow);
}

export async function getPublishedBlogPostBySlug(id: string) {
  const supabase = createSupabaseAdminClient();
  const { data: slugMatch, error: slugError } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .eq("slug", id)
    .maybeSingle();

  if (slugMatch) {
    return mapBlogPostRow(slugMatch);
  }

  if (slugError || !isUuid(id)) {
    return null;
  }

  const { data: idMatch, error: idError } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .eq("id", id)
    .maybeSingle();

  if (idError || !idMatch) {
    return null;
  }

  return mapBlogPostRow(idMatch);
}
