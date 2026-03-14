import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import ProfileGallery from "@/components/profile/ProfileGallery";
import { getCreatorGalleryImages } from "@/lib/server/creator-gallery";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ReviewRow = {
  id: string;
  professional_id: string;
  rating: number;
  comment: string | null;
  verified: boolean;
  created_at: string;
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("it-IT");
  } catch {
    return "";
  }
}

function StarRow({ value }: { value: number }) {
  const full = Math.round(value);
  const stars = Array.from({ length: 5 }, (_, i) => i < full);
  return (
    <div className="flex items-center gap-1">
      {stars.map((on, i) => (
        <span key={i} className={on ? "text-amber-500" : "text-slate-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default async function CreatorBySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent((slug ?? "").trim());

  if (!cleanSlug) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-lg font-semibold">Slug mancante.</div>
          <div className="mt-3">
            <Link href="/creators" className="text-sm underline">
              Torna ai profili
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data: creator, error: creatorError } = await supabase
    .from("creators")
    .select("*")
    .eq("slug", cleanSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (creatorError) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-600">
        Errore Supabase (creator slug): {creatorError.message}
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-lg font-semibold">Creator non trovata.</div>
          <div className="mt-1 text-sm text-slate-600">
            Lo slug richiesto non corrisponde a nessun profilo pubblico attivo.
          </div>
          <div className="mt-3">
            <Link href="/creators" className="text-sm underline">
              Torna ai profili
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("id, professional_id, rating, comment, verified, created_at")
    .eq("professional_id", creator.id)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-600">
        Errore Supabase (reviews): {reviewsError.message}
      </div>
    );
  }

  const safeReviews = (reviews ?? []) as ReviewRow[];
  const reviewsCount = safeReviews.length;
  const avg =
    reviewsCount > 0
      ? safeReviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) / reviewsCount
      : null;

  const tags: string[] = Array.isArray(creator.tags) ? creator.tags : [];
  const isVerified = !!creator.is_verified;
  const tier = (creator.tier as string | null) ?? null;
  const isElite = tier === "elite";
  const galleryUrls: string[] = Array.isArray(creator.gallery_urls) ? creator.gallery_urls : [];
  const images = await getCreatorGalleryImages({
    supabase,
    creatorId: creator.id,
    avatarUrl: creator.avatar_url,
    legacyGalleryUrls: galleryUrls,
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
        <div className="relative">
          <ProfileGallery images={images} name={creator.display_name || "Profilo"} />
          <div className="absolute top-4 left-4 flex gap-2">
            {isVerified && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-sm text-emerald-700">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Verificata
              </span>
            )}
            {isElite && (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm text-amber-800">👑 Elite</span>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
            {creator.display_name}
            {creator.show_age !== false && creator.age ? `, ${creator.age}` : ""}
          </h1>
          <div className="mt-2 text-slate-600">{creator.show_city !== false ? (creator.city || "") : ""}</div>
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/40 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-amber-500">★</span>
                <div className="text-sm text-slate-700">
                  {avg ? (
                    <><span className="font-semibold">{avg.toFixed(1)}</span> <span className="text-slate-500">({reviewsCount} recensioni)</span></>
                  ) : (
                    <span className="text-slate-500">0 recensioni</span>
                  )}
                </div>
              </div>
              {avg ? <StarRow value={avg} /> : null}
            </div>
          </div>
          <div className="mt-7">
            <div className="text-lg font-semibold text-slate-900">Chi sono</div>
            <p className="mt-2 text-slate-700 leading-relaxed">{creator.show_bio !== false ? (creator.bio || "—") : "Bio non visibile pubblicamente."}</p>
          </div>
          <div className="mt-6">
            <div className="text-lg font-semibold text-slate-900">Interessi</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.length ? tags.map((t: string) => <span key={t} className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-sm text-slate-700">{t}</span>) : <span className="text-sm text-slate-500">Nessun interesse indicato.</span>}
            </div>
          </div>
          <div className="mt-7">
            <Link href={`/chat/demo?creator=${encodeURIComponent(creator.display_name || "profilo")}`} className="block w-full rounded-full bg-slate-900 py-4 text-center font-semibold text-white shadow-sm transition hover:opacity-95 active:opacity-90">Chatta (demo)</Link>
            <div className="mt-2 text-xs text-slate-500">Demo UI: la chat reale la colleghiamo dopo (step successivo).</div>
          </div>
          <div className="mt-8">
            <div className="text-lg font-semibold text-slate-900">Recensioni</div>
            {safeReviews.length === 0 ? <div className="mt-3 text-sm text-slate-500">Nessuna recensione disponibile.</div> : (
              <div className="mt-4 space-y-3">
                {safeReviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500">★</span>
                        <span className="font-semibold text-slate-900">{r.rating}</span>
                        {r.verified ? <span className="ml-2 text-xs rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-emerald-700">verificata</span> : null}
                      </div>
                      <div className="text-xs text-slate-500">{formatDate(r.created_at)}</div>
                    </div>
                    {r.comment ? <div className="mt-2 text-sm text-slate-700">{r.comment}</div> : <div className="mt-2 text-sm text-slate-500">—</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8"><Link href="/creators" className="text-sm underline text-slate-600">← Torna ai profili</Link></div>
        </div>
      </div>
    </div>
  );
}
