"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Trophy, Crown, Sparkles } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  tone?: "base" | "elite";
};

const NAV: NavItem[] = [
  { href: "/explore", label: "Esplora", icon: <Search className="h-4 w-4" />, tone: "base" },
  { href: "/ranking", label: "Classifica", icon: <Trophy className="h-4 w-4" />, tone: "base" },
  { href: "/reputation", label: "reputation", icon: <Sparkles className="h-4 w-4" />, tone: "base" },
  { href: "/elite", label: "Elite", icon: <Crown className="h-4 w-4" />, tone: "elite" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavPill({ item, active }: { item: NavItem; active: boolean }) {
  const elite = item.tone === "elite";

  return (
    <Link href={item.href} className="relative">
      <motion.div
  whileHover={{ y: -3, scale: 1.03 }}
  transition={{ type: "spring", stiffness: 520, damping: 18 }}
        className={[
          "group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold",
          "transition shadow-sm",
          active ? "bg-white" : "bg-white/70 hover:bg-white",
          elite ? "border-amber-200" : "border-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "inline-flex items-center justify-center rounded-full p-1.5",
            elite ? "bg-amber-50 text-amber-900" : "bg-slate-100 text-slate-700",
          ].join(" ")}
        >
          {item.icon}
        </span>

        <span className={elite ? "text-amber-900" : "text-slate-800"}>{item.label}</span>

        {/* “respiro” leggerissimo */}
        <motion.span
  aria-hidden
  animate={{ opacity: [0.6, 1, 0.6] }}
  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
  className="relative h-2.5 w-2.5 rounded-full bg-amber-400"
>
  <span className="absolute inset-0 rounded-full bg-amber-300 blur-lg opacity-50" />
  <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
</motion.span>

        {/* underline attivo elegante */}
        {active && (
          <motion.span
            layoutId="activePill"
            className={[
              "absolute -bottom-2 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full",
              elite ? "bg-amber-500/80" : "bg-slate-900/80",
            ].join(" ")}
          />
        )}
      </motion.div>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* LOGO */}
        <Link href="/" className="group relative flex items-center gap-2">
<span className="text-[34px] font-semibold tracking-[-0.02em] bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
  Lume
</span>

          {/* punto “luce” */}
          <motion.span
            aria-hidden
            animate={{ opacity: [0.55, 0.95, 0.55] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-2.5 w-2.5 rounded-full bg-amber-400"
          >
            <span className="absolute inset-0 rounded-full bg-amber-300 blur-md opacity-60" />
          </motion.span>

          {/* sottotitolo premium (desktop) */}
          <span className="hidden md:inline text-xs font-medium text-slate-500 tracking-wide">
  Private Reputation Network
</span>
        </Link>

        {/* NAV PILLS */}
        <nav className="flex items-center gap-2">
          {NAV.map((item) => (
            <NavPill key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </nav>
      </div>
    </header>
  );
}