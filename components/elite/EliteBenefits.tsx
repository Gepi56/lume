type EliteBenefit = {
  title: string;
  description: string;
};

type Props = {
  items?: EliteBenefit[];
  benefits?: EliteBenefit[];
};

export function EliteBenefits({ items, benefits }: Props) {
  const safeBenefits = items ?? benefits ?? [];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Vantaggi Elite
        </h2>
        <p className="text-sm text-zinc-400">
          Benefici reputazionali e di visibilità legati allo stato Elite.
        </p>
      </div>

      <div className="space-y-3">
        {safeBenefits.length > 0 ? (
          safeBenefits.map((benefit, index) => (
            <div
              key={`${benefit.title}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <h3 className="text-sm font-semibold text-white">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {benefit.description}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
            Nessun vantaggio disponibile al momento.
          </div>
        )}
      </div>
    </section>
  );
}
