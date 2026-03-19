"use client";

import { useEffect, useMemo, useState } from "react";
import { getBrowserSupabase } from "@/components/messages/browser-supabase";

type MessageRow = {
  id: string;
  sender_user_id: string | null;
  sender_role: string;
  body: string | null;
  created_at: string;
  is_deleted: boolean;
  message_type: string;
};

type Props = {
  conversationId: string;
};

export default function ConversationThread({ conversationId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"client" | "creator" | "admin">("client");

  async function loadMessages() {
    const supabase = getBrowserSupabase();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;

    const user = authData?.user;
    if (!user) throw new Error("Utente non autenticato.");

    setUserId(user.id);

    const { data: participantRows, error: participantError } = await supabase
      .from("conversation_participants")
      .select("role_in_conversation")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .limit(1);

    if (participantError) throw participantError;

    const participant = Array.isArray(participantRows) ? participantRows[0] : null;
    if (!participant) throw new Error("Accesso negato a questa conversazione.");

    const validRole = participant.role_in_conversation;
    if (validRole === "creator" || validRole === "admin") {
      setRole(validRole);
    } else {
      setRole("client");
    }

    const { data: rows, error: rowsError } = await supabase
      .from("messages")
      .select("id, sender_user_id, sender_role, body, created_at, is_deleted, message_type")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (rowsError) throw rowsError;

    setMessages(Array.isArray(rows) ? (rows as MessageRow[]) : []);

    await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        await loadMessages();
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Impossibile caricare la conversazione.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  async function handleSend() {
    if (!body.trim()) return;

    try {
      setSending(true);
      setError("");

      const supabase = getBrowserSupabase();

      const { error: insertError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_user_id: userId,
        sender_role: role,
        message_type: "text",
        body: body.trim(),
      });

      if (insertError) throw insertError;

      setBody("");
      await loadMessages();
    } catch (e: any) {
      setError(e?.message || "Invio messaggio non riuscito.");
    } finally {
      setSending(false);
    }
  }

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Caricamento conversazione in corso...
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

    return (
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-2">
            {messages.length ? (
              messages.map((msg) => {
                const mine = msg.sender_user_id === userId;
                return (
                  <div
                    key={msg.id}
                    className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm ${
                      mine
                        ? "ml-auto bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <div>{msg.is_deleted ? "Messaggio eliminato" : msg.body || "—"}</div>
                    <div className={`mt-2 text-xs ${mine ? "text-slate-300" : "text-slate-500"}`}>
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-slate-500">Nessun messaggio disponibile.</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Scrivi un messaggio..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              disabled={sending || !body.trim()}
              onClick={handleSend}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {sending ? "Invio..." : "Invia messaggio"}
            </button>
          </div>
        </div>
      </div>
    );
  }, [loading, error, messages, body, sending, userId]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Conversazione</h1>
        <p className="mt-2 text-sm text-slate-600">
          Thread reale basato sul database della messaggistica.
        </p>
      </div>

      {content}
    </div>
  );
}
