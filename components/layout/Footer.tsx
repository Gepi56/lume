export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 space-y-3">
        <p className="font-medium text-slate-700">Disclaimer</p>
        <p>
          Lume è una piattaforma social reputazionale tra adulti consenzienti. Non gestiamo transazioni economiche tra
          utenti. Eventuali accordi avvengono in privato, al di fuori della piattaforma, sotto la responsabilità delle
          persone coinvolte.
        </p>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} Lume</p>
      </div>
    </footer>
  );
}