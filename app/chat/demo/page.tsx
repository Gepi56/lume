import Link from "next/link";

type SearchParams = {
  creator?: string;
};

export default async function ChatDemoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const creator = sp.creator ?? "profilo";

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
        <div className="space-y-4 bg-slate-50/60 px-6 py-6 min-h-[420px]">
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
              Ciao, grazie per il messaggio. Questa è una demo della chat di Lume.
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[75%] rounded-2xl rounded-tr-md bg-slate-900 px-4 py-3 text-sm text-white shadow-sm">
              Perfetto, volevo vedere come si presenta la conversazione.
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
              Qui collegheremo poi la chat reale con accessi controllati e messaggi veri.
            </div>
          </div>
        </div>

        {/* INPUT FAKE */}
        <div className="border-t border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Scrivi un messaggio... (demo)"
              disabled
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none"
            />
            <button
              type="button"
              className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white opacity-80"
            >
              Invia
            </button>
          </div>

          <div className="mt-2 text-xs text-slate-500">
            Demo UI: la chat reale verrà collegata nello step successivo.
          </div>
        </div>
      </div>
    </div>
  );
}