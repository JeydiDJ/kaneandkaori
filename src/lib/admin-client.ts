"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";

async function getAdminAccessToken() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? "";
}

export async function fetchAdminJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const token = await getAdminAccessToken();

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T | { error?: string }) : null;

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? data.error
        : "The request could not be completed.";

    throw new Error(message || "The request could not be completed.");
  }

  return data as T;
}
