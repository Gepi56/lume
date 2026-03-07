import { Metadata } from "next";
import { ReputationTimeline } from "@/components/reputation/ReputationTimeline";
import { ReputationTips } from "@/components/reputation/ReputationTips";
import { LumeStatusBanner } from "@/components/shared/LumeStatusBanner";

import { reputationMock } from "@/lib/mock/reputation";
import { accountStatusMock } from "@/lib/mock/account-status";

export const metadata: Metadata = {
  title: "Reputation | Lume",
  description: "Panoramica reputazionale del profilo su Lume",
};

export default function ReputationPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
            Reputation
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Reputazione del profilo
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
              Una vista chiara e ordinata dello stato reputazionale del profilo, con
              focus su punteggio, andamento e prossimi obiettivi utili per crescere
              nel ranking interno di Lume.
            </p>
          </div>
        </section>

        <LumeStatusBanner
          title="Stato reputazionale"
          subtitle="Una sintesi immediata del profilo, utile per capire il posizionamento attuale e la distanza dai livelli superiori."
          status={accountStatusMock}
        />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:col-span-2">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-400">Punteggio complessivo</p>

                <div className="flex items-end gap-3">
                  <span className="text-5xl font-bold tracking-tight">{reputationMock.score}</span>
                  <span className="pb-1 text-lg text-zinc-400">/100</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill label={reputationMock.level} tone="primary" />
                  {reputationMock.isVerified && <StatusPill label="Verificata" tone="success" />}
                  {reputationMock.isElite && <StatusPill label="Elite" tone="warning" />}
                </div>
              </div>

              <div className="max-w-sm space-y-2">
                <p className="text-sm text-zinc-300">{reputationMock.summary}</p>
                <p className="text-xs text-zinc-500">
                  Ultimo aggiornamento: {reputationMock.lastUpdated}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(reputationMock.score, 0), 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>In crescita</span>
                <span>Obiettivo Elite: 90+</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
            {reputationMock.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-xs uppercase tracking-wide text-zinc-500">{metric.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                <p
                  className={cn(
                    "mt-2 text-xs",
                    metric.trend === "up" && "text-emerald-400",
                    metric.trend === "down" && "text-rose-400",
                    metric.trend === "neutral" && "text-zinc-400"
                  )}
                >
                  {metric.delta}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ReputationTimeline events={reputationMock.events} />
          </div>

          <div className="xl:col-span-1">
            <ReputationTips tips={reputationMock.tips} />
          </div>
        </div>
      </div>
    </main>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "primary" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "primary" && "bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-500/20",
        tone === "success" && "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20",
        tone === "warning" && "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/20"
      )}
    >
      {label}
    </span>
  );
}
