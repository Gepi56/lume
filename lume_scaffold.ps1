# lume_scaffold.ps1

$ErrorActionPreference = "Stop"

Write-Host ">> Installing dependencies..." -ForegroundColor Cyan
npm i @supabase/supabase-js lucide-react framer-motion

Write-Host ">> Creating folders..." -ForegroundColor Cyan
$folders = @(
  "components/layout",
  "components/creators",
  "components/ui",
  "lib/supabase",
  "public/icons",
  "app/explore",
  "app/ranking",
  "app/elite",
  "app/profile/[id]"
)
foreach ($f in $folders) { New-Item -ItemType Directory -Force -Path $f }

function WriteFile($path, $content) {
  Set-Content -Path $path -Value $content -Encoding UTF8
}

Write-Host ">> Writing files..." -ForegroundColor Cyan

WriteFile "app/globals.css" @"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
* { -webkit-tap-highlight-color: transparent; }
"@

WriteFile "lib/supabase/client.ts" @"
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
"@

WriteFile "components/layout/Header.tsx" @"
import Link from 'next/link';

export default function Header() {
  return (
    <header className='border-b border-slate-100 bg-white'>
      <div className='mx-auto max-w-6xl px-4 py-4 flex justify-between'>
        <Link href='/' className='text-xl font-semibold'>Lume</Link>
        <nav className='flex gap-4 text-sm'>
          <Link href='/explore'>Esplora</Link>
          <Link href='/ranking'>Classifica</Link>
          <Link href='/elite'>Elite</Link>
        </nav>
      </div>
    </header>
  );
}
"@

WriteFile "components/layout/Footer.tsx" @"
export default function Footer() {
  return (
    <footer className='border-t border-slate-100 mt-12'>
      <div className='mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600'>
        © {new Date().getFullYear()} Lume
      </div>
    </footer>
  );
}
"@

WriteFile "app/layout.tsx" @"
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='it'>
      <body className='min-h-screen bg-white text-slate-900'>
        <Header />
        <main className='mx-auto max-w-6xl px-4 py-8'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
"@

WriteFile "app/page.tsx" @"
export default function Home() {
  return (
    <div className='space-y-6'>
      <h1 className='text-4xl font-semibold'>Benvenuto in Lume</h1>
      <p className='text-slate-600'>
        Ecosistema reputazionale con ranking ed Elite.
      </p>
    </div>
  );
}
"@

Write-Host ">> DONE. Now run:"
Write-Host "npm run dev -- -p 3001"