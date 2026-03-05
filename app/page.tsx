import { supabase } from "@/lib/supabase/client";
import CreatorCard from "@/components/creators/CreatorCard";

export default async function HomePage() {
  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Errore Supabase: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5xl font-semibold tracking-tight">
          Profili del momento
        </h1>
        <p className="mt-2 text-slate-600">
          Social reputazionale privato. Pulito, discreto, premium.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((creator) => (
          <CreatorCard
            key={creator.id}
            model={{
              id: creator.id,
              name: creator.display_name,
              age: creator.age,
              city: creator.city,
              rating: 4.5, // temporaneo finché non creiamo tabella reviews
              reviewsCount: 0,
              bio: creator.bio,
              tags: creator.tags ?? [],
              imageUrl: creator.avatar_url,
              badges: [
                ...(creator.is_verified ? ["verified"] : []),
                ...(creator.tier === "elite" ? ["elite"] : []),
              ],
            }}
          />
        ))}
      </div>
    </div>
  );
}