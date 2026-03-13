import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import CreatorProfileView from "@/components/creators/CreatorProfileView";

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

export default async function CreatorPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="font-semibold">ERRORE ROUTE: params.slug è vuoto</div>
          <div className="text-sm mt-1">
            Stai aprendo <span className="font-mono">/creator</span> senza slug.
          </div>
          <div className="mt-3">
            <Link href="/explore" className="text-sm underline">
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
    .eq("slug", slug)
    .maybeSingle();

  if (creatorError) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-600">
        Errore Supabase (creators): {creatorError.message}
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

  return <CreatorProfileView creator={creator} reviews={(reviews ?? []) as ReviewRow[]} />;
}
