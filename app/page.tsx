import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import ProfilesGrid from "@/components/explore/ProfilesGrid";
import { motion } from "framer-motion";

type Creator = {
  id: string;
  display_name: string | null;
  city: string | null;
  age: number | null;
  avatar_url: string | null;
  tier: string | null;
  is_verified: boolean | null;
  is_active: boolean | null;
};

function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

export default async function HomePage() {
  const { data } = await supabase
    .from("creators")
    .select("id, display_name, city, age, avatar_url, tier, is_verified, is_active")
    .eq("is_active", true)
    .limit(2);

  const creators = (data ?? []) as Creator[];
  const first = creators[0] ?? null;
  const second = creators[1] ?? null;

  return (
    <div className="space-y-12">
      {/* HERO CON FOTO SUBITO VISIBILI */}
      <section className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_35%)]" />

        <div className="relative grid grid-cols-1 gap-8 px-8 py-10 md:px-12 md:py-12 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          {/* TESTO */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
              Private Reputation Network
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Profili, reputation e connessioni
              <br />
              in un ambiente più pulito
              <br />
              e discreto.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Una piattaforma visivamente più ordinata per navigare i profili,
              leggere recensioni e scoprire reputation ed Elite.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Esplora i profili
              </Link>

              <Link
                href="/ranking"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Apri Classifica
              </Link>
            </div>
          </div>

          {/* FOTO SUBITO A DESTRA */}
          <div className="grid grid-cols-2 gap-4">
            {first ? (
              <Link
                href={`/profile/${first.id}`}
                className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/5] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={first.avatar_url || ""}
                    alt={first.display_name || "Profilo"}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  <div className="absolute top-3 left-3 flex gap-2">
                    {first.is_verified ? (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        ✓ Verificata
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-lg font-semibold text-slate-900">
                    {first.display_name || "—"}
                    {first.age ? ` ${first.age}` : ""}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{first.city || "—"}</div>
                </div>
              </Link>
            ) : (
              <div className="rounded-[28px] border border-slate-200 bg-slate-100 aspect-[4/5]" />
            )}

            {second ? (
              <Link
                href={`/profile/${second.id}`}
                className="group mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/5] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={second.avatar_url || ""}
                    alt={second.display_name || "Profilo"}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  <div className="absolute top-3 left-3 flex gap-2">
                    {second.is_verified ? (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        ✓ Verificata
                      </span>
                    ) : null}

                    {second.tier === "elite" ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                        👑 Elite
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-lg font-semibold text-slate-900">
                    {second.display_name || "—"}
                    {second.age ? ` ${second.age}` : ""}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{second.city || "—"}</div>
                </div>
              </Link>
            ) : (
              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-100 aspect-[4/5]" />
            )}
          </div>
        </div>
      </section>

      {/* PROFILI DEL MOMENTO */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              In evidenza
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Profili del momento
            </h2>
          </div>

          <Link
            href="/explore"
            className="hidden rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 md:inline-flex"
          >
            Vedi tutti
          </Link>
        </div>

        <ProfilesGrid title="" subtitle="" limit={6} />

        <div className="flex justify-center md:hidden">
          <Link
            href="/explore"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Vedi tutti i profili
          </Link>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="space-y-6">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            Metodo
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Come funziona Lume
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FeatureCard
            title="Profili più ordinati"
            text="Ogni profilo viene mostrato in una struttura chiara: immagini, bio, interessi, badge e recensioni sono immediatamente leggibili."
          />
          <FeatureCard
            title="reputation più visibile"
            text="Il sistema valorizza rating, numero di recensioni e segnali reputazionali in modo semplice, senza sovraccaricare la navigazione."
          />
          <FeatureCard
            title="Esperienza più riservata"
            text="L’interfaccia è pensata per offrire un ambiente più discreto, pulito e premium, con percorsi di navigazione più essenziali."
          />
        </div>
      </section>

      {/* ELITE */}
      <section className="rounded-[36px] border border-slate-200 bg-slate-900 px-8 py-10 text-white shadow-sm md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
              👑 Elite
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
              Un livello visivo e reputazionale più alto.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
              Il livello Elite mette in evidenza i profili con una presenza più
              curata, un posizionamento più forte e una percezione più premium
              all’interno della piattaforma.
            </p>

            <div className="mt-7">
              <Link
                href="/elite"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:opacity-95"
              >
                Scopri Elite
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">Badge dedicato</div>
              <div className="mt-2 text-sm leading-6 text-white/70">
                Un segnale visivo immediato che valorizza la presenza del profilo.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">Maggiore impatto</div>
              <div className="mt-2 text-sm leading-6 text-white/70">
                Presentazione più forte, più elegante e più memorabile nella navigazione.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">Esperienza premium</div>
              <div className="mt-2 text-sm leading-6 text-white/70">
                Coerenza con una piattaforma più esclusiva e più raffinata.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}