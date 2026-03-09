"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

type StatusState = {
  type: "idle" | "error" | "success";
  message: string;
};

type FormState = {
  email: string;
  display_name: string;
  city: string;
  age: string;
  bio: string;
  avatar_url: string;
  tier: string;
  is_verified: boolean;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "L";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function EditProfileForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authMissing, setAuthMissing] = useState(false);
  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" });
  const [form, setForm] = useState<FormState>({
    email: "",
    display_name: "",
    city: "",
    age: "",
    bio: "",
    avatar_url: "",
    tier: "base",
    is_verified: false,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!active) return;

      if (!user?.email) {
        setAuthMissing(true);
        setLoading(false);
        return;
      }

      const cleanEmail = user.email.toLowerCase();
      const fallbackName =
        (user.user_metadata?.display_name as string | undefined)?.trim() ||
        cleanEmail.split("@")[0] ||
        "Utente Lume";

      try {
        const { data: rows } = await supabase
          .from("creators")
          .select("email, display_name, city, age, bio, avatar_url, tier, is_verified")
          .eq("email", cleanEmail)
          .limit(1);

        const creator = Array.isArray(rows) ? rows[0] : null;

        setForm({
          email: cleanEmail,
          display_name: creator?.display_name || fallbackName,
          city: creator?.city || "",
          age: creator?.age != null ? String(creator.age) : "",
          bio: creator?.bio || "",
          avatar_url: creator?.avatar_url || "",
          tier: creator?.tier || "base",
          is_verified: creator?.is_verified === true,
        });
      } catch {
        setForm({
          email: cleanEmail,
          display_name: fallbackName,
          city: "",
          age: "",
          bio: "",
          avatar_url: "",
          tier: "base",
          is_verified: false,
        });
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [supabase]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: "idle", message: "" });

    try {
      const payload = {
        email: form.email,
        display_name: form.display_name.trim() || form.email.split("@")[0] || "Utente Lume",
        city: form.city.trim() || null,
        age: form.age.trim() ? Number(form.age) : null,
        bio: form.bio.trim() || null,
        avatar_url: form.avatar_url.trim() || null,
        tier: form.tier || "base",
        is_verified: form.is_verified === true,
        is_active: true,
      };

      const { error } = await supabase
        .from("creators")
        .upsert([payload], { onConflict: "email" });

      if (error) {
        setStatus({
          type: "error",
          message:
            "Non sono riuscito a salvare il profilo. Controlla le policy Supabase della tabella creators.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: "Profilo aggiornato correttamente.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Si è verificato un errore imprevisto durante il salvataggio.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-[30px] border border-white/10 bg-black/80 p-8">
        <p className="text-sm text-zinc-400">Caricamento profilo...</p>
      </section>
    );
  }

  if (authMissing) {
    return (
      <section className="rounded-[30px] border border-white/10 bg-black/80 p-8">
        <h2 className="text-xl font-semibold text-white">Accesso richiesto</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Devi effettuare il login per modificare il profilo.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
          >
            Vai al login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[320px_1fr]">
      <section className="rounded-[30px] border border-white/10 bg-black/80 p-6">
        <div className="flex flex-col items-center text-center">
          {form.avatar_url ? (
            <img
              src={form.avatar_url}
              alt={form.display_name}
              className="h-28 w-28 rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-900 text-3xl font-semibold text-white">
              {initialsFromName(form.display_name)}
            </div>
          )}

          <h2 className="mt-4 text-2xl font-semibold text-white">
            {form.display_name || "Profilo Lume"}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{form.email}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200">
              {form.tier || "base"}
            </span>
            {form.is_verified && (
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                Verificata
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-6 text-zinc-400">
            Anteprima del profilo. Appena compili città, bio e avatar, il sistema avrà una base molto più realistica.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-black/80 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="Nome visualizzato"
              type="text"
              value={form.display_name}
              onChange={(value) => updateField("display_name", value)}
              placeholder="Come vuoi apparire"
            />

            <Field
              label="Città"
              type="text"
              value={form.city}
              onChange={(value) => updateField("city", value)}
              placeholder="Es. Milano"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => updateField("email", value.toLowerCase())}
              placeholder="nome@email.com"
            />

            <Field
              label="Età"
              type="number"
              value={form.age}
              onChange={(value) => updateField("age", value)}
              placeholder="Es. 28"
            />
          </div>

          <Field
            label="Avatar URL"
            type="text"
            value={form.avatar_url}
            onChange={(value) => updateField("avatar_url", value)}
            placeholder="https://..."
          />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-200">Bio</span>
            <textarea
              value={form.bio}
              onChange={(event) => updateField("bio", event.target.value)}
              rows={5}
              placeholder="Descrivi il profilo in modo semplice e chiaro"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-400/40 focus:bg-white/[0.07]"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-zinc-500">
              Tier e verifica restano per ora gestiti dal sistema o da backend/admin.
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/15 px-5 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Salvataggio in corso..." : "Salva profilo"}
            </button>
          </div>

          <StatusMessage type={status.type} message={status.message} />
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-400/40 focus:bg-white/[0.07]"
      />
    </label>
  );
}

function StatusMessage({
  type,
  message,
}: {
  type: "idle" | "error" | "success";
  message: string;
}) {
  if (type === "idle" || !message) return null;

  const className =
    type === "error"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-200"
      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${className}`}>{message}</div>;
}
