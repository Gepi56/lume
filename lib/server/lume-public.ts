import { createClient } from "@supabase/supabase-js";

type CreatorRow = {
  id: string;
  display_name: string | null;
  city: string | null;
  age: number | null;
  bio: string | null;
  tags: string[] | null;
  avatar_url: string | null;
  gallery_urls: string[] | null;
  tier: string | null;
  is_verified: boolean | null;
  is_active: boolean | null;
};

type ReviewRow = {
  id: string;
  professional_id: string;
  rating: number | null;
  comment: string | null;
  verified: boolean | null;
  created_at: string | null;
};

type ReputationMetric = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
};

type ReputationCategory = {
  id: string;
  label: string;
  description: string;
  score: number;
  weight: number;
};

type ReputationEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  impact: "positive" | "neutral" | "negative";
  delta: number;
};

type ReputationData = {
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

type EliteRequirement = {
  title: string;
  description: string;
  target: string;
  progress: number;
};

type EliteBenefit = {
  title: string;
  description: string;
};

type EliteFaqItem = {
  question: string;
  answer: string;
};

type AccountStatus = {
  reputationScore: number;
  reputationLevel: string;
  isVerified: boolean;
  isElite: boolean;
  nextGoalLabel: string;
  nextGoalValue: string;
};

type FeaturedPublicData = {
  creatorId: string;
  creatorName: string;
  creatorCity: string | null;
  accountStatus: AccountStatus;
  reputation: ReputationData;
  elite: {
    requirements: EliteRequirement[];
    benefits: EliteBenefit[];
    faq: EliteFaqItem[];
    actions: string[];
  };
};

type CreatorStats = {
  creator: CreatorRow;
  reviews: ReviewRow[];
  averageRating: number;
  reviewsCount: number;
  positivePct: number;
  verifiedReviewsCount: number;
  score: number;
  level: string;
  isElite: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatDate(value: string | null) {
  if (!value) return "N/D";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/D";

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getLevel(score: number) {
  if (score >= 90) return "Eccellente";
  if (score >= 80) return "Molto alta";
  if (score >= 68) return "Alta";
  if (score >= 55) return "Buona";
  return "In crescita";
}

function buildFallbackData(): FeaturedPublicData {
  const score = 72;
  const level = getLevel(score);

  return {
    creatorId: "fallback",
    creatorName: "Profilo demo",
    creatorCity: null,
    accountStatus: {
      reputationScore: score,
      reputationLevel: level,
      isVerified: false,
      isElite: false,
      nextGoalLabel: "Obiettivo Elite",
      nextGoalValue: "90/100",
    },
    reputation: {
      score,
      level,
      isVerified: false,
      isElite: false,
      summary:
        "Supabase è collegato ma i dati pubblici disponibili non sono ancora sufficienti per una lettura completa del profilo in evidenza.",
      lastUpdated: "N/D",
      metrics: [
        { label: "Recensioni positive", value: "0%", delta: "nessun dato", trend: "neutral" },
        { label: "Affidabilità", value: "N/D", delta: "in attesa dati", trend: "neutral" },
        { label: "Rating medio", value: "N/D", delta: "non disponibile", trend: "neutral" },
        { label: "Segnalazioni", value: "0", delta: "nessun dato critico visibile", trend: "neutral" },
      ],
      categories: [
        {
          id: "quality",
          label: "Qualità esperienza",
          description: "Il punteggio crescerà quando arriveranno recensioni reali.",
          score: 60,
          weight: 35,
        },
        {
          id: "reliability",
          label: "Affidabilità",
          description: "La costanza del profilo verrà stimata con storico reale.",
          score: 68,
          weight: 30,
        },
        {
          id: "engagement",
          label: "Coinvolgimento",
          description: "Servono più interazioni per una valutazione attendibile.",
          score: 55,
          weight: 20,
        },
        {
          id: "trust",
          label: "Trust & sicurezza",
          description: "Badge e verifiche influenzeranno la sezione trust.",
          score: 70,
          weight: 15,
        },
      ],
      events: [
        {
          id: "fallback-1",
          title: "Dati reali non ancora sufficienti",
          description: "La pagina è collegata a Supabase ma non ha ancora uno storico completo da mostrare.",
          date: "N/D",
          impact: "neutral",
          delta: 0,
        },
      ],
      tips: [
        "Aggiungere creator attivi in tabella creators.",
        "Associare recensioni reali in tabella reviews.",
        "Verificare i campi tier e is_verified per sbloccare logiche Elite più precise.",
      ],
    },
    elite: {
      requirements: [
        {
          title: "Punteggio reputazionale",
          description: "Raggiungere una soglia alta e stabile.",
          target: "90/100",
          progress: 72,
        },
        {
          title: "Verifica profilo",
          description: "Il badge verificata migliora il trust generale.",
          target: "Attiva",
          progress: 0,
        },
        {
          title: "Recensioni consistenti",
          description: "Uno storico di recensioni rende il livello Elite più credibile.",
          target: "Minimo 5",
          progress: 0,
        },
      ],
      benefits: [
        {
          title: "Visibilità premium",
          description: "Un profilo Elite comunica qualità e stabilità superiori.",
        },
        {
          title: "Maggiore fiducia",
          description: "Badge, punteggio e coerenza rendono il profilo più forte.",
        },
      ],
      faq: [
        {
          question: "Perché vedo un profilo demo?",
          answer: "Perché la pagina è collegata a Supabase ma non trova ancora dati pubblici completi per un creator attivo.",
        },
      ],
      actions: [
        "Aggiungere almeno un creator attivo.",
        "Inserire recensioni reali associate a professional_id.",
        "Impostare tier e verifica per rendere calcolabile il livello Elite.",
      ],
    },
  };
}

function getSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function calculateScore(stats: {
  averageRating: number;
  reviewsCount: number;
  positivePct: number;
  verifiedReviewsCount: number;
  tier: string | null;
  isVerified: boolean;
}) {
  const ratingScore = (stats.averageRating / 5) * 58;
  const volumeScore = Math.min(stats.reviewsCount * 3, 18);
  const positiveScore = (stats.positivePct / 100) * 14;
  const verifiedReviewScore = Math.min(stats.verifiedReviewsCount * 1.5, 6);
  const badgeScore = stats.isVerified ? 6 : 0;
  const tierScore =
    stats.tier === "elite" ? 8 : stats.tier === "pro" ? 4 : 0;

  return Math.round(
    clamp(
      ratingScore + volumeScore + positiveScore + verifiedReviewScore + badgeScore + tierScore,
      0,
      100
    )
  );
}

function buildStatsForCreator(creator: CreatorRow, reviews: ReviewRow[]): CreatorStats {
  const validRatings = reviews
    .map((review) => Number(review.rating ?? 0))
    .filter((rating) => rating > 0);

  const reviewsCount = validRatings.length;
  const averageRating =
    reviewsCount > 0
      ? Number((validRatings.reduce((sum, rating) => sum + rating, 0) / reviewsCount).toFixed(2))
      : 0;

  const positiveCount = validRatings.filter((rating) => rating >= 4).length;
  const positivePct =
    reviewsCount > 0 ? Math.round((positiveCount / reviewsCount) * 100) : 0;

  const verifiedReviewsCount = reviews.filter((review) => review.verified === true).length;
  const isVerified = creator.is_verified === true;

  const score = calculateScore({
    averageRating,
    reviewsCount,
    positivePct,
    verifiedReviewsCount,
    tier: creator.tier,
    isVerified,
  });

  const isElite =
    creator.tier === "elite" ||
    (score >= 90 && isVerified && reviewsCount >= 5 && averageRating >= 4.5);

  return {
    creator,
    reviews,
    averageRating,
    reviewsCount,
    positivePct,
    verifiedReviewsCount,
    score,
    level: getLevel(score),
    isElite,
  };
}

function buildReputationData(stats: CreatorStats): ReputationData {
  const latestReviewDate = stats.reviews
    .map((review) => review.created_at)
    .filter(Boolean)
    .sort()
    .reverse()[0] ?? null;

  const qualityScore = clamp(Math.round((stats.averageRating / 5) * 100), 0, 100);
  const reliabilityScore = clamp(
    Math.round((stats.positivePct * 0.7) + (stats.creator.is_verified ? 15 : 0)),
    0,
    100
  );
  const engagementScore = clamp(Math.min(stats.reviewsCount * 10, 100), 0, 100);
  const trustScore = clamp(
    (stats.creator.is_verified ? 65 : 40) +
      (stats.creator.tier === "elite" ? 20 : stats.creator.tier === "pro" ? 10 : 0) +
      Math.min(stats.verifiedReviewsCount * 3, 15),
    0,
    100
  );

  const latestReviews = [...stats.reviews]
    .sort((a, b) => {
      const aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bValue = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bValue - aValue;
    })
    .slice(0, 3);

  const events: ReputationEvent[] =
    latestReviews.length > 0
      ? latestReviews.map((review, index) => {
          const rating = Number(review.rating ?? 0);
          const positive = rating >= 4;

          return {
            id: review.id || `review-${index}`,
            title: positive ? "Nuova recensione positiva" : "Recensione da monitorare",
            description:
              review.comment?.trim() ||
              (positive
                ? "Una recensione recente ha rafforzato la reputazione del profilo."
                : "Una recensione recente richiede attenzione per migliorare il punteggio."),
            date: formatDate(review.created_at),
            impact: positive ? "positive" : "negative",
            delta: positive ? 2 : -1,
          };
        })
      : [
          {
            id: "no-reviews",
            title: "Nessuna recensione disponibile",
            description: "Il profilo è attivo ma non ha ancora recensioni visibili sufficienti.",
            date: "N/D",
            impact: "neutral",
            delta: 0,
          },
        ];

  const tips: string[] = [];
  if (stats.reviewsCount < 5) {
    tips.push("Aumentare il numero di recensioni reali per rendere il punteggio più solido.");
  }
  if (!stats.creator.is_verified) {
    tips.push("Attivare la verifica profilo per migliorare trust score e credibilità.");
  }
  if (stats.averageRating < 4.5) {
    tips.push("Lavorare sulla qualità percepita per spingere il rating medio verso 4.5+.");
  }
  if (stats.positivePct < 85) {
    tips.push("Mantenere continuità nelle esperienze positive per alzare la percentuale di feedback forti.");
  }
  if (tips.length === 0) {
    tips.push("Il profilo è già molto solido: conviene mantenere costanza, qualità e recensioni recenti.");
  }

  return {
    score: stats.score,
    level: stats.level,
    isVerified: stats.creator.is_verified === true,
    isElite: stats.isElite,
    summary: `${stats.creator.display_name || "Questo profilo"} mostra una reputazione reale costruita su ${stats.reviewsCount} recensioni visibili e una media di ${stats.averageRating || 0}/5.`,
    lastUpdated: formatDate(latestReviewDate),
    metrics: [
      {
        label: "Recensioni positive",
        value: `${stats.positivePct}%`,
        delta: stats.reviewsCount > 0 ? `${stats.reviewsCount} recensioni totali` : "nessuna recensione",
        trend: stats.positivePct >= 85 ? "up" : stats.positivePct >= 70 ? "neutral" : "down",
      },
      {
        label: "Affidabilità",
        value: `${reliabilityScore}/100`,
        delta: stats.creator.is_verified ? "profilo verificato" : "verifica assente",
        trend: stats.creator.is_verified ? "up" : "neutral",
      },
      {
        label: "Rating medio",
        value: stats.reviewsCount > 0 ? `${stats.averageRating}/5` : "N/D",
        delta: stats.averageRating >= 4.5 ? "fascia premium" : "margine di crescita",
        trend: stats.averageRating >= 4.5 ? "up" : stats.averageRating >= 4 ? "neutral" : "down",
      },
      {
        label: "Segnalazioni",
        value: "0",
        delta: "nessun dato critico visibile",
        trend: "neutral",
      },
    ],
    categories: [
      {
        id: "quality",
        label: "Qualità esperienza",
        description: "Deriva soprattutto dal rating medio reale delle recensioni.",
        score: qualityScore,
        weight: 35,
      },
      {
        id: "reliability",
        label: "Affidabilità",
        description: "Tiene conto di feedback positivi, continuità e stato verificata.",
        score: reliabilityScore,
        weight: 30,
      },
      {
        id: "engagement",
        label: "Coinvolgimento",
        description: "Si basa sul volume recensioni disponibile per il profilo.",
        score: engagementScore,
        weight: 20,
      },
      {
        id: "trust",
        label: "Trust & sicurezza",
        description: "Considera verifica profilo, tier e recensioni verificate.",
        score: trustScore,
        weight: 15,
      },
    ],
    events,
    tips,
  };
}

function buildEliteData(stats: CreatorStats) {
  const requirements: EliteRequirement[] = [
    {
      title: "Soglia reputazionale",
      description: "Il profilo si avvicina al livello Elite quando il punteggio reputazionale supera la soglia target.",
      target: "90/100",
      progress: stats.score,
    },
    {
      title: "Verifica profilo",
      description: "La verifica rafforza il trust e migliora la leggibilità pubblica del profilo.",
      target: stats.creator.is_verified ? "Attiva" : "Da attivare",
      progress: stats.creator.is_verified ? 100 : 35,
    },
    {
      title: "Storico recensioni",
      description: "Un numero sufficiente di recensioni rende il livello Elite più credibile e meno occasionale.",
      target: "Minimo 5",
      progress: clamp(Math.round((stats.reviewsCount / 5) * 100), 0, 100),
    },
    {
      title: "Rating medio premium",
      description: "Per l’accesso Elite conta molto mantenere una media recensioni molto alta.",
      target: "4.5/5+",
      progress: clamp(Math.round((stats.averageRating / 4.5) * 100), 0, 100),
    },
  ];

  const benefits: EliteBenefit[] = [
    {
      title: "Visibilità reputazionale più forte",
      description: "Il livello Elite aumenta la percezione premium del profilo e ne rafforza il posizionamento.",
    },
    {
      title: "Maggiore fiducia pubblica",
      description: "Verifica, qualità media e storico recensioni rendono il profilo più credibile a colpo d’occhio.",
    },
    {
      title: "Distinzione nella piattaforma",
      description: "Un profilo con standard Elite comunica solidità e coerenza migliori rispetto alla media.",
    },
  ];

  const faq: EliteFaqItem[] = [
    {
      question: "Il profilo è già Elite?",
      answer: stats.isElite
        ? "Sì. Il profilo rispetta già i requisiti principali o possiede un tier Elite registrato."
        : "Non ancora. La pagina mostra quanto manca ai requisiti principali usando dati reali Supabase.",
    },
    {
      question: "Cosa pesa di più per arrivare a Elite?",
      answer: "Soprattutto punteggio reputazionale, verifica profilo, numero recensioni e rating medio elevato.",
    },
    {
      question: "La pagina usa dati reali?",
      answer: "Sì. La pagina legge creators e reviews da Supabase e costruisce i criteri Elite senza cambiare la grafica.",
    },
  ];

  const actions: string[] = [];
  if (!stats.creator.is_verified) {
    actions.push("Attivare la verifica del profilo per aumentare il trust score.");
  }
  if (stats.reviewsCount < 5) {
    actions.push("Raccogliere almeno 5 recensioni reali per consolidare la valutazione Elite.");
  }
  if (stats.averageRating < 4.5) {
    actions.push("Alzare il rating medio verso la fascia 4.5/5 o superiore.");
  }
  if (stats.score < 90) {
    actions.push(`Incrementare il punteggio reputazionale di almeno ${90 - stats.score} punti circa.`);
  }
  if (actions.length === 0) {
    actions.push("Mantenere costanza, qualità e recensioni recenti per conservare il livello Elite.");
  }

  return {
    requirements,
    benefits,
    faq,
    actions,
  };
}

export async function getLumeFeaturedPublicData(): Promise<FeaturedPublicData> {
  const supabase = getSupabasePublicClient();

  if (!supabase) {
    return buildFallbackData();
  }

  try {
    const { data: creatorsRaw, error: creatorsError } = await supabase
      .from("creators")
      .select(
        "id, display_name, city, age, bio, tags, avatar_url, gallery_urls, tier, is_verified, is_active"
      )
      .eq("is_active", true);

    if (creatorsError || !creatorsRaw || creatorsRaw.length === 0) {
      return buildFallbackData();
    }

    const creators = creatorsRaw as CreatorRow[];
    const creatorIds = creators.map((creator) => creator.id);

    const { data: reviewsRaw, error: reviewsError } = await supabase
      .from("reviews")
      .select("id, professional_id, rating, comment, verified, created_at")
      .in("professional_id", creatorIds);

    if (reviewsError) {
      return buildFallbackData();
    }

    const reviews = (reviewsRaw ?? []) as ReviewRow[];

    const statsList = creators.map((creator) => {
      const creatorReviews = reviews.filter((review) => review.professional_id === creator.id);
      return buildStatsForCreator(creator, creatorReviews);
    });

    const featured = [...statsList].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
      return b.reviewsCount - a.reviewsCount;
    })[0];

    if (!featured) {
      return buildFallbackData();
    }

    const reputation = buildReputationData(featured);
    const elite = buildEliteData(featured);

    return {
      creatorId: featured.creator.id,
      creatorName: featured.creator.display_name || "Profilo in evidenza",
      creatorCity: featured.creator.city || null,
      accountStatus: {
        reputationScore: featured.score,
        reputationLevel: featured.level,
        isVerified: featured.creator.is_verified === true,
        isElite: featured.isElite,
        nextGoalLabel: featured.isElite ? "Stato raggiunto" : "Obiettivo Elite",
        nextGoalValue: featured.isElite ? "Elite attivo" : "90/100",
      },
      reputation,
      elite,
    };
  } catch {
    return buildFallbackData();
  }
}
