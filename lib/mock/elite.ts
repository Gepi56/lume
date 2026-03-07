export type EliteRequirement = {
  title: string;
  description: string;
  target: string;
};

export type EliteBenefit = {
  title: string;
  description: string;
};

export type EliteFaqItem = {
  question: string;
  answer: string;
};

export type EliteData = {
  requirements: EliteRequirement[];
  benefits: EliteBenefit[];
  faq: EliteFaqItem[];
  actions: string[];
};

export const eliteMock: EliteData = {
  requirements: [
    {
      title: "Reputazione elevata",
      description: "Mantenere un punteggio reputazionale stabile e credibile nel tempo.",
      target: "90/100 o superiore",
    },
    {
      title: "Qualità delle recensioni",
      description: "Storico recensioni positivo, coerente e senza anomalie rilevanti.",
      target: "Feedback prevalentemente positivi",
    },
    {
      title: "Affidabilità operativa",
      description: "Presenza costante, risposta regolare e assenza di criticità ripetute.",
      target: "Costanza nel tempo",
    },
  ],
  benefits: [
    {
      title: "Maggiore visibilità",
      description: "Il livello Elite rafforza la percezione premium del profilo.",
    },
    {
      title: "Trust più alto",
      description: "Un profilo Elite trasmette maggiore affidabilità agli utenti.",
    },
    {
      title: "Posizionamento distintivo",
      description: "Lo stato Elite aiuta a distinguersi all’interno dell’ecosistema Lume.",
    },
  ],
  faq: [
    {
      question: "L’accesso a Elite è automatico?",
      answer: "Può dipendere da soglie reputazionali, qualità del profilo e criteri interni della piattaforma.",
    },
    {
      question: "Si può perdere lo stato Elite?",
      answer: "Sì, se nel tempo calano reputazione, costanza o qualità percepita del profilo.",
    },
  ],
  actions: [
    "Mantieni alta la qualità delle recensioni e la costanza di risposta.",
    "Consolida il punteggio reputazionale oltre la soglia obiettivo.",
    "Evita periodi di inattività o comportamenti incoerenti con il livello premium.",
  ],
};
