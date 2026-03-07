import React from "react";

type AccountStatus = {
  reputationScore: number;
  reputationLevel: string;
  isVerified: boolean;
  isElite: boolean;
  nextGoalLabel: string;
  nextGoalValue: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  status: AccountStatus;
};

export function LumeStatusBanner({
  title = "Stato account",
  subtitle = "Panoramica sintetica del profilo all'interno dell'ecosistema Lume.",
  status,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
            Stato Lume
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
            <p className="max-w-2xl text-sm leading-6 text-zinc-400">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge>{status.reputationLevel}</Badge>
            {status.isVerified && <Badge tone="success">Verificata</Badge>}
            {status.isElite && <Badge tone="warning">Elite</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Reputazione" value={`${status.reputationScore}/100`} />
          <StatCard label="Livello" value={status.reputationLevel} />
          <StatCard label="Prossimo obiettivo" value={status.nextGoalValue} />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
          <span>Avanzamento</span>
          <span>{status.nextGoalLabel}</span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400"
            style={{ width: `${Math.min(Math.max(status.reputationScore, 0), 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function Badge({
  children,
  tone = "primary",
}: {
  children: React.ReactNode;
  tone?: "primary" | "success" | "warning";
}) {
  const classes =
    tone === "success"
      ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20"
      : tone === "warning"
      ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/20"
      : "bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-500/20";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${classes}`}>
      {children}
    </span>
  );
}
