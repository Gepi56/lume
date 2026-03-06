"use client";

import { useEffect, useMemo, useState } from "react";

export default function ProfileGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const clean = useMemo(() => {
    const out: string[] = [];
    for (const url of images ?? []) {
      const u = (url ?? "").trim();
      if (!u) continue;
      if (!out.includes(u)) out.push(u);
    }
    return out;
  }, [images]);

  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);

  const active = clean[idx] ?? clean[0] ?? "";

  function prev() {
    setIdx((i) => (i - 1 + clean.length) % clean.length);
  }

  function next() {
    setIdx((i) => (i + 1) % clean.length);
  }

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="space-y-4">
      {/* FOTO PRINCIPALE */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full"
      >
        <div className="rounded-[32px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="relative w-full aspect-[4/5]">
            <img
              src={active}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </button>

      {/* MINIATURE */}
      {clean.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {clean.map((url, i) => (
            <button
              key={url + i}
              onClick={() => setIdx(i)}
              className={`rounded-xl overflow-hidden border ${
                i === idx
                  ? "border-slate-900"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img src={url} className="h-20 w-16 object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* MODALE FULLSCREEN */}
      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* immagine */}
            <img
              src={active}
              alt={name}
              className="max-h-[86vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />

            {/* frecce */}
            {clean.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-[-60px] top-1/2 -translate-y-1/2 text-white text-3xl"
                >
                  ←
                </button>

                <button
                  onClick={next}
                  className="absolute right-[-60px] top-1/2 -translate-y-1/2 text-white text-3xl"
                >
                  →
                </button>
              </>
            )}

            {/* chiudi */}
            <button
  onClick={() => setOpen(false)}
  className="fixed top-6 right-6 z-[1000] rounded-full bg-black/60 px-4 py-2 text-white text-sm font-semibold backdrop-blur hover:bg-black/80 transition"
>
  Chiudi ✕
</button>

            {/* mini strip */}
            {clean.length > 1 && (
              <div className="flex gap-3 mt-6">
                {clean.map((url, i) => (
                  <button
                    key={url + i}
                    onClick={() => setIdx(i)}
                    className={`rounded-xl overflow-hidden border ${
                      i === idx
                        ? "border-white"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    <img src={url} className="h-14 w-12 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}