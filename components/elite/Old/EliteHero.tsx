type EliteData = {
  statusLabel: string;
  accessState: "active" | "locked" | "review";
  currentScore: number;
  targetScore: number;
  summary: string;
  badges: string[];
};

type Props = {
  data: EliteData;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function EliteHero({ data }: Props) {
  const progress = Math.min(Math.max((data.currentScore / data.targetScore) * 100, 0), 100);

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-white/5 to-fuchsia-500/10 p-6 lg:col-span-2">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
            Programma Elite
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Stato Elite</h1>
            <p className="max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
              {data.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusPill label={data.statusLabel} state={data.accessState} />
            {data.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-medium text-zinc-400">Progresso accesso</p>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-bold tracking-tight text-white">{data.currentScore}</span>
          <span className="pb-1 text-zinc-400">/ {data.targetScore}</span>
        </div>

        <div className="mt-5 space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-fuchsia-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Stato attuale</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({
  label,
  state,
}: {
  label: string;
  state: "active" | "locked" | "review";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        state === "active" && "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20",
        state === "locked" && "bg-zinc-500/15 text-zinc-300 ring-1 ring-zinc-500/20",
        state === "review" && "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/20"
      )}
    >
      {label}
    </span>
  );
}
