export type CreatorGalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
  is_visible: boolean;
};

type CreatorLike = {
  id: string;
  avatarUrl?: string | null;
  galleryUrls?: string[] | null;
};

type GetCreatorGalleryImagesArgs = {
  supabase: any;
  creatorId: string;
  avatarUrl?: string | null;
  galleryUrls?: string[] | null;
};

export function buildFallbackGallery(creator: CreatorLike): CreatorGalleryImage[] {
  const urls = Array.isArray(creator.galleryUrls) ? creator.galleryUrls : [];
  const list = urls.length ? urls : creator.avatarUrl ? [creator.avatarUrl] : [];

  return list.map((url, index) => ({
    id: `fallback-${index}`,
    image_url: url,
    sort_order: index,
    is_primary: index === 0,
    is_visible: true,
  }));
}

export async function getCreatorGalleryImages({
  supabase,
  creatorId,
  avatarUrl,
  galleryUrls,
}: GetCreatorGalleryImagesArgs): Promise<CreatorGalleryImage[]> {
  try {
    const { data, error } = await supabase
      .from("creator_images")
      .select("id,image_url,sort_order,is_primary,is_visible")
      .eq("creator_id", creatorId)
      .eq("is_visible", true)
      .order("is_primary", { ascending: false })
      .order("sort_order", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data as CreatorGalleryImage[];
    }
  } catch {
    // fallback sotto
  }

  return buildFallbackGallery({
    id: creatorId,
    avatarUrl,
    galleryUrls,
  });
}
