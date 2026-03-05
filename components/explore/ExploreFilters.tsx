"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ExploreFilters({
  initialCity = "",
  initialVerified = false,
  initialElite = false,
}: {
  initialCity?: string;
  initialVerified?: boolean;
  initialElite?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [city, setCity] = useState(initialCity);
  const [verified, setVerified] = useState(initialVerified);
  const [elite, setElite] = useState(initialElite);

  // Se qualcuno cambia URL manualmente, allineiamo lo stato
  useEffect(() => {
    const urlCity = sp.get("city") ?? "";
    const urlVerified = sp.get("verified") === "1";
    const urlElite = sp.get("elite") === "1";

    setCity(urlCity);
    setVerified(urlVerified);
    setElite(urlElite);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const baseParams = useMemo(() => {
    const p = new URLSearchParams();
    if (city.trim()) p.set("city", city.trim());
    if (verified) p.set("verified", "1");
    if (elite) p.set("elite", "1");
    return p;
  }, [city, verified, elite]);

  // Applica filtri (con debounce leggero)
  useEffect(() => {
    const t = setTimeout(() => {
      const qs = baseParams.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }, 250);

    return () => clearTimeout(t);
  }, [baseParams, pathname, router]);

  function clearAll() {
    setCity("");
    setVerified(false);
    setElite(false);
    router.replace(pathname);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900">Cerca per città</div>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Es: Milano, Roma, Torino..."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setVerified((v) => !v)}
            className={[
              "rounded-full border px-4 py-3 text-sm font-semibold transition",
              verified
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
            ].join(" ")}
          >
            ✓ Solo verificate
          </button>

          <button
            type="button"
            onClick={() => setElite((v) => !v)}
            className={[
              "rounded-full border px-4 py-3 text-sm font-semibold transition",
              elite
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
            ].join(" ")}
          >
            👑 Solo Elite
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Suggerimento: scrivi una città e/o attiva i filtri. La lista si aggiorna da sola.
      </div>
    </div>
  );
}