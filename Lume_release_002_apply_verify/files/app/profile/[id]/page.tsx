import Link from "next/link";
import { redirect } from "next/navigation";
import CreatorProfileView from "@/components/creators/CreatorProfileView";
import {
  getCreatorById,
  getCreatorImages,
  getCreatorReviews,
} from "@/lib/server/creators-public";
import { getCreatorPublicPath } from "@/lib/creators/public";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="font-semibold">ERRORE ROUTE: params.id è vuoto</div>
          <div className="text-sm mt-1">
            Stai aprendo <span className="font-mono">/profile</span> senza id.
          </div>
          <div className="mt-3">
            <Link href="/" className="text-sm underline">
              Torna alla home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { creator, errorMessage } = await getCreatorById(id);

  if (errorMessage) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-600">
        Errore Supabase (creators): {errorMessage}
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-lg font-semibold">Profilo non trovato.</div>
          <div className="mt-3">
            <Link href="/" className="text-sm underline">
              Torna alla home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (creator.slug) {
    redirect(getCreatorPublicPath({ slug: creator.slug, id: creator.id }));
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
