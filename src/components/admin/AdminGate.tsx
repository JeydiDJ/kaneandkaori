"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getSupabaseBrowserClient } from "@/lib/supabase";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function checkAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setAllowed(false);
        setReady(true);
        router.replace("/studio/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        setAllowed(false);
        setReady(true);
        router.replace("/studio/login");
        return;
      }

      setAllowed(true);
      setReady(true);
    }

    void checkAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void checkAccess();
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (!ready) {
    return (
      <section className="section-wrap">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 text-[var(--muted)]">
          Checking admin access...
        </div>
      </section>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
