type EliteRequirement = {
  title: string;
  description: string;
  target?: string;
  progress?: number;
};

type Props = {
  items?: EliteRequirement[];
  requirements?: EliteRequirement[];
};

export function EliteRequirements({ items, requirements }: Props) {
  const safeRequirements = items ?? requirements ?? [];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Requisiti Elite
        </h2>
        <p className="text-sm text-zinc-400">
          I criteri principali per accedere o mantenere il livello Elite.
        </p>
      </div>

      <div className="space-y-5">
        {safeRequirements.length > 0 ? (
          safeRequirements.map((requirement, index) => {
            const progress = Math.min(Math.max(requirement.progress ?? 0, 0), 100);
            const width = `${progress}%`;

            return (
              <div
                key={`${requirement.title}-${index}`}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {requirement.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {requirement.description}
                    </p>
                  </div>

                  {requirement.target ? (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-amber-300">
                        {requirement.target}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
            Nessun requisito disponibile al momento.
          </div>
        )}
      </div>
    </section>
  );
}
