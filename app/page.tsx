import Link from "next/link";

export default function HomePage() {
  return (
    <div className="py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Lume
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">
          Private Reputation Network. Profili, reputazione e trasparenza.
          Naviga, confronta e scopri i profili in modo semplice.
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
    </div>
  );
}