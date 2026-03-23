import { createSupabaseAdminClient } from "@/lib/supabase";

export async function isAdminRequest(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    return false;
  }

  const supabase = createSupabaseAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user) {
    return false;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}
