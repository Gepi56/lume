type ProgressItem = {
  id: string;
  label: string;
  current: number;
  target: number;
};

type Props = {
  progress: ProgressItem[];
};

export function EliteProgress({ progress }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Progressi verso Elite</h2>
        <p className="text-sm text-zinc-400">
          Una vista semplice di ciò che è già a livello Elite e di ciò che manca per arrivarci.
        </p>
      </div>

      <div className="space-y-4">
        {progress.map((item) => {
          const percentage = Math.min(Math.max((item.current / item.target) * 100, 0), 100);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-zinc-500">
                    {item.current} / {item.target}
                  </p>
                </div>
                <p className="text-sm font-semibold text-white">{Math.round(percentage)}%</p>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-fuchsia-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
