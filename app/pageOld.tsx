import Link from "next/link";
import ProfilesGrid from "@/components/explore/ProfilesGrid";

function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-14">
      {/* HERO PREMIUM */}
      <section className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_35%)]" />

        <div className="relative grid grid-cols-1 gap-10 px-8 py-12 md:px-12 md:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
              Private Reputation Network
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Profili, reputazione e connessioni in un ambiente più pulito e discreto.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              Lume è una piattaforma reputazionale privata pensata per offrire
              una navigazione più ordinata, una presentazione più elegante dei
              profili e un’esperienza visiva più moderna.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Esplora i profili
              </Link>

              <Link
                href="/reputation"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Come funziona la reputazione
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
              <div>
                <span className="text-xl font-semibold text-slate-900">UI</span>{" "}
                moderna e premium
              </div>
              <div>
                <span className="text-xl font-semibold text-slate-900">Profili</span>{" "}
                verificati e ordinati
              </div>
              <div>
                <span className="text-xl font-semibold text-slate-900">Chat</span>{" "}
                demo già integrata
              </div>
            </div>
          </div>

          {/* HERO SIDE PANEL */}
          <div className="grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
                Esperienza premium
              </div>
              <div className="mt-3 text-2xl font-semibold leading-tight">
                Un’interfaccia più elegante per consultare i profili in modo rapido.
              </div>
              <div className="mt-4 text-sm leading-6 text-white/70">
                Layout pulito, immagini protagoniste, badge reputazionali e
                percorsi chiari tra profilo, classifica, reputazione ed Elite.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Reputazione
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">
                  Trasparente
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Rating e recensioni leggibili in modo semplice.
                </div>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">
                  Elite
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">
                  Visibilità premium
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  Posizionamento più curato e badge dedicati.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILI DEL MOMENTO */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              Selezione
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Profili del momento
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Una selezione immediata dei profili più interessanti presenti nella
              piattaforma.
            </p>
          </div>

          <Link
            href="/explore"
            className="hidden rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 md:inline-flex"
          >
            Vedi tutti
          </Link>
        </div>

        <ProfilesGrid
          title=""
          subtitle=""
          limit={6}
        />

        <div className="flex justify-center md:hidden">
          <Link
            href="/explore"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Vedi tutti i profili
          </Link>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="space-y-6">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            Metodo
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Come funziona Lume
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FeatureCard
            title="Profili più ordinati"
            text="Ogni profilo viene mostrato in una struttura chiara: immagini, bio, interessi, badge e recensioni sono immediatamente leggibili."
          />
          <FeatureCard
            title="Reputazione più visibile"
            text="Il sistema valorizza rating, numero di recensioni e segnali reputazionali in modo semplice, senza sovraccaricare la navigazione."
          />
          <FeatureCard
            title="Esperienza più riservata"
            text="L’interfaccia è pensata per offrire un ambiente più discreto, pulito e premium, con percorsi di navigazione più essenziali."
          />
        </div>
      </section>

      {/* ELITE SECTION */}
      <section className="rounded-[36px] border border-slate-200 bg-slate-900 px-8 py-10 text-white shadow-sm md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
              👑 Elite
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
              Un livello visivo e reputazionale più alto.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
              Il livello Elite mette in evidenza i profili con una presenza più
              curata, un posizionamento più forte e una percezione più premium
              all’interno della piattaforma.
            </p>

            <div className="mt-7">
              <Link
                href="/elite"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:opacity-95"
              >
                Scopri Elite
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">
                Badge dedicato
              </div>
              <div className="mt-2 text-sm leading-6 text-white/70">
                Un segnale visivo immediato che valorizza la presenza del profilo.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">
                Maggiore impatto
              </div>
              <div className="mt-2 text-sm leading-6 text-white/70">
                Presentazione più forte, più elegante e più memorabile nella navigazione.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">
                Esperienza premium
              </div>
              <div className="mt-2 text-sm leading-6 text-white/70">
                Coerenza con una piattaforma più esclusiva e più raffinata.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="rounded-[36px] border border-slate-200 bg-white px-8 py-10 shadow-sm md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              Inizia da qui
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Entra in Lume e scopri i profili.
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Naviga tra i profili, consulta reputazione e recensioni, esplora
              il sistema Elite e prova l’esperienza visiva della piattaforma.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Vai a Esplora
            </Link>

            <Link
              href="/ranking"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Apri Classifica
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}