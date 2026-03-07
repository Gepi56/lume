import { Metadata } from "next";
import { ReputationOverview } from "@/components/reputation/ReputationOverview";
import { ReputationBreakdown } from "@/components/reputation/ReputationBreakdown";
import { ReputationTimeline } from "@/components/reputation/ReputationTimeline";
import { ReputationTips } from "@/components/reputation/ReputationTips";
import { reputationMock } from "@/lib/mock/reputation";

export const metadata: Metadata = {
  title: "Reputation | Lume",
  description: "Panoramica completa della reputazione profilo su Lume",
};

export default function ReputationPage() {
  const data = reputationMock;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
            Reputation Lume
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              La tua reputazione
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
              Una vista completa del tuo livello di affidabilità, qualità percepita
              e costanza sulla piattaforma. Questa pagina è pensata per essere
              chiara, stabile e facilmente collegabile ai dati reali in un secondo momento.
            </p>
          </div>
        </section>

        <ReputationOverview data={data} />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ReputationBreakdown categories={data.categories} />
          </div>

          <div className="xl:col-span-1">
            <ReputationTips tips={data.tips} />
          </div>
        </div>

        <ReputationTimeline events={data.events} />
      </div>
    </main>
  );
}
