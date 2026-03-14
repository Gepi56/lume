import { SupabaseClient } from "@supabase/supabase-js";

type CreatorRow = {
  id: string;
  auth_user_id: string | null;
  email: string | null;
  display_name: string | null;
  slug: string | null;
  avatar_url: string | null;
  city: string | null;
  age: number | null;
  bio: string | null;
  tags: string[] | null;
  tier: string | null;
  is_verified: boolean | null;
  is_active: boolean | null;
  show_city: boolean | null;
  show_age: boolean | null;
  show_bio: boolean | null;
};

const CREATOR_SELECT = "id, auth_user_id, email, display_name, slug, avatar_url, city, age, bio, tags, tier, is_verified, is_active, show_city, show_age, show_bio";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function suffixFromUserId(userId: string) {
  return userId.replace(/-/g, "").slice(0, 8).toLowerCase();
}

async function findProfileSeed(supabase: SupabaseClient, email: string) {
  const { data } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, city, bio")
    .eq("email", email)
    .limit(1);

  const row = Array.isArray(data) ? data[0] : null;
  return {
    displayName: row?.display_name ?? null,
    avatarUrl: row?.avatar_url ?? null,
    city: row?.city ?? null,
    bio: row?.bio ?? null,
  };
}

async function buildUniqueSlug(supabase: SupabaseClient, base: string, userId: string) {
  const baseSlug = slugify(base) || "creator";
  const preferred = `${baseSlug}-${suffixFromUserId(userId)}`;

  const { data } = await supabase
    .from("creators")
    .select("slug")
    .in("slug", [preferred, baseSlug]);

  const used = new Set((data ?? []).map((row: { slug: string | null }) => row.slug).filter(Boolean));
  if (!used.has(preferred)) return preferred;

  let counter = 2;
  while (used.has(`${preferred}-${counter}`)) counter += 1;
  return `${preferred}-${counter}`;
}

export async function ensureLinkedCreator(
  supabase: SupabaseClient,
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> },
): Promise<{ creator: CreatorRow | null; created: boolean; error: string | null }> {
  if (!user?.id) {
    return { creator: null, created: false, error: "Utente non autenticato." };
  }

  const { data: directRows, error: directError } = await supabase
    .from("creators")
    .select(CREATOR_SELECT)
    .eq("auth_user_id", user.id)
    .limit(1);

  if (directError) {
    return { creator: null, created: false, error: directError.message };
  }

  let row = (directRows?.[0] ?? null) as CreatorRow | null;
  if (row) return { creator: row, created: false, error: null };

  const email = user.email?.trim().toLowerCase() ?? null;

  if (email) {
    const { data: emailRows, error: emailError } = await supabase
      .from("creators")
      .select(CREATOR_SELECT)
      .eq("email", email)
      .limit(1);

    if (emailError) {
      return { creator: null, created: false, error: emailError.message };
    }

    row = (emailRows?.[0] ?? null) as CreatorRow | null;

    if (row?.id) {
      if (!row.auth_user_id) {
        const { data: updatedRows, error: updateError } = await supabase
          .from("creators")
          .update({ auth_user_id: user.id })
          .eq("id", row.id)
          .select(CREATOR_SELECT)
          .limit(1);

        if (updateError) {
          return { creator: row, created: false, error: updateError.message };
        }

        row = (updatedRows?.[0] ?? row) as CreatorRow;
      }

      return { creator: row, created: false, error: null };
    }
  }

  const seed = await findProfileSeed(supabase, email ?? "");
  const fallbackName =
    (typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name.trim() : "") ||
    seed.displayName ||
    (email ? email.split("@")[0] : "Creator");

  const slug = await buildUniqueSlug(supabase, fallbackName, user.id);

  const insertPayload = {
    auth_user_id: user.id,
    email,
    display_name: fallbackName || "Creator",
    slug,
    avatar_url: seed.avatarUrl,
    city: seed.city,
    age: null,
    bio: seed.bio,
    tags: [],
    tier: "standard",
    is_verified: false,
    is_active: false,
    show_city: true,
    show_age: true,
    show_bio: true,
  };

  const { data: insertedRows, error: insertError } = await supabase
    .from("creators")
    .insert(insertPayload)
    .select(CREATOR_SELECT)
    .limit(1);

  if (insertError) {
    return { creator: null, created: false, error: insertError.message };
  }

  row = (insertedRows?.[0] ?? null) as CreatorRow | null;
  return { creator: row, created: true, error: null };
}

export type { CreatorRow };
