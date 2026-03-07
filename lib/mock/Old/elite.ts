export type EliteBenefit = {
  id: string;
  title: string;
  description: string;
  highlight: string;
};

export type EliteRequirement = {
  id: string;
  label: string;
  value: string;
  ok: boolean;
};

export type EliteProgressItem = {
  id: string;
  label: string;
  current: number;
  target: number;
};

export type EliteFAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type EliteData = {
  statusLabel: string;
  accessState: "active" | "locked" | "review";
  currentScore: number;
  targetScore: number;
  summary: string;
  badges: string[];
  benefits: EliteBenefit[];
  requirements: EliteRequirement[];
  progress: EliteProgressItem[];
  faq: EliteFAQItem[];
};

export const eliteMock: EliteData = {
  statusLabel: "In valutazione avanzata",
  accessState: "review",
  currentScore: 86,
  targetScore: 90,
  summary:
    "Elite rappresenta il livello premium reputazionale di Lume. Non è solo un badge estetico: segnala qualità costante, affidabilità elevata e una presenza che ispira maggiore fiducia.",
  badges: ["Visibilità premium", "Fiducia aumentata", "Profilo evidenziato"],
  benefits: [
    {
      id: "1",
      title: "Maggiore evidenza nel sistema",
      description:
        "I profili Elite possono ottenere una visibilità più forte nelle aree strategiche della piattaforma, migliorando la percezione generale del profilo.",
      highlight: "Posizionamento",
    },
    {
      id: "2",
      title: "Segnale di affidabilità superiore",
      description:
        "Il badge Elite comunica rapidamente un livello avanzato di continuità, qualità e reputazione, rafforzando la fiducia già al primo impatto.",
      highlight: "Trust",
    },
    {
      id: "3",
      title: "Profilo più distintivo",
      description:
        "Colori, etichette e stato Elite rendono il profilo più riconoscibile rispetto agli altri, senza stravolgere l'esperienza utente della piattaforma.",
      highlight: "Identità",
    },
    {
      id: "4",
      title: "Accesso a future funzioni premium",
      description:
        "La struttura è pronta per integrare in futuro vantaggi dedicati ai profili Elite, come placement mirati o priorità in alcune sezioni.",
      highlight: "Espansione",
    },
  ],
  requirements: [
    {
      id: "1",
      label: "Punteggio reputazione minimo",
      value: "Target richiesto: 90/100",
      ok: false,
    },
    {
      id: "2",
      label: "Profilo verificato",
      value: "Verifica completata e mantenuta attiva",
      ok: true,
    },
    {
      id: "3",
      label: "Storico affidabile",
      value: "Assenza di criticità recenti o segnalazioni rilevanti",
      ok: true,
    },
    {
      id: "4",
      label: "Qualità costante nel tempo",
      value: "Recensioni e andamento reputazionale stabili",
      ok: true,
    },
  ],
  progress: [
    {
      id: "1",
      label: "Punteggio generale",
      current: 86,
      target: 90,
    },
    {
      id: "2",
      label: "Affidabilità",
      current: 91,
      target: 90,
    },
    {
      id: "3",
      label: "Qualità esperienza",
      current: 92,
      target: 90,
    },
    {
      id: "4",
      label: "Coinvolgimento",
      current: 81,
      target: 85,
    },
  ],
  faq: [
    {
      id: "1",
      question: "Il badge Elite si compra?",
      answer:
        "No. In questa struttura il livello Elite è pensato come risultato reputazionale e non come acquisto diretto. In futuro potrà convivere con logiche premium, ma senza sostituire il merito reputazionale.",
    },
    {
      id: "2",
      question: "Si può perdere lo stato Elite?",
      answer:
        "Sì. Se la qualità, l'affidabilità o la reputazione complessiva peggiorano in modo evidente, lo stato può essere rivisto o rimosso.",
    },
    {
      id: "3",
      question: "A cosa serve questa pagina?",
      answer:
        "Serve a spiegare in modo chiaro il valore del livello Elite, i requisiti minimi e il progresso attuale, senza rendere il sistema confuso o opaco.",
    },
  ],
};
