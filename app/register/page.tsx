import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#1a1204] via-[#080602] to-black text-zinc-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(180,83,9,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(21,128,61,0.14),transparent_30%)]" />
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-[28px] border border-white/10 bg-black/75 shadow-2xl shadow-black/20 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden min-h-[540px] overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,119,6,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.16),transparent_40%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                  Registrazione Lume
                </div>
                <h1 className="max-w-md text-4xl font-semibold tracking-tight text-white">
                  Crea la base del tuo account
                </h1>
                <p className="max-w-lg text-sm leading-7 text-zinc-400">
                  Registrazione pronta per la fase successiva del progetto. Qui costruiamo
                  una base stabile, pulita e coerente con Supabase Auth, senza introdurre
                  ancora complessità di ruoli o dashboard avanzate.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Feature title="Struttura pulita" text="Pagina separata, nessun impatto sulle aree pubbliche del sito." />
                <Feature title="Conferma email" text="Supporta il flusso standard Supabase di verifica indirizzo email." />
                <Feature title="Pronta a espandersi" text="Base ideale per area utente, creator e admin nei passaggi successivi." />
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-b from-[#1a1204] via-[#080602] to-black/70 p-6 sm:p-7 lg:p-8">
            <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center">
              <div className="mb-6 space-y-2">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
                  Registrazione
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  Crea account
                </h2>
                <p className="text-sm leading-6 text-zinc-400">
                  Inserisci i dati richiesti per avviare il tuo accesso a Lume.
                </p>
              </div>

              <RegisterForm />

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
                <Link href="/" className="transition hover:text-white">
                  Torna alla home
                </Link>
                <Link href="/login" className="transition hover:text-white">
                  Hai già un account?
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-400">{text}</p>
    </div>
  );
}
