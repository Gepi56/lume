export type CreatorPublicRecord = {
  id: string;
  slug?: string | null;
  display_name: string | null;
  city?: string | null;
  age?: number | null;
  bio?: string | null;
  tags?: string[] | null;
  avatar_url?: string | null;
  gallery_urls?: string[] | null;
  tier?: string | null;
  is_verified?: boolean | null;
  is_active?: boolean | null;
  show_city?: boolean | null;
  show_age?: boolean | null;
  show_bio?: boolean | null;
};

export type CreatorImageRow = {
  image_url: string | null;
  sort_order?: number | null;
  is_primary?: boolean | null;
  is_visible?: boolean | null;
};

export function getCreatorPublicPath(input: { slug?: string | null; id?: string | null }) {
  const slug = (input.slug ?? "").trim();
  if (slug) return `/creator/${slug}`;

  const id = (input.id ?? "").trim();
  if (id) return `/profile/${id}`;

  return "/explore";
}

export function getVisibleCreatorField<T>(
  value: T | null | undefined,
  visibleFlag: boolean | null | undefined,
  fallbackVisible = true
) {
  const visible = typeof visibleFlag === "boolean" ? visibleFlag : fallbackVisible;
  return visible ? value : null;
}

export function normalizeCreatorGallery(
  creator: Pick<CreatorPublicRecord, "avatar_url" | "gallery_urls">,
  creatorImages?: CreatorImageRow[] | null
) {
  const out: string[] = [];

  const pushUnique = (value: string | null | undefined) => {
    const url = (value ?? "").trim();
    if (!url) return;
    if (!out.includes(url)) out.push(url);
  };

  if (Array.isArray(creatorImages) && creatorImages.length > 0) {
    const sorted = [...creatorImages]
      .filter((item) => item?.is_visible !== false)
      .sort((a, b) => {
        const primaryA = a.is_primary ? 1 : 0;
        const primaryB = b.is_primary ? 1 : 0;
        if (primaryA !== primaryB) return primaryB - primaryA;
        return (a.sort_order ?? 9999) - (b.sort_order ?? 9999);
      });

    sorted.forEach((item) => pushUnique(item.image_url));
  }

  pushUnique(creator.avatar_url);

  if (Array.isArray(creator.gallery_urls)) {
    creator.gallery_urls.forEach((url) => pushUnique(url));
  }

  return out;
}
