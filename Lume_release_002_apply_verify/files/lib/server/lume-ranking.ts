import { createClient } from "@supabase/supabase-js";

type CreatorRow = {
  id: string;
  display_name: string | null;
  slug: string | null;
  city: string | null;
  bio: string | null;
  avatar_url: string | null;
  gallery_urls: string[] | null;
  tier: string | null;
  is_verified: boolean | null;
  is_active: boolean | null;
};

type ReviewRow = {
  id: string;
  professional_id: string;
  rating: number | null;
  comment: string | null;
  verified: boolean | null;
  created_at: string | null;
};

type RankingItem = {
  id: string;
  rank: number;
  displayName: string;
  city: string | null;
  imageUrl: string | null;
  score: number;
  averageRating: string;
  reviewsCount: number;
  positivePct: number;
  level: string;
  tierLabel: string;
  trendLabel: string;
  reliabilityScore: number;
  trustScore: number;
  isVerified: boolean;
  isElite: boolean;
  summary: string;
};

type RankingData = {
  stats: {
    activeCreators: number;
    totalReviews: number;
    topScore: number;
    topAverageRating: string;
  };
  items: RankingItem[];
};

function getSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getLevel(score: number) {
  if (score >= 90) return "Eccellente";
  if (score >= 80) return "Molto alta";
  if (score >= 68) return "Alta";
  if (score >= 55) return "Buona";
  return "In crescita";
}

function getTierLabel(tier: string | null) {
  if (tier === "elite") return "Elite";
  if (tier === "pro") return "Pro";
  if (tier === "plus") return "Plus";
  return "Standard";
}

function calculateScore(input: {
  averageRating: number;
  reviewsCount: number;
  positivePct: number;
  verifiedReviewsCount: number;
  tier: string | null;
  isVerified: boolean;
}) {
  const ratingScore = (input.averageRating / 5) * 58;
  const volumeScore = Math.min(input.reviewsCount * 3, 18);
  const positiveScore = (input.positivePct / 100) * 14;
  const verifiedReviewScore = Math.min(input.verifiedReviewsCount * 1.5, 6);
  const badgeScore = input.isVerified ? 6 : 0;
  const tierScore =
    input.tier === "elite" ? 8 : input.tier === "pro" ? 4 : input.tier === "plus" ? 2 : 0;

  return Math.round(
    clamp(
      ratingScore + volumeScore + positiveScore + verifiedReviewScore + badgeScore + tierScore,
      0,
      100
    )
  );
}

export async function getLumeRankingData(): Promise<RankingData> {
  const supabase = getSupabasePublicClient();

  if (!supabase) {
    return {
      stats: {
        activeCreators: 0,
        totalReviews: 0,
        topScore: 0,
        topAverageRating: "N/D",
      },
      items: [],
    };
  }

  try {
    const { data: creatorsRaw, error: creatorsError } = await supabase
      .from("creators")
      .select("id, slug, display_name, city, bio, avatar_url, gallery_urls, tier, is_verified, is_active")
      .eq("is_active", true);

    if (creatorsError || !creatorsRaw || creatorsRaw.length === 0) {
      return {
        stats: {
          activeCreators: 0,
          totalReviews: 0,
          topScore: 0,
          topAverageRating: "N/D",
        },
        items: [],
      };
    }

    const creators = creatorsRaw as CreatorRow[];
    const creatorIds = creators.map((creator) => creator.id);

    const { data: reviewsRaw, error: reviewsError } = await supabase
      .from("reviews")
      .select("id, professional_id, rating, comment, verified, created_at")
      .in("professional_id", creatorIds);

    if (reviewsError) {
      return {
        stats: {
          activeCreators: creators.length,
          totalReviews: 0,
          topScore: 0,
          topAverageRating: "N/D",
        },
        items: [],
      };
    }

    const reviews = (reviewsRaw ?? []) as ReviewRow[];

    const items = creators
      .map((creator) => {
        const creatorReviews = reviews.filter((review) => review.professional_id === creator.id);
        const validRatings = creatorReviews
          .map((review) => Number(review.rating ?? 0))
          .filter((rating) => rating > 0);

        const reviewsCount = validRatings.length;
        const averageRating =
          reviewsCount > 0
            ? Number(
                (
                  validRatings.reduce((sum, rating) => sum + rating, 0) / reviewsCount
                ).toFixed(2)
              )
            : 0;

        const positiveCount = validRatings.filter((rating) => rating >= 4).length;
        const positivePct =
          reviewsCount > 0 ? Math.round((positiveCount / reviewsCount) * 100) : 0;

        const verifiedReviewsCount = creatorReviews.filter(
          (review) => review.verified === true
        ).length;

        const score = calculateScore({
          averageRating,
          reviewsCount,
          positivePct,
          verifiedReviewsCount,
          tier: creator.tier,
          isVerified: creator.is_verified === true,
        });

        const reliabilityScore = clamp(
          Math.round((positivePct * 0.7) + (creator.is_verified ? 15 : 0)),
          0,
          100
        );

        const trustScore = clamp(
          (creator.is_verified ? 65 : 40) +
            (creator.tier === "elite" ? 20 : creator.tier === "pro" ? 10 : creator.tier === "plus" ? 5 : 0) +
            Math.min(verifiedReviewsCount * 3, 15),
          0,
          100
        );

        const isElite =
          creator.tier === "elite" ||
          (score >= 90 &&
            creator.is_verified === true &&
            reviewsCount >= 5 &&
            averageRating >= 4.5);

        const trendLabel =
          score >= 90 ? "Top" : score >= 80 ? "Forte" : score >= 68 ? "Solido" : "Crescita";

        const imageUrl =
          creator.avatar_url ||
          (Array.isArray(creator.gallery_urls) && creator.gallery_urls.length > 0
            ? creator.gallery_urls[0]
            : null);

        return {
          id: creator.id,
          displayName: creator.display_name || "Profilo senza nome",
          city: creator.city || null,
          slug: creator.slug || null,
          imageUrl,
          score,
          averageRating: reviewsCount > 0 ? `${averageRating}/5` : "N/D",
          averageRatingRaw: averageRating,
          reviewsCount,
          positivePct,
          level: getLevel(score),
          tierLabel: getTierLabel(creator.tier),
          trendLabel,
          reliabilityScore,
          trustScore,
          isVerified: creator.is_verified === true,
          isElite,
          summary:
            creator.bio?.trim() ||
            `Profilo con ${reviewsCount} recensioni visibili, ${positivePct}% feedback positivi e rating medio ${reviewsCount > 0 ? `${averageRating}/5` : "non disponibile"}.`,
        };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.averageRatingRaw !== a.averageRatingRaw) return b.averageRatingRaw - a.averageRatingRaw;
        return b.reviewsCount - a.reviewsCount;
      })
      .map((item, index) => ({
        id: item.id,
        rank: index + 1,
        displayName: item.displayName,
        city: item.city,
        imageUrl: item.imageUrl,
        score: item.score,
        averageRating: item.averageRating,
        reviewsCount: item.reviewsCount,
        positivePct: item.positivePct,
        level: item.level,
        tierLabel: item.tierLabel,
        trendLabel: item.trendLabel,
        reliabilityScore: item.reliabilityScore,
        trustScore: item.trustScore,
        isVerified: item.isVerified,
        isElite: item.isElite,
        summary: item.summary,
      }));

    return {
      stats: {
        activeCreators: creators.length,
        totalReviews: reviews.filter((review) => Number(review.rating ?? 0) > 0).length,
        topScore: items[0]?.score ?? 0,
        topAverageRating: items[0]?.averageRating ?? "N/D",
      },
      items,
    };
  } catch {
    return {
      stats: {
        activeCreators: 0,
        totalReviews: 0,
        topScore: 0,
        topAverageRating: "N/D",
      },
      items: [],
    };
  }
}
