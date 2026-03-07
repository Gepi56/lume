type Benefit = {
  id: string;
  title: string;
  description: string;
  highlight: string;
};

type Props = {
  benefits: Benefit[];
};

export function EliteBenefits({ benefits }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Vantaggi Elite</h2>
        <p className="text-sm text-zinc-400">
          I profili Elite ottengono maggiore evidenza, più fiducia percepita e una presenza più forte all'interno della piattaforma.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {benefits.map((benefit) => (
          <article
            key={benefit.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-5"
          >
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-amber-300">{benefit.highlight}</p>
              <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
              <p className="text-sm leading-6 text-zinc-400">{benefit.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
