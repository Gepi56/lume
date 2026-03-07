import { EliteBenefits } from "@/components/elite/EliteBenefits";
import { EliteRequirements } from "@/components/elite/EliteRequirements";
import { EliteFaq } from "@/components/elite/EliteFAQ";
import { LumeStatusBanner } from "@/components/shared/LumeStatusBanner";

import { eliteMock } from "@/lib/mock/elite";
import { accountStatusMock } from "@/lib/mock/account-status";

export default function ElitePage() {
  const benefits = eliteMock?.benefits ?? [];
  const requirements = eliteMock?.requirements ?? [];
  const faq = eliteMock?.faq ?? [];
  const actions = eliteMock?.actions ?? [];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            Livello Elite
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Programma Elite
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
              Area dedicata ai profili con reputazione più solida, presenza costante
              e standard qualitativi elevati. La pagina resta prudente, coerente con
              il sito attuale e pronta per futuri collegamenti ai dati reali.
            </p>
          </div>
        </section>

        <LumeStatusBanner
          title="Stato Elite del profilo"
          subtitle="Verifica rapidamente il livello attuale, il punteggio reputazionale e il prossimo traguardo utile per l’accesso o il consolidamento Elite."
          status={accountStatusMock}
        />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <EliteRequirements items={requirements} />
          </div>

          <div className="xl:col-span-1">
            <EliteBenefits items={benefits} />
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Azioni consigliate
            </h2>
            <p className="text-sm text-zinc-400">
              Piccoli passaggi pratici per migliorare o consolidare lo stato Elite.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {actions.length > 0 ? (
              actions.map((action, index) => (
                <div
                  key={`${action}-${index}`}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300"
                >
                  <span className="mr-2 font-semibold text-amber-300">
                    {String(index + 1).padStart(2, "0")}.
                  </span>
                  {action}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
                Nessuna azione disponibile al momento.
              </div>
            )}
          </div>
        </section>

        <EliteFaq items={faq} />
      </div>
    </main>
  );
}
