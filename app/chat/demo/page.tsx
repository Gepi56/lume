"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Msg = {
  id: string;
  from: "creator" | "user";
  text: string;
};

export default function ChatDemoPage() {
  const searchParams = useSearchParams();
  const creator = searchParams.get("creator") ?? "profilo";

  const initialMessages = useMemo<Msg[]>(
    () => [
      {
        id: "m1",
        from: "creator",
        text: "Ciao, grazie per il messaggio. Questa è una demo della chat di Lume.",
      },
      {
        id: "m2",
        from: "user",
        text: "Perfetto, volevo vedere come si presenta la conversazione.",
      },
      {
        id: "m3",
        from: "creator",
        text: "Qui collegheremo poi la chat reale con accessi controllati e messaggi veri.",
      },
    ],
    []
  );

  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState("");

  function sendMessage() {
    const clean = text.trim();
    if (!clean) return;

    const newMsg: Msg = {
      id: `u-${Date.now()}`,
      from: "user",
      text: clean,
    };

    setMessages((prev) => [...prev, newMsg]);
    setText("");

    // Risposta automatica demo
    setTimeout(() => {
      const reply: Msg = {
        id: `c-${Date.now()}`,
        from: "creator",
        text: "Messaggio ricevuto. Questa è una risposta automatica demo.",
      };

      setMessages((prev) => [...prev, reply]);
    }, 700);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              Chat demo
            </div>
            <div className="text-sm text-slate-500">
              Conversazione di anteprima con: {creator}
            </div>
          </div>

          <Link
            href="/explore"
            className="text-sm font-semibold text-slate-600 underline"
          >
            Torna a Esplora
          </Link>
        </div>

        {/* MESSAGGI */}
        <div className="space-y-4 bg-slate-50/60 px-6 py-6 min-h-[420px] max-h-[520px] overflow-y-auto">
          {messages.map((m) =>
            m.from === "creator" ? (
              <div key={m.id} className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-tr-md bg-slate-900 px-4 py-3 text-sm text-white shadow-sm">
                  {m.text}
                </div>
              </div>
            )
          )}
        </div>

        {/* INPUT */}
        <div className="border-t border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Scrivi un messaggio..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
            />

            <button
              type="button"
              onClick={sendMessage}
              className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 transition"
            >
              Invia
            </button>
          </div>

          <div className="mt-2 text-xs text-slate-500">
            Demo interattiva: i messaggi non vengono ancora salvati.
          </div>
        </div>
      </div>
    </div>
  );
}