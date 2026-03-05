import Link from "next/link";
import ProfilesGrid from "@/components/explore/ProfilesGrid";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Lume</h1>

        <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">
          Private Reputation Network. Profili, reputazione e trasparenza. Naviga,
          confronta e scopri i profili in modo semplice.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 font-semibold text-white shadow-sm hover:opacity-95"
          >
            Vai a Esplora
          </Link>

          <Link
            href="/reputation"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-900 hover:bg-slate-50"
          >
            Come funziona la reputazione
          </Link>
        </div>
      </div>

      {/* PROFILI SUBITO (più coinvolgente) */}
      <ProfilesGrid
        title="Profili del momento"
        subtitle="Selezione rapida: entra, scorri e apri i profili."
        limit={9}
      />

      {/* CTA finale piccola */}
      <div className="flex justify-center">
        <Link
          href="/explore"
          className="text-sm font-semibold text-slate-700 underline hover:text-slate-900"
        >
          Vedi tutti i profili →
        </Link>
      </div>
    </div>
  );
}