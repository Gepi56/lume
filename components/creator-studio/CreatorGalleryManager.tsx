"use client";

import { useMemo, useRef, useState } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

type GalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
  is_visible: boolean;
};

type Props = {
  creatorId: string;
  initialImages: GalleryImage[];
};

function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error("Configurazione Supabase client mancante.");
  }

  return createSupabaseClient(url, anon);
}

export default function CreatorGalleryManager({ creatorId, initialImages }: Props) {
  const supabase = getBrowserSupabase();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>("");

  const sorted = useMemo(
    () => [...images].sort((a, b) => a.sort_order - b.sort_order),
    [images]
  );

  async function refresh() {
    const { data, error } = await supabase
      .from("creator_images")
      .select("id,image_url,sort_order,is_primary,is_visible")
      .eq("creator_id", creatorId)
      .order("sort_order", { ascending: true });

    if (!error && data) setImages(data as GalleryImage[]);
  }

  async function handleUpload(file: File) {
    try {
      setBusy(true);
      setMessage("");

      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${creatorId}/${Date.now()}.${ext}`;

      const upload = await supabase.storage
        .from("creator-images")
        .upload(filePath, file, { upsert: true });

      if (upload.error) throw upload.error;

      const { data: urlData } = supabase.storage
        .from("creator-images")
        .getPublicUrl(filePath);

      const nextOrder = images.length ? Math.max(...images.map(i => i.sort_order)) + 1 : 0;
      const isFirst = images.length === 0;

      const insert = await supabase.from("creator_images").insert({
        creator_id: creatorId,
        image_url: urlData.publicUrl,
        sort_order: nextOrder,
        is_primary: isFirst,
        is_visible: true,
      });

      if (insert.error) throw insert.error;

      await refresh();
      setMessage("Immagine caricata correttamente.");
    } catch (e: any) {
      setMessage(e?.message || "Errore durante il caricamento.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function setPrimary(imageId: string) {
    setBusy(true);
    setMessage("");
    try {
      const currentPrimary = images.find(i => i.is_primary);
      if (currentPrimary) {
        await supabase.from("creator_images").update({ is_primary: false }).eq("id", currentPrimary.id);
      }
      const res = await supabase.from("creator_images").update({ is_primary: true }).eq("id", imageId);
      if (res.error) throw res.error;
      await refresh();
      setMessage("Immagine principale aggiornata.");
    } catch (e: any) {
      setMessage(e?.message || "Errore durante l'aggiornamento.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleVisible(image: GalleryImage) {
    setBusy(true);
    setMessage("");
    try {
      const res = await supabase
        .from("creator_images")
        .update({ is_visible: !image.is_visible })
        .eq("id", image.id);
      if (res.error) throw res.error;
      await refresh();
    } catch (e: any) {
      setMessage(e?.message || "Errore durante l'aggiornamento.");
    } finally {
      setBusy(false);
    }
  }

  async function move(image: GalleryImage, direction: -1 | 1) {
    const current = sorted.findIndex(i => i.id === image.id);
    const target = current + direction;
    if (target < 0 || target >= sorted.length) return;

    const a = sorted[current];
    const b = sorted[target];

    setBusy(true);
    setMessage("");
    try {
      await supabase.from("creator_images").update({ sort_order: b.sort_order }).eq("id", a.id);
      await supabase.from("creator_images").update({ sort_order: a.sort_order }).eq("id", b.id);
      await refresh();
    } catch (e: any) {
      setMessage(e?.message || "Errore durante il riordino.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(image: GalleryImage) {
    setBusy(true);
    setMessage("");
    try {
      const res = await supabase.from("creator_images").delete().eq("id", image.id);
      if (res.error) throw res.error;
      await refresh();
      setMessage("Immagine rimossa.");
    } catch (e: any) {
      setMessage(e?.message || "Errore durante la rimozione.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Galleria professionista</h3>
          <p className="mt-1 text-sm text-slate-600">
            Carica immagini, scegli la principale, controlla visibilità e ordine.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          Carica immagine
        </label>
      </div>

      {message ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
          Nessuna immagine caricata. La prima immagine caricata diventa automaticamente principale.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((image, index) => (
            <div key={image.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-[4/5] bg-slate-100">
                <img src={image.image_url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap gap-2">
                  {image.is_primary ? (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Principale
                    </span>
                  ) : null}
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    Ordine {image.sort_order}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    {image.is_visible ? "Visibile" : "Nascosta"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={busy || image.is_primary}
                    onClick={() => setPrimary(image.id)}
                    className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-800 disabled:opacity-50"
                  >
                    Rendi principale
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => toggleVisible(image)}
                    className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-800 disabled:opacity-50"
                  >
                    {image.is_visible ? "Nascondi" : "Mostra"}
                  </button>
                  <button
                    type="button"
                    disabled={busy || index === 0}
                    onClick={() => move(image, -1)}
                    className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-800 disabled:opacity-50"
                  >
                    Su
                  </button>
                  <button
                    type="button"
                    disabled={busy || index === sorted.length - 1}
                    onClick={() => move(image, 1)}
                    className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-800 disabled:opacity-50"
                  >
                    Giù
                  </button>
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => remove(image)}
                  className="w-full rounded-full border border-rose-200 px-3 py-2 text-sm text-rose-700 disabled:opacity-50"
                >
                  Elimina immagine
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
