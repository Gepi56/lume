"use client";

import { useEffect, useMemo, useState } from "react";
import { getBrowserSupabase } from "@/components/messages/browser-supabase";

type ConversationRow = {
  id: string;
  subject: string | null;
  status: string;
  last_message_at: string | null;
  last_message_body: string | null;
};

type UnreadRow = {
  conversation_id: string;
  unread_count: number;
};

export default function MessagesInbox() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<ConversationRow[]>([]);
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const supabase = getBrowserSupabase();

        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        const user = authData?.user;
        if (!user) throw new Error("Utente non autenticato.");

        const { data: participantRows, error: participantError } = await supabase
          .from("conversation_participants")
          .select("conversation_id")
          .eq("user_id", user.id);

        if (participantError) throw participantError;

        const ids = Array.isArray(participantRows)
          ? participantRows.map((r: any) => r.conversation_id).filter(Boolean)
          : [];

        if (!ids.length) {
          if (!cancelled) {
            setRows([]);
            setUnreadMap({});
          }
          return;
        }

        const { data: conversationRows, error: conversationError } = await supabase
          .from("conversation_overview")
          .select("*")
          .in("id", ids)
          .order("last_message_at", { ascending: false, nullsFirst: false });

        if (conversationError) throw conversationError;

        const { data: unreadRows, error: unreadError } = await supabase
          .from("conversation_unread_counts")
          .select("conversation_id, unread_count")
          .eq("user_id", user.id);

        if (unreadError) throw unreadError;

        if (!cancelled) {
          setRows(Array.isArray(conversationRows) ? (conversationRows as ConversationRow[]) : []);
          const map: Record<string, number> = {};
          (unreadRows as UnreadRow[] | null)?.forEach((r) => {
            map[r.conversation_id] = Number(r.unread_count || 0);
          });
          setUnreadMap(map);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Impossibile caricare le conversazioni.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Caricamento conversazioni in corso...
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
          {error}
        </div>
      );
    }

    if (!rows.length) {
      return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Nessuna conversazione disponibile.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {rows.map((row) => (
          <a
            key={row.id}
            href={`/messages/${row.id}`}
            className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-base font-semibold text-slate-900">
                  {row.subject || "Conversazione"}
                </div>
                <div className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {row.last_message_body || "Nessun messaggio disponibile."}
                </div>
              </div>

              <div className="shrink-0 text-right">
                {unreadMap[row.id] ? (
                  <div className="mb-2 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                    {unreadMap[row.id]} non letti
                  </div>
                ) : null}
                <div className="text-xs text-slate-500">
                  {row.last_message_at
                    ? new Date(row.last_message_at).toLocaleString()
                    : "Nessuna attività"}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }, [loading, error, rows, unreadMap]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Conversazioni</h1>
        <p className="mt-2 text-sm text-slate-600">
          Inbox reale basata su database: conversazioni, partecipanti e messaggi.
        </p>
      </div>

      {content}
    </div>
  );
}
