type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type Props = {
  items: FAQItem[];
};

export function EliteFAQ({ items }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Domande frequenti</h2>
        <p className="text-sm text-zinc-400">
          Sezione utile per spiegare in modo semplice come funziona il livello Elite.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.id}
            className="group rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-white">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
