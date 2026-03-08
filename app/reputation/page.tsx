import { ReputationOverview } from "@/components/reputation/ReputationOverview";
import { ReputationBreakdown } from "@/components/reputation/ReputationBreakdown";
import { ReputationTimeline } from "@/components/reputation/ReputationTimeline";
import { ReputationTips } from "@/components/reputation/ReputationTips";
import { LumeStatusBanner } from "@/components/shared/LumeStatusBanner";
import { getLumeFeaturedPublicData } from "@/lib/server/lume-public";

export default async function ReputationPage() {
  const data = await getLumeFeaturedPublicData();

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#16041a] via-[#06020a] to-black text-zinc-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_30%)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-3 rounded-[30px] border border-fuchsia-500/10 bg-black/80 p-8">
          <div className="inline-flex items-center rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
            Reputazione Lume
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              La reputazione del profilo in evidenza
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
              Pagina pubblica con dati reali provenienti da Supabase. La grafica
              resta invariata: cambia solo la sorgente dati, con fallback sicuri
              nel caso in cui il database non abbia ancora abbastanza informazioni.
            </p>
          </div>
        </section>

        <LumeStatusBanner
          title={`Stato profilo: ${data.creatorName}`}
          subtitle={`Profilo pubblico in evidenza${data.creatorCity ? ` • ${data.creatorCity}` : ""}`}
          status={data.accountStatus}
        />

        <ReputationOverview data={data.reputation} />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ReputationBreakdown categories={data.reputation.categories} />
          </div>

          <div className="xl:col-span-1">
            <ReputationTips tips={data.reputation.tips} />
          </div>
        </div>

        <ReputationTimeline events={data.reputation.events} />
      </div>
    </main>
  );
}
