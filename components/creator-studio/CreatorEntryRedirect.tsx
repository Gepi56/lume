"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export default function CreatorEntryRedirect() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [message, setMessage] = useState("Verifica sessione creator in corso...");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setMessage("Controllo sessione in corso...");

      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData.session?.user;

      if (sessionUser?.id) {
        if (!cancelled) router.replace("/creator/studio");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (user?.id) {
        if (!cancelled) router.replace("/creator/studio");
        return;
      }

      if (!cancelled) {
        setMessage("Sessione non trovata. Reindirizzamento al login...");
        router.replace("/login?next=/creator/studio");
      }
    }

    const timeout = window.setTimeout(() => {
      if (!cancelled) {
        setMessage("Reindirizzamento più lento del previsto. Sto ritentando il controllo sessione...");
      }
    }, 1500);

    void run();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
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
