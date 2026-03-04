import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="p-6 text-red-600">
        ERRORE ROUTE: params.id vuoto
      </div>
    );
  }

  const { data: creator, error } = await supabase
    .from("creators")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return <div className="p-6 text-red-600">Errore Supabase: {error.message}</div>;
  }

  if (!creator) {
    return (
      <div className="space-y-4 p-6">
        <div className="text-xl font-semibold">Profilo non trovato.</div>
        <Link href="/" className="text-blue-600 underline">
          Torna alla home
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 shadow-sm">
        <div className="relative aspect-[3/4]">
          {creator.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creator.avatar_url}
              alt={creator.display_name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-8xl font-semibold text-slate-400">
                {String(creator.display_name ?? "U").slice(0, 1).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h1 className="text-5xl font-semibold tracking-tight">
            {creator.display_name}
            {creator.age ? `, ${creator.age}` : ""}
          </h1>
          <div className="mt-1 text-slate-600">{creator.city}</div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 px-4 py-3 text-sm">
          ⭐ 4.5 <span className="text-slate-500">(0 recensioni)</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Chi sono</h2>
          <p className="text-slate-700">{creator.bio}</p>
        </div>

        {!!creator.tags?.length && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Interessi</h2>
            <div className="flex flex-wrap gap-2">
              {creator.tags.map((t: string) => (
                <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <button className="h-12 w-full rounded-2xl bg-slate-900 font-semibold text-white">
          Chatta (demo)
        </button>
      </div>
    </div>
  );
}