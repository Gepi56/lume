"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

type StatusState = {
  type: "idle" | "error" | "success";
  message: string;
};

type PasswordState = {
  newPassword: string;
  confirmPassword: string;
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

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  if (name.length <= 3) return `${name[0] || ""}***@${domain}`;
  return `${name.slice(0, 3)}***@${domain}`;
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function EditProfileForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [authMissing, setAuthMissing] = useState(false);

  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" });
  const [passwordStatus, setPasswordStatus] = useState<StatusState>({ type: "idle", message: "" });
  const [uploadStatus, setUploadStatus] = useState<StatusState>({ type: "idle", message: "" });

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

  const [passwordForm, setPasswordForm] = useState<PasswordState>({
    newPassword: "",
    confirmPassword: "",
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

  function updatePasswordField<K extends keyof PasswordState>(key: K, value: PasswordState[K]) {
    setPasswordForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setUploadStatus({ type: "idle", message: "" });

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user?.id || !user.email) {
        setUploadStatus({
          type: "error",
          message: "Devi essere autenticato per caricare un avatar.",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        setUploadStatus({
          type: "error",
          message: "Puoi caricare solo file immagine.",
        });
        return;
      }

      const safeFileName = sanitizeFileName(file.name);
      const filePath = `${user.id}/${Date.now()}_${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        setUploadStatus({
          type: "error",
          message:
            "Upload non riuscito. Controlla che esista il bucket 'avatars' e che le policy Supabase siano corrette.",
        });
        return;
      }

      const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = publicData.publicUrl;

      updateField("avatar_url", publicUrl);

      const { error: creatorError } = await supabase
        .from("creators")
        .upsert(
          [
            {
              email: form.email || user.email.toLowerCase(),
              display_name:
                form.display_name.trim() || user.email.split("@")[0] || "Utente Lume",
              city: form.city.trim() || null,
              age: form.age.trim() ? Number(form.age) : null,
              bio: form.bio.trim() || null,
              avatar_url: publicUrl,
              tier: form.tier || "base",
              is_verified: form.is_verified === true,
              is_active: true,
            },
          ],
          { onConflict: "email" }
        );

      if (creatorError) {
        setUploadStatus({
          type: "error",
          message: "Avatar caricato, ma non sono riuscito a salvare l'URL nel profilo creator.",
        });
        return;
      }

      setUploadStatus({
        type: "success",
        message: "Avatar caricato e salvato correttamente.",
      });
    } catch {
      setUploadStatus({
        type: "error",
        message: "Si è verificato un errore durante l'upload dell'avatar.",
      });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
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
          message: "Non sono riuscito a salvare il profilo. Controlla le policy Supabase della tabella creators.",
        });
        return;
      }

      setStatus({ type: "success", message: "Profilo aggiornato correttamente." });
    } catch {
      setStatus({
        type: "error",
        message: "Si è verificato un errore imprevisto durante il salvataggio.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordStatus({ type: "idle", message: "" });

    try {
      if (passwordForm.newPassword.length < 6) {
        setPasswordStatus({
          type: "error",
          message: "La nuova password deve contenere almeno 6 caratteri.",
        });
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordStatus({
          type: "error",
          message: "Le nuove password non coincidono.",
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) {
        setPasswordStatus({ type: "error", message: error.message });
        return;
      }

      setPasswordStatus({
        type: "success",
        message: "Password aggiornata correttamente.",
      });

      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setPasswordStatus({
        type: "error",
        message: "Si è verificato un errore durante l’aggiornamento della password.",
      });
    } finally {
      setSavingPassword(false);
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
          <p className="mt-1 text-sm text-zinc-400">{maskEmail(form.email)}</p>

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

          <div className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <div className="text-sm font-medium text-white">Avatar</div>
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              Carica una foto direttamente su Supabase Storage. Serve un bucket pubblico chiamato <span className="font-semibold text-zinc-300">avatars</span>.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="mt-4 block w-full text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cyan-200 hover:file:bg-cyan-500/20"
            />

            {uploadingAvatar ? (
              <p className="mt-3 text-xs text-cyan-300">Upload avatar in corso...</p>
            ) : null}

            <StatusMessage type={uploadStatus.type} message={uploadStatus.message} />
          </div>

          <p className="mt-5 text-sm leading-6 text-zinc-400">
            Anteprima del profilo pubblico. I dati sensibili restano separati nella sezione sicurezza account.
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-8">
        <section className="rounded-[30px] border border-white/10 bg-black/80 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Profilo pubblico</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Qui gestisci i dati che compongono la base del profilo collegato a creators.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
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
              <MaskedField label="Email account" value={maskEmail(form.email)} />

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

        <section className="rounded-[30px] border border-white/10 bg-black/80 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Sicurezza account</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Qui gestisci le informazioni sensibili. L’indirizzo email resta mascherato
              e il cambio password è separato dal profilo pubblico.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <MaskedField label="Email account" value={maskEmail(form.email)} />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field
                label="Nuova password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(value) => updatePasswordField("newPassword", value)}
                placeholder="Minimo 6 caratteri"
              />

              <Field
                label="Conferma nuova password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(value) => updatePasswordField("confirmPassword", value)}
                placeholder="Ripeti la nuova password"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-zinc-500">
                Per ora il cambio email non è esposto in interfaccia per evitare errori e conflitti.
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/15 px-5 py-3 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingPassword ? "Aggiornamento..." : "Aggiorna password"}
              </button>
            </div>

            <StatusMessage type={passwordStatus.type} message={passwordStatus.message} />
          </form>
        </section>
      </div>
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

function MaskedField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 outline-none"
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

  return <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${className}`}>{message}</div>;
}