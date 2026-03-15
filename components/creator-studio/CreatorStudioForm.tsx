"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { ensureLinkedCreator, type CreatorRow } from "@/lib/creator-studio/ensure-linked-creator";

type FormState = {
  display_name: string;
  city: string;
  age: string;
  bio: string;
  tags: string;
  show_city: boolean;
  show_age: boolean;
  show_bio: boolean;
};

const emptyForm: FormState = {
  display_name: "",
  city: "",
  age: "",
  bio: "",
  tags: "",
  show_city: true,
  show_age: true,
  show_bio: true,
};

function tagsToString(tags: string[] | null) {
  return Array.isArray(tags) ? tags.join(", ") : "";
}

function parseTags(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildForm(creator: CreatorRow): FormState {
  return {
    display_name: creator.display_name ?? "",
    city: creator.city ?? "",
    age: creator.age ? String(creator.age) : "",
    bio: creator.bio ?? "",
    tags: tagsToString(creator.tags),
    show_city: creator.show_city !== false,
    show_age: creator.show_age !== false,
    show_bio: creator.show_bio !== false,
  };
}

export default function CreatorStudioForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState<CreatorRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<{ type: "ok" | "error"; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setStatus(null);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user?.id) {
        if (!cancelled) {
          setCreator(null);
          setLoading(false);
          setStatus({ type: "error", message: "Devi effettuare il login per aprire Creator Studio." });
        }
        return;
      }

      const result = await ensureLinkedCreator(supabase, user);

      if (!cancelled) {
        setCreator(result.creator);
        setForm(result.creator ? buildForm(result.creator) : emptyForm);
        setLoading(false);

        if (result.error) {
          setStatus({ type: "error", message: result.error });
          return;
        }

        if (result.created) {
          setStatus({
            type: "ok",
            message: "È stato creato automaticamente un profilo creator privato di base. Ora puoi completarlo qui e pubblicarlo più avanti.",
          });
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!creator) return;

    setStatus(null);

    const ageNumber = form.age.trim() ? Number(form.age) : null;
    if (form.age.trim() && Number.isNaN(ageNumber)) {
      setStatus({ type: "error", message: "L'età deve essere numerica." });
      return;
    }

    const payload = {
      display_name: form.display_name.trim() || null,
      city: form.city.trim() || null,
      age: ageNumber,
      bio: form.bio.trim() || null,
      tags: parseTags(form.tags),
      show_city: form.show_city,
      show_age: form.show_age,
      show_bio: form.show_bio,
    };

    const { data, error } = await supabase
      .from("creators")
      .update(payload)
      .eq("id", creator.id)
      .select("id, auth_user_id, email, display_name, slug, avatar_url, city, age, bio, tags, tier, is_verified, is_active, show_city, show_age, show_bio")
      .limit(1);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    const updated = (data?.[0] ?? creator) as CreatorRow;
    setCreator(updated);
    setForm(buildForm(updated));
    setStatus({ type: "ok", message: "Profilo creator aggiornato con successo." });
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-600">
          Caricamento Creator Studio...
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-[32px] border border-amber-500/30 bg-slate-950 p-6 text-amber-200 shadow-sm">
          <div className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            Creator Studio
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">Gestione profilo pubblico creator</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Non è stato possibile creare o collegare automaticamente il profilo creator per questo account.
          </p>
          {status ? <p className="mt-4 text-sm text-amber-100">{status.message}</p> : null}
          <div className="mt-6">
            <Link href="/creators" className="text-sm underline underline-offset-4 text-amber-200">
              Apri l'elenco creator pubbliche
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPublicRouteReady = Boolean(creator.slug && creator.is_active);
  const publicHref = creator.slug ? `/creator/${creator.slug}` : `/profile/${creator.id}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
              Creator Studio
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">Gestione profilo pubblico creator</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              Qui puoi aggiornare i dati pubblici principali del profilo creator senza toccare la parte cliente.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <div><span className="font-semibold text-slate-900">Slug:</span> {creator.slug ?? "—"}</div>
            <div className="mt-1"><span className="font-semibold text-slate-900">Tier:</span> {creator.tier ?? "free"}</div>
            <div className="mt-1"><span className="font-semibold text-slate-900">Stato pubblico:</span> {creator.is_active ? "attiva" : "bozza privata"}</div>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Nome pubblico</label>
              <input
                value={form.display_name}
                onChange={(e) => updateField("display_name", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder="Es. Aurora"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">Città</label>
                <input
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Es. Milano"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">Età</label>
                <input
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Es. 31"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder="Descrivi il profilo pubblico creator"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Tag</label>
              <input
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder="business, en/fr, disponibile oggi"
              />
              <p className="mt-2 text-xs text-slate-500">Separali con una virgola.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-900">Visibilità pubblica</div>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={form.show_city} onChange={(e) => updateField("show_city", e.target.checked)} />
                  <span>Mostra città</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={form.show_age} onChange={(e) => updateField("show_age", e.target.checked)} />
                  <span>Mostra età</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={form.show_bio} onChange={(e) => updateField("show_bio", e.target.checked)} />
                  <span>Mostra bio</span>
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <div className="font-semibold text-slate-900">Account di gestione</div>
              <div className="mt-3">Email login: {creator.email ?? "—"}</div>
              <div className="mt-1 break-all">ID account (auth_user_id): {creator.auth_user_id ?? "—"}</div>
              <div className="mt-4 text-xs text-slate-500">
                Questo box mostra l'account che gestisce il profilo creator. Non e' un dato pubblico visibile nella scheda della creator.
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Se non esisteva nessun record creator collegato, viene creata automaticamente una bozza privata.
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <button
                type="submit"
                className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Salva profilo creator
              </button>

              {status ? (
                <div className={[
                  "mt-4 rounded-2xl px-4 py-3 text-sm",
                  status.type === "ok" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200",
                ].join(" ")}>
                  {status.message}
                </div>
              ) : null}

              {isPublicRouteReady ? (
                <>
                  <p className="mt-4 text-center text-xs text-slate-500">
                    Il profilo è pubblico e può essere aperto dalla route definitiva creator.
                  </p>
                  <Link href={publicHref} className="mt-2 block text-center text-sm font-semibold text-slate-700 underline underline-offset-4">
                    Apri route pubblica creator
                  </Link>
                </>
              ) : (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                  <div className="font-semibold">Profilo non ancora pubblico</div>
                  <p className="mt-2 text-amber-800">
                    Questa creator è ancora una bozza privata. La route pubblica si apre solo quando il record viene attivato.
                  </p>
                  <div className="mt-3 inline-flex cursor-not-allowed items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400">
                    Route pubblica non disponibile
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
