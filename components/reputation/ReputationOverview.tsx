type ReputationMetric = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
};

type ReputationData = {
  score: number;
  level: string;
  isVerified: boolean;
  isElite: boolean;
  summary: string;
  lastUpdated: string;
  metrics: ReputationMetric[];
};

type Props = {
  data: ReputationData;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ReputationOverview({ data }: Props) {
  const scoreWidth = `${Math.min(Math.max(data.score, 0), 100)}%`;

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:col-span-2">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-400">Punteggio complessivo</p>

            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold tracking-tight">{data.score}</span>
              <span className="pb-1 text-lg text-zinc-400">/100</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill label={data.level} tone="primary" />
              {data.isVerified && <StatusPill label="Verificata" tone="success" />}
              {data.isElite && <StatusPill label="Elite" tone="warning" />}
            </div>
          </div>

          <div className="max-w-sm space-y-2">
            <p className="text-sm text-zinc-300">{data.summary}</p>
            <p className="text-xs text-zinc-500">
              Ultimo aggiornamento: {data.lastUpdated}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 transition-all duration-500"
              style={{ width: scoreWidth }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>In crescita</span>
            <span>Obiettivo Elite: 90+</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
        {data.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              {metric.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
            <p
              className={cn(
                "mt-2 text-xs",
                metric.trend === "up" && "text-emerald-400",
                metric.trend === "down" && "text-rose-400",
                metric.trend === "neutral" && "text-zinc-400"
              )}
            >
              {metric.delta}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "primary" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "primary" && "bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-500/20",
        tone === "success" && "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20",
        tone === "warning" && "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/20"
      )}
    >
      {label}
    </span>
  );
}