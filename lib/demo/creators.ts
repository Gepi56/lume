export type Creator = {
  id: string;
  slug?: string;
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
  reviews?: Array<{ stars: number; date: string; text: string }>;
};

export const DEMO_CREATORS: Creator[] = [
  {
    id: "1",
    slug: "sofia",
    name: "Sofia",
    age: 28,
    city: "Milano",
    rating: 4.7,
    reviewsCount: 3,
    bio: "Ciao, sono Sofia. Amo l’arte e le buone conversazioni.",
    tags: ["madrelingua", "arte", "disponibile oggi"],
    rankLabel: "#3 Milano",
    badges: ["verified"],
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    reviews: [
      { stars: 5, date: "26/02/2026", text: "Incontro meraviglioso, persona squisita." },
      { stars: 4, date: "26/02/2026", text: "Tutto perfetto, tornerò." },
    ],
  },
  {
    id: "2",
    slug: "aurora",
    name: "Aurora",
    age: 31,
    city: "Roma",
    rating: 4.5,
    reviewsCount: 2,
    bio: "Sono Aurora, amo viaggiare e conoscere nuove persone.",
    tags: ["business", "en/fr"],
    rankLabel: "#1 Roma",
    badges: ["verified", "elite"],
    imageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80",
    reviews: [
      { stars: 5, date: "26/02/2026", text: "Profilo curato e comunicazione rapida." },
      { stars: 4, date: "26/02/2026", text: "Tutto ok." },
    ],
  },
];

export function getDemoCreatorById(id: string) {
  return DEMO_CREATORS.find((c) => c.id === id);
}