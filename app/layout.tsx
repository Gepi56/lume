import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='it'>
      <body className="min-h-screen bg-slate-50/40 text-slate-900">
        <Header />
        <main className='mx-auto max-w-6xl px-4 py-8'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
