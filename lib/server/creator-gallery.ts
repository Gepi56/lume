export type CreatorGalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
  is_visible: boolean;
};

type CreatorLike = {
  id: string;
  avatar_url?: string | null;
  gallery_urls?: string[] | null;
};

export function buildFallbackGallery(creator: CreatorLike): CreatorGalleryImage[] {
  const urls = Array.isArray(creator.gallery_urls) ? creator.gallery_urls : [];
  const list = urls.length
    ? urls
    : creator.avatar_url
      ? [creator.avatar_url]
      : [];

  return list.map((url, index) => ({
    id: `fallback-${index}`,
    image_url: url,
    sort_order: index,
    is_primary: index === 0,
    is_visible: true,
  }));
}
