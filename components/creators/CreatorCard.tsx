"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { BadgePill } from "@/components/ui/BadgePill";
import { getCreatorPublicHref } from "@/lib/creators/public";

export type CreatorCardModel = {
  id: string;
  slug?: string | null;
  name: string;
  age: number;
  city: string;
  rating: number;
  reviewsCount?: number;
  bio?: string;
  tags?: string[];
  rankLabel?: string;
  imageUrl?: string;
  badges: Array<"verified" | "premium" | "elite" | "rising">;
};

export default function CreatorCard({ model }: { model: CreatorCardModel }) {
  const elite = model.badges.includes("elite");

  return (
    <Link href={getCreatorPublicHref({ id: model.id, slug: model.slug })} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={[
          "overflow-hidden rounded-3xl border bg-white shadow-sm",
          elite ? "border-amber-200" : "border-slate-100",
        ].join(" ")}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
          {model.imageUrl ? (
            <img
              src={model.imageUrl}
              alt={model.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-14 w-14 rounded-2xl bg-slate-200/60" />
            </div>
          )}

          {elite && (
            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
              <div className="absolute -inset-24 rounded-full blur-3xl bg-amber-200/35" />
            </div>
          )}

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {model.badges.includes("elite") && (
              <motion.div
                animate={{ opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <BadgePill variant="elite">👑 Elite</BadgePill>
              </motion.div>
            )}
            {model.badges.includes("premium") && <BadgePill variant="premium">🔥 Premium</BadgePill>}
            {model.badges.includes("verified") && <BadgePill variant="verified">✅ Verificata</BadgePill>}
            {model.badges.includes("rising") && <BadgePill variant="rising">📈 Rising</BadgePill>}
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold tracking-tight">
                {model.name} <span className="font-medium text-slate-500">{model.age}</span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                <MapPin className="h-4 w-4" />
                {model.city}
                {model.rankLabel ? <span className="text-slate-400"> · {model.rankLabel}</span> : null}
              </p>
            </div>

            <div className="text-right">
              <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                <Star className="h-4 w-4" /> {model.rating.toFixed(1)}
              </p>
              {typeof model.reviewsCount === "number" && (
                <p className="text-xs text-slate-500">({model.reviewsCount} recensioni)</p>
              )}
            </div>
          </div>

          {model.bio ? <p className="text-sm text-slate-600 line-clamp-2">{model.bio}</p> : null}

          {model.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {model.tags.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {t}
                </span>
              ))}
              {model.tags.length > 3 ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  +{model.tags.length - 3}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </motion.div>
    </Link>
  );
}
