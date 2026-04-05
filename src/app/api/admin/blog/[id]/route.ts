import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to load admin blog post", error);
    return NextResponse.json({ error: "Could not load the blog post." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const payload = await request.json();
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Blog post not found.");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to update blog post", error);
    return NextResponse.json({ error: "Could not update the blog post." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete blog post", error);
    return NextResponse.json({ error: "Could not delete the blog post." }, { status: 500 });
  }
}
