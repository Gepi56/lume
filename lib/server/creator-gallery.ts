export type CreatorGalleryImageRow = {
  image_url: string | null;
  sort_order: number | null;
  is_primary: boolean | null;
  is_visible: boolean | null;
};

function uniqueClean(urls: Array<string | null | undefined>) {
  const out: string[] = [];
  for (const value of urls) {
    const url = (value ?? "").trim();
    if (!url) continue;
    if (!out.includes(url)) out.push(url);
  }
  return out;
}

export async function getCreatorGalleryImages({
  supabase,
  creatorId,
  avatarUrl,
  legacyGalleryUrls,
}: {
  supabase: any;
  creatorId: string;
  avatarUrl?: string | null;
  legacyGalleryUrls?: string[] | null;
}) {
  const legacy = uniqueClean([avatarUrl, ...(Array.isArray(legacyGalleryUrls) ? legacyGalleryUrls : [])]);

  if (!creatorId) return legacy;

  const { data, error } = await supabase
    .from("creator_images")
    .select("image_url, sort_order, is_primary, is_visible")
    .eq("creator_id", creatorId)
    .eq("is_visible", true)
    .order("is_primary", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error || !Array.isArray(data) || data.length === 0) {
    return legacy;
  }

  const creatorImages = (data as CreatorGalleryImageRow[]).map((row) => row.image_url);
  const merged = uniqueClean([...creatorImages, avatarUrl, ...(Array.isArray(legacyGalleryUrls) ? legacyGalleryUrls : [])]);
  return merged.length > 0 ? merged : legacy;
}
