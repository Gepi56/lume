import { EditProfileForm } from "@/components/account/EditProfileForm";

export default function AccountPage() {
  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.12),transparent_30%)]" />
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[30px] border border-white/10 bg-black/80 p-8">
          <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            Account Lume
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Modifica profilo utente
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
            Qui puoi aggiornare il profilo del cliente registrato. I profili pubblici delle professioniste restano separati e saranno gestiti nella tabella creators.
          </p>
        </section>

        <EditProfileForm />
      </div>
    </main>
  );
}