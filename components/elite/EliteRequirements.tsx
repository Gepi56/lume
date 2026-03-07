type Requirement = {
  id: string;
  label: string;
  value: string;
  ok: boolean;
};

type Props = {
  requirements: Requirement[];
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function EliteRequirements({ requirements }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Criteri di accesso</h2>
        <p className="text-sm text-zinc-400">
          Requisiti minimi per sbloccare o mantenere il livello Elite.
        </p>
      </div>

      <div className="space-y-3">
        {requirements.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="mt-1 text-sm text-zinc-400">{item.value}</p>
              </div>

              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                  item.ok
                    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20"
                    : "bg-zinc-500/15 text-zinc-300 ring-1 ring-zinc-500/20"
                )}
              >
                {item.ok ? "OK" : "Da migliorare"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
