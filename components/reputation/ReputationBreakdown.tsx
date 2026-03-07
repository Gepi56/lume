import { ReputationCategory } from "@/lib/mock/reputation";

type Props = {
  categories: ReputationCategory[];
};

export function ReputationBreakdown({ categories }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Breakdown reputazione</h2>
        <p className="text-sm text-zinc-400">
          Le aree che compongono il tuo punteggio complessivo.
        </p>
      </div>

      <div className="space-y-5">
        {categories.map((category) => {
          const width = `${Math.min(Math.max(category.score, 0), 100)}%`;

          return (
            <div
              key={category.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">{category.label}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{category.description}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{category.score}/100</p>
                  <p className="text-xs text-zinc-500">Peso {category.weight}%</p>
                </div>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500"
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
