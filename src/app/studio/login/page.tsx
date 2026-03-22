"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        router.replace("/studio");
      }
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowserClient();
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Login failed.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setError("This account does not have admin access.");
      setLoading(false);
      return;
    }

    router.push("/studio");
    router.refresh();
  }

  return (
    <section className="section-wrap flex items-center justify-center">
      <form className="grid w-full max-w-md gap-4 rounded-[2.2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(106,73,53,0.09)]" onSubmit={handleSubmit}>
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Private access</p>
          <h1 className="display-font mt-3 text-5xl">Studio login</h1>
          <p className="mt-3 text-[var(--muted)]">Authorized team members can sign in to manage the catalog and orders.</p>
        </div>
        <Input label="Admin email" name="email" type="email" required />
        <Input label="Password" name="password" type="password" required />
        <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </form>
    </section>
  );
}
