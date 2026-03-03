# lume_scaffold.ps1
# Esegui dentro la cartella del progetto: C:\Dev\lume
# Crea struttura + file + contenuti (Foundation Pack)

$ErrorActionPreference = "Stop"

Write-Host ">> Installing dependencies..." -ForegroundColor Cyan
npm i @supabase/supabase-js lucide-react framer-motion | Out-Host

Write-Host ">> Creating folders..." -ForegroundColor Cyan
$folders = @(
  "components\layout",
  "components\creators",
  "components\ui",
  "lib\supabase",
  "public\icons",
  "app\explore",
  "app\ranking",
  "app\elite",
  "app\profile\[id]"
)
foreach ($f in $folders) { New-Item -ItemType Directory -Force -Path $f | Out-Null }

function WriteUtf8NoBom($path, $content) {
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText((Resolve-Path $path), $content, $utf8NoBom)
}

Write-Host ">> Writing files..." -ForegroundColor Cyan

# .env.local.example
WriteUtf8NoBom ".env.local.example" @"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
"@

# public manifest
WriteUtf8NoBom "public\manifest.webmanifest" @"
{
  "name": "Lume",
  "short_name": "Lume",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
"@

# lib/supabase client
WriteUtf8NoBom "lib\supabase\client.ts" @"
import { createClient } from ""@supabase/supabase-js"";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(""Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
"@

# UI Badge
WriteUtf8NoBom "components\ui\BadgePill.tsx" @"
export function BadgePill({
  children,
  variant = ""base"",
}: {
  children: React.ReactNode;
  variant?: ""verified"" | ""premium"" | ""elite"" | ""rising"" | ""base"";
}) {
  const map: Record<string, string> = {
    base: ""bg-slate-100 text-slate-700"",
    verified: ""bg-emerald-100 text-emerald-800"",
    premium: ""bg-indigo-100 text-indigo-800"",
    elite: ""bg-amber-100 text-amber-900"",
    rising: ""bg-violet-100 text-violet-800"",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${map[variant]}`}>
      {children}
    </span>
  );
}
"@

# Header
WriteUtf8NoBom "components\layout\Header.tsx" @"
import Link from ""next/link"";

export default function Header() {
  return (
    <header className=""border-b border-slate-100 bg-white/80 backdrop-blur"">
      <div className=""mx-auto flex max-w-6xl items-center justify-between px-4 py-4"">
        <Link href=""/"" className=""text-xl font-semibold tracking-tight"">
          Lume
        </Link>

        <nav className=""flex items-center gap-4 text-sm"">
          <Link className=""text-slate-600 hover:text-slate-900"" href=""/explore"">Esplora</Link>
          <Link className=""text-slate-600 hover:text-slate-900"" href=""/ranking"">Classifica</Link>
          <Link className=""text-slate-600 hover:text-slate-900"" href=""/elite"">Elite</Link>
          <Link className=""rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50"" href=""/(auth)/login"">
            Accesso Creator
          </Link>
        </nav>
      </div>
    </header>
  );
}
"@

# Footer
WriteUtf8NoBom "components\layout\Footer.tsx" @"
export default function Footer() {
  return (
    <footer className=""border-t border-slate-100"">
      <div className=""mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 space-y-3"">
        <p className=""font-medium text-slate-700"">Disclaimer</p>
        <p>
          Lume è una piattaforma social reputazionale tra adulti consenzienti.
          Non gestiamo transazioni economiche tra utenti. Eventuali accordi avvengono in privato,
          al di fuori della piattaforma, sotto la responsabilità delle persone coinvolte.
        </p>
        <p className=""text-xs text-slate-500"">© {new Date().getFullYear()} Lume</p>
      </div>
    </footer>
  );
}
"@

# CreatorCard
WriteUtf8NoBom "components\creators\CreatorCard.tsx" @"
import Link from ""next/link"";
import { BadgePill } from ""@/components/ui/BadgePill"";

export type CreatorCardModel = {
  id: string;
  name: string;
  age: number;
  city: string;
  rating: number;
  rankLabel?: string;
  badges: Array<""verified"" | ""premium"" | ""elite"" | ""rising"">;
};

export default function CreatorCard({ model }: { model: CreatorCardModel }) {
  const elite = model.badges.includes(""elite"");

  return (
    <Link
      href={`/profile/${model.id}`}
      className={[
        ""group relative overflow-hidden rounded-3xl border p-4 shadow-sm transition"",
        elite ? ""border-amber-200 hover:shadow-md"" : ""border-slate-100 hover:shadow-md"",
      ].join("" "")}
    >
      <div className=""aspect-[3/4] w-full rounded-2xl bg-slate-100"" />

      <div className=""mt-4 space-y-2"">
        <div className=""flex items-center justify-between gap-3"">
          <p className=""text-lg font-semibold tracking-tight"">
            {model.name} <span className=""text-slate-500 font-medium"">{model.age}</span>
          </p>
          <p className=""text-sm font-semibold text-slate-700"">⭐ {model.rating.toFixed(1)}</p>
        </div>

        <p className=""text-sm text-slate-600"">{model.city} {model.rankLabel ? `· ${model.rankLabel}` : """"}</p>

        <div className=""flex flex-wrap gap-2"">
          {model.badges.includes(""verified"") && <BadgePill variant=""verified"">✅ Verificata</BadgePill>}
          {model.badges.includes(""premium"") && <BadgePill variant=""premium"">🔥 Premium</BadgePill>}
          {model.badges.includes(""elite"") && <BadgePill variant=""elite"">👑 Elite</BadgePill>}
          {model.badges.includes(""rising"") && <BadgePill variant=""rising"">📈 Rising</BadgePill>}
        </div>
      </div>

      {elite && (
        <div className=""pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"">
          <div className=""absolute -inset-24 rounded-full blur-3xl bg-amber-200/30"" />
        </div>
      )}
    </Link>
  );
}
"@

# CreatorGrid demo
WriteUtf8NoBom "components\creators\CreatorGrid.tsx" @"
import CreatorCard, { CreatorCardModel } from ""./CreatorCard"";

const demo: CreatorCardModel[] = [
  { id: ""1"", name: ""Aurora"", age: 29, city: ""Milano"", rating: 4.9, badges: [""verified"", ""premium""], rankLabel: ""#3 Milano"" },
  { id: ""2"", name: ""Luna"", age: 31, city: ""Roma"", rating: 4.8, badges: [""verified"", ""elite""], rankLabel: ""#1 Roma"" },
  { id: ""3"", name: ""Maya"", age: 27, city: ""Torino"", rating: 4.7, badges: [""rising""], rankLabel: ""Rising"" },
  { id: ""4"", name: ""Nina"", age: 34, city: ""Bologna"", rating: 4.9, badges: [""premium""], rankLabel: ""#5 Bologna"" },
  { id: ""5"", name: ""Eve"", age: 30, city: ""Firenze"", rating: 4.6, badges: [""verified""], rankLabel: ""Top 10"" },
  { id: ""6"", name: ""Kira"", age: 28, city: ""Napoli"", rating: 4.8, badges: [""elite""], rankLabel: ""Elite"" },
];

export default function CreatorGrid() {
  return (
    <div className=""grid gap-4 sm:grid-cols-2 lg:grid-cols-3"">
      {demo.map((c) => (
        <CreatorCard key={c.id} model={c} />
      ))}
    </div>
  );
}
"@

# app/globals.css (append minimal, keep tailwind)
WriteUtf8NoBom "app\globals.css" @"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
* { -webkit-tap-highlight-color: transparent; }
"@

# app/layout.tsx
WriteUtf8NoBom "app\layout.tsx" @"
import type { Metadata } from ""next"";
import ""./globals.css"";
import Header from ""@/components/layout/Header"";
import Footer from ""@/components/layout/Footer"";

export const metadata: Metadata = {
  title: ""Lume"",
  description: ""Social reputazionale premium: profili, ranking e accesso Elite."",
  manifest: ""/manifest.webmanifest"",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang=""it"">
      <body className=""min-h-screen bg-white text-slate-900"">
        <Header />
        <main className=""mx-auto w-full max-w-6xl px-4 py-8"">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
"@

# app/page.tsx
WriteUtf8NoBom "app\page.tsx" @"
import Link from ""next/link"";
import CreatorGrid from ""@/components/creators/CreatorGrid"";

export default function HomePage() {
  return (
    <div className=""space-y-10"">
      <section className=""rounded-3xl border border-slate-100 p-8 shadow-sm"">
        <div className=""flex flex-col gap-4"">
          <p className=""inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"">
            🔒 Privacy · Nessuna registrazione visitatori
          </p>

          <h1 className=""text-4xl font-semibold tracking-tight sm:text-5xl"">
            Un ecosistema reputazionale: profili, ranking e accesso Elite.
          </h1>

          <p className=""max-w-2xl text-slate-600"">
            Scopri profili, interagisci in modo discreto, e lascia che qualità e affidabilità guidino la visibilità.
          </p>

          <div className=""flex flex-wrap gap-3"">
            <Link href=""/explore"" className=""rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"">
              Esplora profili
            </Link>
            <Link href=""/ranking"" className=""rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"">
              Vedi classifica
            </Link>
            <Link href=""/elite"" className=""rounded-full border border-amber-200 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-50"">
              Area Elite
            </Link>
          </div>
        </div>
      </section>

      <section className=""space-y-3"">
        <div className=""flex items-end justify-between"">
          <h2 className=""text-2xl font-semibold"">Profili in evidenza</h2>
          <Link className=""text-sm font-semibold text-slate-700 hover:underline"" href=""/explore"">Vedi tutti</Link>
        </div>
        <CreatorGrid />
      </section>

      <section className=""grid gap-4 md:grid-cols-3"">
        {[
          { title: ""1) Scopri"", desc: ""Esplora profili e ranking settimanale."" },
          { title: ""2) Interagisci"", desc: ""Chat discreta e reputazione in crescita."" },
          { title: ""3) Scala"", desc: ""Badge, Elite e visibilità guidata da qualità."" },
        ].map((x) => (
          <div key={x.title} className=""rounded-3xl border border-slate-100 p-6 shadow-sm"">
            <p className=""text-sm font-semibold text-slate-500"">{x.title}</p>
            <p className=""mt-2 text-slate-700"">{x.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
"@

# app/explore/page.tsx
WriteUtf8NoBom "app\explore\page.tsx" @"
import CreatorGrid from ""@/components/creators/CreatorGrid"";

export default function ExplorePage() {
  return (
    <div className=""space-y-6"">
      <div className=""flex flex-col gap-2"">
        <h1 className=""text-3xl font-semibold"">Esplora</h1>
        <p className=""text-slate-600"">Filtri e ordinamento arriveranno nel modulo “Explore Engine”.</p>
      </div>
      <CreatorGrid />
    </div>
  );
}
"@

# app/ranking/page.tsx
WriteUtf8NoBom "app\ranking\page.tsx" @"
export default function RankingPage() {
  return (
    <div className=""space-y-6"">
      <h1 className=""text-3xl font-semibold"">Classifica settimanale</h1>
      <div className=""rounded-3xl border border-slate-100 p-6 shadow-sm"">
        <p className=""text-slate-700 font-semibold"">Preview UI</p>
        <p className=""mt-2 text-slate-600"">
          Nel prossimo modulo colleghiamo: tabella ranking_scores + funzione schedulata (lunedì 00:01) + leaderboard per città.
        </p>
        <p className=""mt-4 text-sm text-slate-500"">Aggiornamento tra: 3 giorni (demo)</p>
      </div>
    </div>
  );
}
"@

# app/elite/page.tsx
WriteUtf8NoBom "app\elite\page.tsx" @"
export default function ElitePage() {
  return (
    <div className=""space-y-6"">
      <div className=""rounded-3xl border border-amber-200 p-8 shadow-sm"">
        <h1 className=""text-3xl font-semibold text-amber-900"">Area Elite</h1>
        <p className=""mt-2 text-amber-900/80"">
          Accesso riservato agli utenti Elite. Nel modulo Stripe + gating applicheremo il blocco reale con upsell.
        </p>
      </div>
    </div>
  );
}
"@

# app/profile/[id]/page.tsx
WriteUtf8NoBom "app\profile\[id]\page.tsx" @"
import { BadgePill } from ""@/components/ui/BadgePill"";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className=""space-y-6"">
      <div className=""grid gap-6 lg:grid-cols-2"">
        <div className=""aspect-[3/4] rounded-3xl bg-slate-100"" />

        <div className=""space-y-3"">
          <h1 className=""text-3xl font-semibold"">Profilo #{id}</h1>
          <p className=""text-slate-600"">Demo. Nel prossimo modulo leggiamo i dati reali da Supabase.</p>

          <div className=""flex flex-wrap gap-2"">
            <BadgePill variant=""verified"">✅ Verificata</BadgePill>
            <BadgePill variant=""premium"">🔥 Premium</BadgePill>
            <BadgePill variant=""elite"">👑 Elite</BadgePill>
          </div>

          <div className=""rounded-3xl border border-slate-100 p-6 shadow-sm"">
            <p className=""font-semibold text-slate-800"">Bio</p>
            <p className=""mt-2 text-slate-600"">
              Profilo in stile social: foto/video, badge dinamici, ranking settimanale, recensioni e statistiche.
            </p>
          </div>

          <button className=""w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"">
            Chatta (demo)
          </button>
        </div>
      </div>
    </div>
  );
}
"@

Write-Host ">> DONE. Now create .env.local and run dev on port 3001." -ForegroundColor Green
Write-Host "   npm run dev -- -p 3001" -ForegroundColor Yellow
"@

---

## STEP 5) Esegui lo script
Sempre da CMD, dentro `C:\Dev\lume`, incolla:

```bat
powershell -ExecutionPolicy Bypass -File .\lume_scaffold.ps1