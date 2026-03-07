import Link from "next/link";
import { getLumeRankingData } from "@/lib/server/lume-ranking";

export default async function RankingPage() {
  const data = await getLumeRankingData();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            Ranking Lume
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Classifica pubblica dei profili
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
              Classifica basata su dati reali Supabase, con ordinamento per score reputazionale,
              rating medio e volume recensioni. Layout più visivo e premium, senza cambiare
              la logica del database.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Profili attivi" value={String(data.stats.activeCreators)} />
          <StatCard label="Recensioni analizzate" value={String(data.stats.totalReviews)} />
          <StatCard label="Top score" value={`${data.stats.topScore}/100`} />
          <StatCard label="Rating top profilo" value={data.stats.topAverageRating} />
        </section>

        {data.items.length > 0 ? (
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Top creator attivi
                </h2>
                <p className="text-sm text-zinc-400">
                  Ordinati per score reputazionale calcolato su dati pubblici reali.
                </p>
              </div>
              <p className="text-xs text-zinc-500">
                Runtime server-side
              </p>
            </div>

            <div className="space-y-5">
              {data.items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.03]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
                    <div className="relative min-h-[280px] bg-black/30">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-[280px] w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-5xl font-semibold text-white/80">
                          {item.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      <div className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/15 bg-black/40 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                        #{item.rank}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {item.isVerified && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/20 backdrop-blur-sm">
                              Verificata
                            </span>
                          )}
                          {item.isElite && (
                            <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300 ring-1 ring-amber-500/20 backdrop-blur-sm">
                              Elite
                            </span>
                          )}
                          <span className="inline-flex items-center rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-zinc-200 ring-1 ring-white/10 backdrop-blur-sm">
                            {item.city || "Città non indicata"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="truncate text-2xl font-semibold tracking-tight text-white">
                                {item.displayName}
                              </h3>
                              <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                                {item.level}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-400">
                              <span>{item.reviewsCount} recensioni</span>
                              <span>Rating {item.averageRating}</span>
                              <span>Positive {item.positivePct}%</span>
                              <span>{item.tierLabel}</span>
                            </div>

                            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
                              {item.summary}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[360px]">
                            <MiniStat label="Score" value={`${item.score}/100`} strong />
                            <MiniStat label="Affidabilità" value={`${item.reliabilityScore}/100`} />
                            <MiniStat label="Trust" value={`${item.trustScore}/100`} />
                            <MiniStat label="Trend" value={item.trendLabel} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500"
                              style={{ width: `${Math.min(Math.max(item.score, 0), 100)}%` }}
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                            <span>
                              Ranking reale basato su score, rating medio e volume recensioni.
                            </span>

                            <Link
                              href={`/profile/${item.id}`}
                              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
                            >
                              Apri profilo
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Nessun dato ranking disponibile
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              La pagina è collegata a Supabase, ma al momento non ci sono creator attivi
              o recensioni sufficienti per comporre una classifica pubblica significativa.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${strong ? "text-white" : "text-zinc-200"}`}>
        {value}
      </p>
    </div>
  );
}
