type EliteFaqItem = {
  question: string;
  answer: string;
};

type Props = {
  items?: EliteFaqItem[];
};

export function EliteFaq({ items }: Props) {
  const safeItems = items ?? [];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Domande frequenti
        </h2>
        <p className="text-sm text-zinc-400">
          Risposte rapide sui criteri Elite e sui vantaggi previsti.
        </p>
      </div>

      <div className="space-y-4">
        {safeItems.length > 0 ? (
          safeItems.map((item, index) => (
            <div
              key={`${item.question}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <h3 className="text-sm font-semibold text-white">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{item.answer}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
            Nessuna FAQ disponibile al momento.
          </div>
        )}
      </div>
    </section>
  );
}
