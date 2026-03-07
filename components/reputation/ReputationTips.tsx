type Props = {
  tips: string[];
};

export function ReputationTips({ tips }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Come migliorare</h2>
        <p className="text-sm text-zinc-400">
          Piccole azioni che aumentano affidabilità e ranking.
        </p>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={`${tip}-${index}`}
            className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300"
          >
            <span className="mr-2 font-semibold text-fuchsia-300">
              {String(index + 1).padStart(2, "0")}.
            </span>
            {tip}
          </div>
        ))}
      </div>
    </section>
  );
}
