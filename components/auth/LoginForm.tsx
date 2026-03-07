"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export function LoginForm() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "error" | "success"; message: string }>({
    type: "idle",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setStatus({ type: "error", message: error.message });
        return;
      }

      setStatus({
        type: "success",
        message: "Accesso eseguito correttamente. Reindirizzamento in corso...",
      });

      router.push("/");
      router.refresh();
    } catch {
      setStatus({
        type: "error",
        message: "Si è verificato un errore imprevisto durante il login.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        placeholder="Inserisci la password"
        value={password}
        onChange={setPassword}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/15 px-5 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Accesso in corso..." : "Accedi"}
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
