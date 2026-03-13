import Link from "next/link";
import CreatorProfileView from "@/components/creators/CreatorProfileView";
import {
  getCreatorBySlug,
  getCreatorImages,
  getCreatorReviews,
} from "@/lib/server/creators-public";

export default async function CreatorPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="font-semibold">ERRORE ROUTE: params.slug è vuoto</div>
          <div className="text-sm mt-1">Stai aprendo /creator senza slug.</div>
          <div className="mt-3">
            <Link href="/explore" className="text-sm underline">
              Torna ai profili
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { creator, errorMessage } = await getCreatorBySlug(slug);

  if (errorMessage) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-600">
        Errore Supabase (creator): {errorMessage}
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-lg font-semibold">Creator non trovata.</div>
          <div className="mt-3">
            <Link href="/explore" className="text-sm underline">
              Torna ai profili
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [{ reviews, errorMessage: reviewsError }, { images, errorMessage: imagesError }] =
    await Promise.all([getCreatorReviews(creator.id), getCreatorImages(creator.id)]);

  if (reviewsError) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-600">
        Errore Supabase (reviews): {reviewsError}
      </div>
    );
  }

  if (imagesError) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-600">
        Errore Supabase (creator_images): {imagesError}
      </div>
    );
  }

  return <CreatorProfileView creator={creator} reviews={reviews} creatorImages={images} />;
}
