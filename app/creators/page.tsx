import ProfilesGrid from "@/components/explore/ProfilesGrid";

export default async function CreatorsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">Creator e professioniste</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
            Elenco pubblico dei profili attivi di Lume. Questa pagina consolida il ramo creator separato dalla parte cliente.
          </p>
        </div>
      </section>
      <ProfilesGrid title="Profili pubblici" subtitle="Solo creator attive, con link pubblico coerente e base pronta per ranking e gallery evoluta." limit={24} />
    </div>
  );
}
