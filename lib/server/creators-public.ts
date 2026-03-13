import { createClient } from "@supabase/supabase-js";
import type { CreatorImageRow, CreatorPublicRecord } from "@/lib/creators/public";

export type ReviewRow = {
  id: string;
  professional_id: string;
  rating: number;
  comment: string | null;
  verified: boolean;
  created_at: string;
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

export async function getCreatorBySlug(slug: string) {
  const supabase = getSupabasePublicClient();
  if (!supabase) return { creator: null, errorMessage: "Supabase non configurato." };

  const { data, error } = await supabase
    .from("creators")
    .select(
      "id, slug, display_name, city, age, bio, tags, avatar_url, gallery_urls, tier, is_verified, is_active, show_city, show_age, show_bio"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  return {
    creator: (data ?? null) as CreatorPublicRecord | null,
    errorMessage: error?.message ?? null,
  };
}

export async function getCreatorById(id: string) {
  const supabase = getSupabasePublicClient();
  if (!supabase) return { creator: null, errorMessage: "Supabase non configurato." };

  const { data, error } = await supabase
    .from("creators")
    .select(
      "id, slug, display_name, city, age, bio, tags, avatar_url, gallery_urls, tier, is_verified, is_active, show_city, show_age, show_bio"
    )
    .eq("id", id)
    .maybeSingle();

  return {
    creator: (data ?? null) as CreatorPublicRecord | null,
    errorMessage: error?.message ?? null,
  };
}

export async function getCreatorReviews(creatorId: string) {
  const supabase = getSupabasePublicClient();
  if (!supabase) return { reviews: [] as ReviewRow[], errorMessage: "Supabase non configurato." };

  const { data, error } = await supabase
    .from("reviews")
    .select("id, professional_id, rating, comment, verified, created_at")
    .eq("professional_id", creatorId)
    .order("created_at", { ascending: false });

  return {
    reviews: ((data ?? []) as ReviewRow[]),
    errorMessage: error?.message ?? null,
  };
}

export async function getCreatorImages(creatorId: string) {
  const supabase = getSupabasePublicClient();
  if (!supabase) return { images: [] as CreatorImageRow[], errorMessage: null };

  const { data, error } = await supabase
    .from("creator_images")
    .select("image_url, sort_order, is_primary, is_visible")
    .eq("creator_id", creatorId)
    .eq("is_visible", true)
    .order("is_primary", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) {
    const message = error.message?.toLowerCase() ?? "";
    const missingTable = message.includes("creator_images") || message.includes("does not exist");
    if (missingTable) {
      return { images: [] as CreatorImageRow[], errorMessage: null };
    }
  }

  return {
    images: ((data ?? []) as CreatorImageRow[]),
    errorMessage: error?.message ?? null,
  };
}
