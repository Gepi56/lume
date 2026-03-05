import ExploreFilters from "@/components/explore/ExploreFilters";
import ProfilesGrid from "@/components/explore/ProfilesGrid";

type SearchParams = {
  city?: string;
  verified?: string;
  elite?: string;
};

export default async function ExplorePage({
  searchParams,
}: {
  // In questa versione di Next, per sicurezza trattiamo anche searchParams come Promise
  searchParams: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};

  const city = (sp.city ?? "").toString();
  const onlyVerified = sp.verified === "1";
  const onlyElite = sp.elite === "1";

  return (
    <div className="space-y-6">
      <ExploreFilters
        initialCity={city}
        initialVerified={onlyVerified}
        initialElite={onlyElite}
      />

      <ProfilesGrid
        title="Profili del momento"
        subtitle="Filtra e apri i profili: veloce, pulito, premium."
        limit={24}
        city={city}
        onlyVerified={onlyVerified}
        onlyElite={onlyElite}
      />
    </div>
  );
}