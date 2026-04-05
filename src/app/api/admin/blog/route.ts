import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("Failed to load admin blog posts", error);
    return NextResponse.json({ error: "Could not load blog posts." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog post", error);
    return NextResponse.json({ error: "Could not create the blog post." }, { status: 500 });
  }
}
