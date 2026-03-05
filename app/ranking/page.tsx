import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type Creator = {
  id: string;
  display_name: string | null;
  city: string | null;
  age: number | null;
  avatar_url: string | null;
  tier: string | null;
  is_verified: boolean | null;
};

type Review = {
  professional_id: string;
  rating: number;
};

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export default async function RankingPage() {
  const { data: creators } = await supabase
    .from("creators")
    .select("id, display_name, city, age, avatar_url, tier, is_verified")
    .eq("is_active", true);

  const { data: reviews } = await supabase
    .from("reviews")
    .select("professional_id, rating");

  const stats: Record<string, { sum: number; count: number }> = {};

  (reviews as Review[] | null)?.forEach((r) => {
    if (!stats[r.professional_id]) {
      stats[r.professional_id] = { sum: 0, count: 0 };
    }

    stats[r.professional_id].sum += r.rating ?? 0;
    stats[r.professional_id].count += 1;
  });

  const list =
    (creators as Creator[] | null)?.map((c) => {
      const s = stats[c.id];

      const count = s?.count ?? 0;
      const avg = count > 0 ? round1(s!.sum / count) : 0;

      return {
        ...c,
        rating: avg,
        reviews: count,
      };
    }) ?? [];

  list.sort((a, b) => {
    if (b.rating === a.rating) {
      return b.reviews - a.reviews;
    }
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">
          Classifica
        </h1>

        <p className="mt-2 text-slate-600">
          Profili con la reputazione più alta sulla piattaforma.
        </p>
      </div>

      <div className="space-y-4">
        {list.map((c, i) => (
          <Link
            key={c.id}
            href={`/profile/${c.id}`}
            className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="text-xl font-semibold w-10 text-center">
              #{i + 1}
            </div>

            <img
              src={c.avatar_url || ""}
              alt={c.display_name || ""}
              className="h-16 w-16 rounded-xl object-cover"
            />

            <div className="flex-1">
              <div className="font-semibold">
                {c.display_name} {c.age ? ` ${c.age}` : ""}
              </div>

              <div className="text-sm text-slate-500">
                {c.city}
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold">
                ★ {c.rating.toFixed(1)}
              </div>

              <div className="text-xs text-slate-500">
                {c.reviews} recensioni
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}