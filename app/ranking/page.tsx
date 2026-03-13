import Link from "next/link";
import { getLumeRankingData } from "@/lib/server/lume-ranking";

export default async function RankingPage() {
  const data = await getLumeRankingData();

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#04131a] via-[#02060a] to-black text-zinc-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_30%)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-3 rounded-[30px] border border-cyan-500/10 bg-black/80 p-8">
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
          <section className="rounded-[28px] border border-white/10 bg-black/80 p-4 sm:p-6">
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

            <div className="space-y-4">
              {data.items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="relative h-[138px] w-[110px] shrink-0 overflow-hidden rounded-[20px] border border-white/10 bg-black/30">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-4xl font-semibold text-white/80">
                            {item.displayName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                          #{item.rank}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-xl font-semibold text-white">
                            {item.displayName}
                          </h3>

                          {item.isVerified && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/20">
                              Verificata
                            </span>
                          )}

                          {item.isElite && (
                            <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-300 ring-1 ring-amber-500/20">
                              Elite
                            </span>
                          )}

                          <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                            {item.level}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                          <span>{item.city || "Città non indicata"}</span>
                          <span>{item.reviewsCount} recensioni</span>
                          <span>Rating {item.averageRating}</span>
                          <span>{item.tierLabel}</span>
                        </div>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="grid min-w-[250px] grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[360px]">
                      <MiniStat label="Score" value={`${item.score}/100`} strong />
                      <MiniStat label="Positive" value={`${item.positivePct}%`} />
                      <MiniStat label="Affidabilità" value={`${item.reliabilityScore}/100`} />
                      <MiniStat label="Trend" value={item.trendLabel} />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500"
                        style={{ width: `${Math.min(Math.max(item.score, 0), 100)}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                      <span>
                        Trust {item.trustScore}/100 · Ranking reale basato su score, rating medio e volume recensioni.
                      </span>

                      <Link
                        href={item.publicHref}
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
                      >
                        Apri profilo
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-[28px] border border-white/10 bg-black/80 p-6">
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
    <div className="rounded-[24px] border border-white/10 bg-black/70 p-5">
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
