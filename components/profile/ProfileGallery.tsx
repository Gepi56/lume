"use client";

import { useMemo, useState } from "react";
import Lightbox from "@/components/Lightbox";

type GalleryValue =
  | string
  | null
  | undefined
  | {
      image_url?: string | null;
      url?: string | null;
      src?: string | null;
    };

type Props = {
  images?: GalleryValue[];
};

function normalizeImages(images: GalleryValue[] = []): string[] {
  const out: string[] = [];

  for (const item of images) {
    let value = "";

    if (typeof item === "string") {
      value = item;
    } else if (item && typeof item === "object") {
      value = item.image_url ?? item.url ?? item.src ?? "";
    }

    const cleaned = value.trim();
    if (!cleaned) continue;
    if (!out.includes(cleaned)) out.push(cleaned);
  }

  return out;
}

export default function ProfileGallery({ images = [] }: Props) {
  const cleaned = useMemo(() => normalizeImages(images), [images]);
  const [selected, setSelected] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!cleaned.length) return null;

  const safeIndex = Math.min(selected, cleaned.length - 1);
  const current = cleaned[safeIndex];

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setLightboxIndex(safeIndex)}
        className="block w-full overflow-hidden rounded-[28px] bg-slate-100"
      >
        <img
          src={current}
          alt=""
          className="aspect-[4/5] w-full object-cover"
        />
      </button>

      {cleaned.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {cleaned.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => {
                setSelected(index);
                setLightboxIndex(index);
              }}
              className={`overflow-hidden rounded-2xl border ${
                safeIndex === index ? "border-slate-900" : "border-slate-200"
              }`}
            >
              <img
                src={src}
                alt=""
                className="h-16 w-16 object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxIndex !== null ? (
        <Lightbox
          images={cleaned}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((prev) =>
              prev !== null ? (prev + 1) % cleaned.length : 0
            )
          }
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev !== null ? (prev - 1 + cleaned.length) % cleaned.length : 0
            )
          }
        />
      ) : null}
    </div>
  );
}
