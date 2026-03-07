type ReputationEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  impact: "positive" | "neutral" | "negative";
  delta: number;
};

type Props = {
  events: ReputationEvent[];
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ReputationTimeline({ events }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Timeline reputazionale</h2>
        <p className="text-sm text-zinc-400">
          Eventi recenti che hanno influenzato il tuo profilo.
        </p>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "mt-1 h-3.5 w-3.5 rounded-full",
                  event.impact === "positive" && "bg-emerald-400",
                  event.impact === "neutral" && "bg-zinc-500",
                  event.impact === "negative" && "bg-rose-400"
                )}
              />
              {index !== events.length - 1 && (
                <div className="mt-2 h-full w-px bg-white/10" />
              )}
            </div>

            <div className="flex-1 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{event.description}</p>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <p className="text-sm font-medium text-white">{event.date}</p>
                  <p
                    className={cn(
                      "text-xs",
                      event.delta > 0 && "text-emerald-400",
                      event.delta === 0 && "text-zinc-500",
                      event.delta < 0 && "text-rose-400"
                    )}
                  >
                    {event.delta > 0 ? `+${event.delta}` : event.delta} punti
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}