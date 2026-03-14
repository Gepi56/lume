"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { ensureLinkedCreator } from "@/lib/creator-studio/ensure-linked-creator";

export default function CreatorEntryRedirect() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [message, setMessage] = useState("Verifica collegamento creator in corso...");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user?.id) {
        if (!cancelled) router.replace("/login?next=/creator/studio");
        return;
      }

      setMessage("Controllo o creazione profilo creator...");

      const result = await ensureLinkedCreator(supabase, user);

      if (!cancelled) {
        if (result.creator?.id) {
          router.replace("/creator/studio");
          return;
        }

        if (result.error) {
          setMessage(`Impossibile completare il collegamento creator: ${result.error}`);
          return;
        }

        router.replace("/creators");
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
