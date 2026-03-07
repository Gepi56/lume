import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden min-h-[540px] overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.16),transparent_40%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  Accesso Lume
                </div>
                <h1 className="max-w-md text-4xl font-semibold tracking-tight text-white">
                  Rientra nella tua area personale
                </h1>
                <p className="max-w-lg text-sm leading-7 text-zinc-400">
                  Struttura login pensata per l’evoluzione futura del progetto: area utente,
                  area creator, messaggi reali e gestione profilo. Per ora resta prudente,
                  coerente e separata dalle pagine pubbliche già stabili.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Feature title="Supabase Auth" text="Autenticazione collegata a Supabase tramite anon key pubblica." />
                <Feature title="UI stabile" text="Nessun impatto su home, explore, profile, ranking, reputation o elite." />
                <Feature title="Pronta per ruoli" text="Base adatta a visitor, premium, creator e admin in fase successiva." />
              </div>
            </div>
          </section>

          <section className="bg-zinc-950/70 p-6 sm:p-7 lg:p-8">
            <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center">
              <div className="mb-6 space-y-2">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
                  Login
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  Accedi
                </h2>
                <p className="text-sm leading-6 text-zinc-400">
                  Inserisci email e password per entrare nel tuo account Lume.
                </p>
              </div>

              <LoginForm />

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
                <Link href="/" className="transition hover:text-white">
                  Torna alla home
                </Link>
                <Link href="/register" className="transition hover:text-white">
                  Crea un account
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
