export type ReputationMetric = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
};

export type ReputationCategory = {
  id: string;
  label: string;
  description: string;
  score: number;
  weight: number;
};

export type ReputationEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  impact: "positive" | "neutral" | "negative";
  delta: number;
};

export type ReputationData = {
  score: number;
  level: string;
  isVerified: boolean;
  isElite: boolean;
  summary: string;
  lastUpdated: string;
  metrics: ReputationMetric[];
  categories: ReputationCategory[];
  events: ReputationEvent[];
  tips: string[];
};

export const reputationMock: ReputationData = {
  score: 86,
  level: "Molto alta",
  isVerified: true,
  isElite: false,
  summary:
    "Profilo solido, apprezzato per costanza, qualità delle recensioni e buona affidabilità nelle interazioni.",
  lastUpdated: "06 marzo 2026",
  metrics: [
    {
      label: "Recensioni positive",
      value: "94%",
      delta: "+2.1% ultimo mese",
      trend: "up",
    },
    {
      label: "Affidabilità",
      value: "91/100",
      delta: "+4 punti",
      trend: "up",
    },
    {
      label: "Tempo di risposta",
      value: "1.8h",
      delta: "stabile",
      trend: "neutral",
    },
    {
      label: "Segnalazioni",
      value: "0",
      delta: "nessuna variazione",
      trend: "neutral",
    },
  ],
  categories: [
    {
      id: "quality",
      label: "Qualità esperienza",
      description: "Valuta soddisfazione generale, recensioni e percezione del servizio.",
      score: 92,
      weight: 35,
    },
    {
      id: "reliability",
      label: "Affidabilità",
      description: "Misura costanza, puntualità, coerenza e assenza di comportamenti problematici.",
      score: 89,
      weight: 30,
    },
    {
      id: "engagement",
      label: "Coinvolgimento",
      description: "Considera interazioni, velocità di risposta e presenza attiva sulla piattaforma.",
      score: 81,
      weight: 20,
    },
    {
      id: "trust",
      label: "Trust & sicurezza",
      description: "Badge, verifica profilo e storico pulito migliorano il punteggio.",
      score: 84,
      weight: 15,
    },
  ],
  events: [
    {
      id: "1",
      title: "Nuova recensione a 5 stelle",
      description: "Una recensione recente ha migliorato il punteggio di qualità esperienza.",
      date: "04 marzo 2026",
      impact: "positive",
      delta: 3,
    },
    {
      id: "2",
      title: "Badge Verificata confermato",
      description: "Il profilo mantiene il suo stato verificato, consolidando la fiducia.",
      date: "28 febbraio 2026",
      impact: "positive",
      delta: 2,
    },
    {
      id: "3",
      title: "Tempo di risposta stabile",
      description: "Nessun impatto significativo, ma il mantenimento della costanza è positivo.",
      date: "21 febbraio 2026",
      impact: "neutral",
      delta: 0,
    },
  ],
  tips: [
    "Mantieni alta la rapidità di risposta per migliorare la percezione di affidabilità.",
    "Incentiva recensioni qualitative dopo esperienze particolarmente riuscite.",
    "Continua a evitare cancellazioni o interazioni incoerenti per proteggere il trust score.",
    "Punta al superamento di 90/100 per l’accesso naturale al livello Elite.",
  ],
};
