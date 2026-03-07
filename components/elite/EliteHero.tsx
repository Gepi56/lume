import Link from "next/link";
import { EliteData } from "@/lib/mock/elite";

type Props = {
  data: EliteData;
};

export function EliteHero({ data }: Props) {
  const progressWidth = `${Math.min(Math.max(data.progress, 0), 100)}%`;

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-400">Stato Elite</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold tracking-tight">{data.progress}%</span>
              <span className="pb-1 text-lg text-zinc-400">completato</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300 ring-1 ring-amber-500/20">
                {data.currentStatus}
              </span>
              <span className="inline-flex rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-medium text-fuchsia-300 ring-1 ring-fuchsia-500/20">
                Target: {data.targetScore}/100
              </span>
            </div>
          </div>

          <div className="max-w-sm space-y-2">
            <p className="text-sm text-zinc-300">{data.summary}</p>
            <p className="text-xs text-zinc-500">
              Ultima verifica: {data.lastReview}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 transition-all duration-500"
              style={{ width: progressWidth }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Stato attuale</span>
            <span>Manca poco al livello Elite</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold tracking-tight">Passo consigliato</h2>
        <p className="mt-3 text-sm text-zinc-400">
          Mantieni alta la qualità delle recensioni e consolida affidabilità e tempi di risposta.
        </p>
        <div className="mt-5 space-y-3">
          <Link
            href="/reputation"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/15 px-4 py-2.5 text-sm font-medium text-fuchsia-200 transition hover:bg-fuchsia-500/20"
          >
            Controlla Reputation
          </Link>
          <Link
            href="/ranking"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-black/30"
          >
            Apri classifica
          </Link>
        </div>
      </div>
    </section>
  );
}
