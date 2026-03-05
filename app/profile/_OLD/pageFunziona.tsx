import { supabase } from "@/lib/supabase/client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    return <div className="p-6 text-red-600">ERRORE ROUTE: params.id è vuoto</div>;
  }

  const { data: creator, error } = await supabase
    .from("creators")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Errore Supabase: {error.message}
      </div>
    );
  }

  if (!creator) {
    return <div className="p-6">Profilo non trovato.</div>;
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("professional_id", id)
    .order("created_at", { ascending: false });

  const reviewsCount = reviews?.length ?? 0;

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

      <div>
        <img
          src={creator.avatar_url}
          alt={creator.display_name}
          className="rounded-3xl w-full object-cover"
        />
      </div>

      <div>
        <h1 className="text-4xl font-semibold">
          {creator.display_name}, {creator.age}
        </h1>

        <p className="text-gray-500 mt-1">
          {creator.city}
        </p>

        <p className="mt-4 text-gray-700">
          {creator.bio}
        </p>

        <div className="mt-6 text-sm text-gray-500">
          {reviewsCount} recensioni
        </div>

        <div className="mt-6 space-y-3">
          {reviews?.map((r) => (
            <div key={r.id} className="border rounded-xl p-3">
              ⭐ {r.rating}
              <p className="text-sm text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}