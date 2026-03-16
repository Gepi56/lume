"use client";

import { useMemo, useState } from "react";

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
      value =
        item.image_url ??
        item.url ??
        item.src ??
        "";
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

  if (!cleaned.length) return null;

  const safeIndex = Math.min(selected, cleaned.length - 1);
  const current = cleaned[safeIndex];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[28px] bg-slate-100">
        <img
          src={current}
          alt=""
          className="aspect-[4/5] w-full object-cover"
        />
      </div>

      {cleaned.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {cleaned.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setSelected(index)}
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
    </div>
  );
}
