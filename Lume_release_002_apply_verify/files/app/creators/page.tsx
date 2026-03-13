import ProfilesGrid from "@/components/explore/ProfilesGrid";

export default function CreatorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          Creator e professioniste
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Elenco pubblico dei profili attivi di Lume. Questa pagina consolida il ramo creator
          separato dalla parte cliente e prepara la navigazione definitiva basata su slug.
        </p>
      </div>

      <ProfilesGrid
        title="Profili pubblici"
        subtitle="Solo creator attive, con link pubblico coerente e base pronta per ranking e gallery evoluta."
        limit={48}
      />
    </div>
  );
}
