
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { LayoutDashboard, Star, ShieldCheck, Crown } from "lucide-react";

type DashboardState = {
  displayName: string;
  email: string;
  avatarUrl: string | null;
  city: string | null;
  isVerified: boolean;
  tier: string | null;
  reviewsCount: number;
  averageRating: number;
};

function getTierLabel(tier: string | null) {
  if (tier === "elite") return "Elite";
  if (tier === "pro") return "Pro";
  if (tier === "plus") return "Plus";
  return "Base";
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "L";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function DashboardPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<DashboardState | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!active) return;

      if (!user?.email) {
        setState(null);
        setLoading(false);
        return;
      }

      const fallbackName =
        (user.user_metadata?.display_name as string | undefined)?.trim() ||
        user.email.split("@")[0] ||
        "Utente Lume";

      let nextState: DashboardState = {
        displayName: fallbackName,
        email: user.email,
        avatarUrl: null,
        city: null,
        isVerified: false,
        tier: null,
        reviewsCount: 0,
        averageRating: 0,
      };

      try {
        const { data: creatorRows } = await supabase
          .from("creators")
          .select("id, display_name, avatar_url, city, is_verified, tier")
          .eq("email", user.email)
          .limit(1);

        const creator = Array.isArray(creatorRows) ? creatorRows[0] : null;

        if (creator) {
          nextState = {
            ...nextState,
            displayName: creator.display_name || fallbackName,
            avatarUrl: creator.avatar_url || null,
            city: creator.city || null,
            isVerified: creator.is_verified === true,
            tier: creator.tier || null,
          };

          const { data: reviewRows } = await supabase
            .from("reviews")
            .select("rating")
            .eq("professional_id", creator.id);

          const ratings = (reviewRows || [])
            .map((row: { rating: number | null }) => Number(row.rating ?? 0))
            .filter((v: number) => v > 0);

          const reviewsCount = ratings.length;
          const averageRating =
            reviewsCount > 0
              ? Number((ratings.reduce((sum: number, v: number) => sum + v, 0) / reviewsCount).toFixed(2))
              : 0;

          nextState = {
            ...nextState,
            reviewsCount,
            averageRating,
          };
        }
      } catch {
        // fallback to auth-only data
      }

      if (!active) return;
      setState(nextState);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, [supabase]);

  if (loading) {
    return (
      <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.14),transparent_30%)]" />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-[30px] border border-white/10 bg-black/80 p-8">
            <p className="text-sm text-zinc-400">Caricamento dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!state) {
    return (
      <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.14),transparent_30%)]" />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-[30px] border border-white/10 bg-black/80 p-8">
            <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              Dashboard Lume
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Devi effettuare il login
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              La dashboard è disponibile solo dopo l’accesso. Una volta autenticato vedrai
              il tuo riepilogo account, lo stato del profilo e il collegamento rapido alle aree future.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
              >
                Vai al login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20"
              >
                Registrati
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.14),transparent_30%)]" />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[30px] border border-white/10 bg-black/80 p-8">
          <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            Dashboard Lume
          </div>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {state.avatarUrl ? (
                <img
                  src={state.avatarUrl}
                  alt={state.displayName}
                  className="h-20 w-20 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-semibold text-white">
                  {initialsFromName(state.displayName)}
                </div>
              )}

              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  {state.displayName}
                </h1>
                <p className="mt-1 text-sm text-zinc-400">{state.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard attiva
                  </span>
                  {state.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verificata
                    </span>
                  )}
                  {state.tier === "elite" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300">
                      <Crown className="h-3.5 w-3.5" />
                      Elite
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-300">
              <div className="text-zinc-500">Stato profilo</div>
              <div className="mt-1 text-lg font-semibold text-white">{getTierLabel(state.tier)}</div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Città" value={state.city || "Non indicata"} />
          <MetricCard label="Tier" value={getTierLabel(state.tier)} />
          <MetricCard label="Recensioni" value={String(state.reviewsCount)} />
          <MetricCard label="Rating medio" value={state.reviewsCount > 0 ? `${state.averageRating}/5` : "N/D"} />
        </section>

        <section className="rounded-[30px] border border-white/10 bg-black/80 p-8">
          <h2 className="text-xl font-semibold text-white">Prossimi sviluppi</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Questa è la dashboard base post-login. Da qui potremo aggiungere modifica profilo,
            gestione immagini, area creator, messaggi reali, preferenze account e controlli avanzati.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoCard title="Profilo" text="Base pronta per modifica dati, città, bio e immagini." />
            <InfoCard title="Reputazione" text="Spazio ideale per score, recensioni, andamento e badge." />
            <InfoCard title="Messaggi" text="Predisposizione per futura chat reale persistente." />
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/80 p-5">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2 text-white">
        <Star className="h-4 w-4 text-cyan-300" />
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
    </div>
  );
}
