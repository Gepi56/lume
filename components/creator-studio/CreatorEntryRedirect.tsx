"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export default function CreatorEntryRedirect() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [message, setMessage] = useState("Verifica ruolo in corso...");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user ?? null;

        if (!user?.id) {
          if (!cancelled) router.replace("/creators");
          return;
        }

        setMessage("Controllo profilo professionista in corso...");

        const { data, error } = await supabase
          .from("creators")
          .select("id")
          .eq("auth_user_id", user.id)
          .limit(1);

        if (error) {
          if (!cancelled) router.replace("/creators");
          return;
        }

        const hasCreator = Array.isArray(data) && data.length > 0;
        if (!cancelled) {
          router.replace(hasCreator ? "/creator/studio" : "/creators");
        }
      } catch {
        if (!cancelled) router.replace("/creators");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Creator</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Reindirizzamento in corso</h1>
        <p className="mt-3 text-slate-600">{message}</p>
      </div>
    </div>
  );
}
