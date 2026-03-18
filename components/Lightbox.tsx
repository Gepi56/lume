"use client";

import { useEffect } from "react";

type Props = {
  images: string[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Lightbox({
  images,
  index,
  onClose,
  onNext,
  onPrev,
}: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  if (!images.length) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt=""
          className="mx-auto max-h-[85vh] w-auto max-w-full rounded-2xl object-contain"
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-2xl text-white"
        >
          ✕
        </button>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-4 py-2 text-3xl text-white"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-4 py-2 text-3xl text-white"
            >
              ›
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
