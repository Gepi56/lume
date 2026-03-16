"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import CreatorGalleryManager from "@/components/creator-studio/CreatorGalleryManager";

type GalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
  is_visible: boolean;
};

type CreatorData = {
  id?: string;
  display_name?: string;
  slug?: string;
  tier?: string;
  is_active?: boolean;
  city?: string | null;
  age?: number | null;
  bio?: string | null;
  tags?: string[] | string | null;
  show_city?: boolean;
  show_age?: boolean;
  show_bio?: boolean;
};

type FlexibleProps = {
  creator?: CreatorData | null;
  profile?: CreatorData | null;
  data?: CreatorData | null;
  record?: CreatorData | null;
  initialCreator?: CreatorData | null;
  initialData?: CreatorData | null;

  galleryImages?: GalleryImage[] | null;
  images?: GalleryImage[] | null;
  gallery?: GalleryImage[] | null;
  initialImages?: GalleryImage[] | null;
  initialGallery?: GalleryImage[] | null;

  [key: string]: any;
};

function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error("Configurazione Supabase mancante.");
  }

  return createSupabaseClient(url, anon);
}

function resolveCreator(props: FlexibleProps): CreatorData | null {
  return (
    props.creator ??
    props.profile ??
    props.data ??
    props.record ??
    props.initialCreator ??
    props.initialData ??
    null
  );
}

function resolveGallery(props: FlexibleProps): GalleryImage[] {
  const gallery =
    props.galleryImages ??
    props.images ??
    props.gallery ??
    props.initialImages ??
    props.initialGallery ??
    [];

  return Array.isArray(gallery) ? gallery : [];
}

function normalizeTags(tags: CreatorData["tags"]): string {
  if (Array.isArray(tags)) return tags.join(", ");
  if (typeof tags === "string") return tags;
  return "";
}

export default function CreatorStudioForm(props: FlexibleProps) {
  const initialCreator = resolveCreator(props);
  const initialGallery = resolveGallery(props);

  const [creator, setCreator] = useState<CreatorData | null>(initialCreator);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialGallery);
  const [loading, setLoading] = useState(!initialCreator);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFallbackData() {
      if (initialCreator?.id) return;

      try {
        setLoading(true);
        setError("");

        const supabase = getBrowserSupabase();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("Utente non autenticato.");

        const { data: creatorRow, error: creatorError } = await supabase
          .from("creators")
          .select("*")
          .eq("auth_user_id", user.id)
          .single();

        if (creatorError) throw creatorError;
        if (!creatorRow) throw new Error("Profilo creator non trovato.");

        const { data: imageRows } = await supabase
          .from("creator_images")
          .select("id,image_url,sort_order,is_primary,is_visible")
          .eq("creator_id", creatorRow.id)
          .order("sort_order", { ascending: true });

        if (!cancelled) {
          setCreator(creatorRow);
          setGalleryImages(Array.isArray(imageRows) ? imageRows : []);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Impossibile caricare il profilo creator.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFallbackData();
    return () => {
      cancelled = true;
    };
  }, [initialCreator]);

  const hasCreator =
    !!creator &&
    typeof creator.id === "string" &&
    creator.id.trim().length > 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Gestione profilo pubblico creator</h1>
          <p className="mt-2 text-sm text-slate-600">
            Stiamo completando il caricamento del profilo creator. Riprova tra un attimo.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Dati creator non ancora disponibili. Nessuna modifica è stata persa.
        </div>
      </div>
    );
  }

  if (!hasCreator) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Gestione profilo pubblico creator</h1>
          <p className="mt-2 text-sm text-slate-600">
            Non è stato possibile caricare il profilo creator.
          </p>
        </div>

        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
          {error || "Profilo creator non disponibile."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestione profilo pubblico creator</h1>
            <p className="mt-2 text-sm text-slate-600">
              Qui puoi aggiornare i dati pubblici principali del profilo creator senza toccare la parte cliente.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div><span className="font-medium">Slug:</span> {creator.slug || "—"}</div>
            <div><span className="font-medium">Tier:</span> {creator.tier || "free"}</div>
            <div>
              <span className="font-medium">Stato pubblico:</span>{" "}
              {creator.is_active ? "attiva" : "bozza privata"}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Nome pubblico</label>
              <input
                value={creator.display_name || ""}
                readOnly
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Città</label>
                <input
                  value={creator.city || ""}
                  readOnly
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Età</label>
                <input
                  value={creator.age ?? ""}
                  readOnly
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Bio</label>
              <textarea
                value={creator.bio || ""}
                readOnly
                rows={4}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Tag</label>
              <input
                value={normalizeTags(creator.tags)}
                readOnly
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Visibilità pubblica</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div>{creator.show_city ? "✓" : "•"} Mostra città</div>
                <div>{creator.show_age ? "✓" : "•"} Mostra età</div>
                <div>{creator.show_bio ? "✓" : "•"} Mostra bio</div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Stato account professionista</div>
              <p className="mt-2">Account professionista collegato correttamente.</p>
              <p className="mt-2 text-slate-500">
                Queste informazioni di collegamento restano interne e non sono visibili pubblicamente nella scheda creator.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CreatorGalleryManager creatorId={creator.id!} initialImages={galleryImages} />
    </div>
  );
}