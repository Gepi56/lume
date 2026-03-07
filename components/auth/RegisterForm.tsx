"use client";

import { FormEvent, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export function RegisterForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "error" | "success"; message: string }>({
    type: "idle",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (password.length < 6) {
      setStatus({
        type: "error",
        message: "La password deve contenere almeno 6 caratteri.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Le password non coincidono.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName.trim(),
          },
        },
      });

      if (error) {
        setStatus({ type: "error", message: error.message });
        return;
      }

      setStatus({
        type: "success",
        message:
          "Registrazione completata. Controlla la tua email per l’eventuale conferma dell’account.",
      });

      setDisplayName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setStatus({
        type: "error",
        message: "Si è verificato un errore imprevisto durante la registrazione.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field
        label="Nome visualizzato"
        type="text"
        placeholder="Come vuoi apparire"
        value={displayName}
        onChange={setDisplayName}
      />

      <Field
        label="Email"
        type="email"
        placeholder="nome@email.com"
        value={email}
        onChange={setEmail}
      />

      <Field
        label="Password"
        type="password"
        placeholder="Minimo 6 caratteri"
        value={password}
        onChange={setPassword}
      />

      <Field
        label="Conferma password"
        type="password"
        placeholder="Ripeti la password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/15 px-5 py-3 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Registrazione in corso..." : "Crea account"}
      </button>

      <StatusMessage type={status.type} message={status.message} />
    </form>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-amber-400/40 focus:bg-white/[0.07]"
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
