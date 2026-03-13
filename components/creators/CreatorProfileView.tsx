import Link from "next/link";
import ProfileGallery from "@/components/profile/ProfileGallery";
import { getCreatorGalleryImages } from "@/lib/creators/public";

type CreatorRecord = {
  id: string;
  display_name: string | null;
  slug?: string | null;
  avatar_url: string | null;
  gallery_urls?: string[] | null;
  city: string | null;
  age: number | null;
  bio: string | null;
  tags: string[] | null;
  tier: string | null;
  is_verified: boolean | null;
  show_city?: boolean | null;
  show_age?: boolean | null;
  show_bio?: boolean | null;
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

export default function CreatorProfileView({
  creator,
  reviews,
}: {
  creator: CreatorRecord;
  reviews: ReviewRow[];
}) {
  const reviewsCount = reviews.length;
  const avg =
    reviewsCount > 0
      ? reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) / reviewsCount
      : null;

  const tags = Array.isArray(creator.tags) ? creator.tags : [];
  const isVerified = creator.is_verified === true;
  const isElite = creator.tier === "elite";
  const showCity = creator.show_city !== false;
  const showAge = creator.show_age !== false;
  const showBio = creator.show_bio !== false;
  const images = getCreatorGalleryImages({
    avatarUrl: creator.avatar_url,
    galleryUrls: creator.gallery_urls,
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
        <div className="relative">
          <ProfileGallery images={images} name={creator.display_name || "Profilo"} />

          <div className="absolute top-4 left-4 flex gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-sm text-emerald-700">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Verificata
              </span>
            ) : null}

            {isElite ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm text-amber-800">
                👑 Elite
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
            {creator.display_name || "Profilo"}
            {showAge && creator.age ? `, ${creator.age}` : ""}
          </h1>

          {showCity && creator.city ? (
            <div className="mt-2 text-slate-600">{creator.city}</div>
          ) : null}

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/40 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-amber-500">★</span>
                <div className="text-sm text-slate-700">
                  {avg ? (
                    <>
                      <span className="font-semibold">{avg.toFixed(1)}</span>{" "}
                      <span className="text-slate-500">({reviewsCount} recensioni)</span>
                    </>
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
            <p className="mt-2 text-slate-700 leading-relaxed">
              {showBio ? creator.bio || "—" : "Informazione non visibile pubblicamente."}
            </p>
          </div>

          <div className="mt-6">
            <div className="text-lg font-semibold text-slate-900">Interessi</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.length ? (
                tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-sm text-slate-700"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">Nessun interesse indicato.</span>
              )}
            </div>
          </div>

          <div className="mt-7">
            <Link
              href={`/chat/demo?creator=${encodeURIComponent(creator.display_name || "profilo")}`}
              className="block w-full rounded-full bg-slate-900 py-4 text-center font-semibold text-white shadow-sm transition hover:opacity-95 active:opacity-90"
            >
              Chatta (demo)
            </Link>

            <div className="mt-2 text-xs text-slate-500">
              Demo UI: la chat reale la colleghiamo dopo (step successivo).
            </div>
          </div>

          <div className="mt-8">
            <div className="text-lg font-semibold text-slate-900">Recensioni</div>

            {reviews.length === 0 ? (
              <div className="mt-3 text-sm text-slate-500">Nessuna recensione disponibile.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500">★</span>
                        <span className="font-semibold text-slate-900">{review.rating}</span>

                        {review.verified ? (
                          <span className="ml-2 text-xs rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-emerald-700">
                            verificata
                          </span>
                        ) : null}
                      </div>

                      <div className="text-xs text-slate-500">{formatDate(review.created_at)}</div>
                    </div>

                    {review.comment ? (
                      <p className="mt-3 text-sm leading-6 text-slate-700">{review.comment}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
