import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type Creator = {
  id: string;
  display_name: string | null;
  city: string | null;
  age: number | null;
  bio: string | null;
  tags: string[] | null;
  avatar_url: string | null;
  tier: string | null;
  is_verified: boolean | null;
  is_active: boolean | null;
};

type Review = {
  professional_id: string;
  rating: number;
};

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export default async function ProfilesGrid({
  title = "Profili del momento",
  subtitle = "Social reputazionale privato. Pulito, discreto, premium.",
  limit = 12,
  onlyVerified = false,
  onlyElite = false,
  city = "",
}: {
  title?: string;
  subtitle?: string;
  limit?: number;
  onlyVerified?: boolean;
  onlyElite?: boolean;
  city?: string;
}) {
  // 1) Creators attivi
  let q = supabase
    .from("creators")
    .select("id, display_name, city, age, bio, tags, avatar_url, tier, is_verified, is_active")
    .eq("is_active", true)
    .limit(limit);

  if (onlyVerified) q = q.eq("is_verified", true);
  if (onlyElite) q = q.eq("tier", "elite");
  if (city?.trim()) q = q.ilike("city", `%${city.trim()}%`);

  const { data: creators, error: creatorsError } = await q;

  if (creatorsError) {
    return <div className="text-red-600">Errore creators: {creatorsError.message}</div>;
  }

  const list = (creators ?? []) as Creator[];
  const ids = list.map((c) => c.id);

  // 2) Reviews per calcolo media + count
  const reviewsById: Record<string, { sum: number; count: number }> = {};
  if (ids.length > 0) {
    const { data: reviews } = await supabase
      .from("reviews")
      .select("professional_id, rating")
      .in("professional_id", ids);

    (reviews as Review[] | null)?.forEach((r) => {
      if (!reviewsById[r.professional_id]) reviewsById[r.professional_id] = { sum: 0, count: 0 };
      reviewsById[r.professional_id].sum += r.rating ?? 0;
      reviewsById[r.professional_id].count += 1;
    });
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 text-slate-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((c) => {
          const agg = reviewsById[c.id];
          const count = agg?.count ?? 0;
          const avg = count > 0 ? round1(agg!.sum / count) : 0;

          return (
            <Link
              key={c.id}
              href={`/profile/${c.id}`}
              className="group rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative">
                <div className="aspect-[4/5] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.avatar_url || ""}
                    alt={c.display_name || "Profilo"}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                <div className="absolute top-3 left-3 flex gap-2">
                  {c.is_verified ? (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700">
                      ✓ Verificata
                    </span>
                  ) : null}

                  {c.tier === "elite" ? (
                    <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-800">
                      👑 Elite
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">
                      {c.display_name || "—"}{c.age ? ` ${c.age}` : ""}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">{c.city || "—"}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold">★ {avg.toFixed(1)}</div>
                    <div className="text-xs text-slate-500">({count} recensioni)</div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-700 line-clamp-2">
                  {c.bio || "—"}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(Array.isArray(c.tags) ? c.tags : []).slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 text-sm font-semibold text-slate-900 opacity-80 group-hover:opacity-100">
                  Apri profilo →
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {list.length === 0 ? <div className="mt-6 text-slate-500">Nessun profilo trovato.</div> : null}
    </div>
  );
}