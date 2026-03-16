"use client";

import CreatorGalleryManager from "@/components/creator-studio/CreatorGalleryManager";

type GalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
  is_visible: boolean;
};

type Props = {
  creator: {
    id: string;
    display_name: string;
    slug: string;
    tier: string;
    is_active: boolean;
    city?: string | null;
    age?: number | null;
    bio?: string | null;
    tags?: string[] | null;
    show_city: boolean;
    show_age: boolean;
    show_bio: boolean;
  };
  galleryImages?: GalleryImage[];
};

export default function CreatorStudioForm({ creator, galleryImages = [] }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Gestione profilo pubblico creator</h1>
        <p className="mt-2 text-sm text-slate-600">
          Qui puoi aggiornare i dati pubblici principali del profilo creator senza toccare la parte cliente.
        </p>
      </div>

      <CreatorGalleryManager creatorId={creator.id} initialImages={galleryImages} />
    </div>
  );
}
