"use client";

import { useMemo, useState } from "react";

export default function ProfileGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const clean = useMemo(() => {
    // pulizia: niente vuoti + niente duplicati
    const out: string[] = [];
    for (const url of images ?? []) {
      const u = (url ?? "").trim();
      if (!u) continue;
      if (!out.includes(u)) out.push(u);
    }
    return out;
  }, [images]);

  const [idx, setIdx] = useState(0);
  const active = clean[idx] ?? clean[0] ?? "";

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE */}
      <div className="rounded-[32px] overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
        <div className="relative w-full aspect-[4/5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* THUMBNAILS */}
      {clean.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {clean.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setIdx(i)}
              className={[
                "shrink-0 rounded-2xl overflow-hidden border transition",
                i === idx
                  ? "border-slate-900"
                  : "border-slate-200 hover:border-slate-400",
              ].join(" ")}
              title={`Foto ${i + 1}`}
            >
              <div className="h-20 w-16 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}