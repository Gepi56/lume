import { EliteBenefits } from "@/components/elite/EliteBenefits";
import { EliteRequirements } from "@/components/elite/EliteRequirements";
import { EliteFaq } from "@/components/elite/EliteFAQ";
import { LumeStatusBanner } from "@/components/shared/LumeStatusBanner";
import { getLumeFeaturedPublicData } from "@/lib/server/lume-public";

export default async function ElitePage() {
  const data = await getLumeFeaturedPublicData();

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
              Pagina pubblica con criteri Elite basati su dati reali Supabase del
              profilo più forte tra quelli attivi. Nessun redesign: solo lettura
              reale del database e fallback prudenti.
            </p>
          </div>
        </section>

        <LumeStatusBanner
          title={`Stato Elite: ${data.creatorName}`}
          subtitle={`Valutazione reale del profilo in evidenza${data.creatorCity ? ` • ${data.creatorCity}` : ""}`}
          status={data.accountStatus}
        />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <EliteRequirements items={data.elite.requirements} />
          </div>

          <div className="xl:col-span-1">
            <EliteBenefits items={data.elite.benefits} />
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Azioni consigliate
            </h2>
            <p className="text-sm text-zinc-400">
              Passaggi concreti derivati dalla situazione reale del profilo attivo in evidenza.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {data.elite.actions.length > 0 ? (
              data.elite.actions.map((action, index) => (
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

        <EliteFaq items={data.elite.faq} />
      </div>
    </main>
  );
}
