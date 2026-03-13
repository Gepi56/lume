export type CreatorPublicRef = {
  id: string;
  slug?: string | null;
};

export function getCreatorPublicHref(ref: CreatorPublicRef) {
  if (ref.slug && ref.slug.trim()) {
    return `/creator/${ref.slug.trim()}`;
  }

  return `/profile/${ref.id}`;
}

export function getCreatorGalleryImages(input: {
  avatarUrl?: string | null;
  galleryUrls?: string[] | null;
}) {
  const avatar = input.avatarUrl?.trim() ? [input.avatarUrl.trim()] : [];
  const gallery = Array.isArray(input.galleryUrls)
    ? input.galleryUrls.filter((url): url is string => typeof url === "string" && url.trim().length > 0)
    : [];

  return Array.from(new Set([...avatar, ...gallery]));
}
