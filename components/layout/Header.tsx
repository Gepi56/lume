"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Trophy,
  Crown,
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  MapPin,
  Sparkle,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  tone?: "base" | "elite";
};

type HeaderProfile = {
  email: string;
  displayName: string;
  avatarUrl: string | null;
  city: string | null;
  showCity: boolean;
  badgeLabel: string;
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

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "L";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  if (name.length <= 3) return `${name[0] || ""}***@${domain}`;
  return `${name.slice(0, 3)}***@${domain}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallbackValue: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => window.setTimeout(() => resolve(fallbackValue), ms)),
  ]);
}

function NavPill({ item, active }: { item: NavItem; active: boolean }) {
  const elite = item.tone === "elite";

  return (
    <Link href={item.href} className="relative">
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 520, damping: 20 }}
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

        <motion.span
          aria-hidden
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-2.5 w-2.5 rounded-full bg-amber-400"
        >
          <span className="absolute inset-0 rounded-full bg-amber-300 blur-lg opacity-50" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
        </motion.span>

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

function AuthPill({
  href,
  label,
  icon,
  tone = "base",
}: {
  href: string;
  label: string;
  icon: ReactNode;
  tone?: "base" | "gold";
}) {
  const gold = tone === "gold";

  return (
    <Link href={href} className="relative">
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 520, damping: 20 }}
        className={[
          "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition shadow-sm",
          gold
            ? "border-amber-200 bg-amber-50/90 text-amber-900 hover:bg-amber-50"
            : "border-slate-200 bg-white/70 text-slate-800 hover:bg-white",
        ].join(" ")}
      >
        <span
          className={[
            "inline-flex items-center justify-center rounded-full p-1.5",
            gold ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700",
          ].join(" ")}
        >
          {icon}
        </span>
        <span>{label}</span>
      </motion.div>
    </Link>
  );
}

function UserBadge({ profile }: { profile: HeaderProfile }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-2.5 py-2 shadow-sm">
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt={profile.displayName}
          className="h-9 w-9 rounded-full object-cover ring-1 ring-black/5"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          {initialsFromName(profile.displayName)}
        </div>
      )}

      <div className="flex flex-col pr-1">
        <span className="max-w-[150px] truncate text-sm font-semibold text-slate-900">
          {profile.displayName}
        </span>
        <span className="max-w-[160px] truncate text-[11px] text-slate-500">
          {maskEmail(profile.email)}
        </span>

        {profile.showCity && profile.city ? (
          <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="h-3 w-3" />
            {profile.city}
          </span>
        ) : null}
      </div>

      <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-800">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>{profile.badgeLabel}</span>
      </div>
    </div>
  );
}

function ActionPill({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link href={href}>
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-white">
        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 p-1.5 text-slate-700">
          {icon}
        </span>
        <span>{label}</span>
      </div>
    </Link>
  );
}

function LogoutPill({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-white"
    >
      <span className="inline-flex items-center justify-center rounded-full bg-rose-50 p-1.5 text-rose-700">
        <LogOut className="h-4 w-4" />
      </span>
      <span>Logout</span>
    </button>
  );
}

function AuthActionsSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="h-11 w-44 animate-pulse rounded-full border border-slate-200 bg-slate-100" />
      <div className="h-11 w-36 animate-pulse rounded-full border border-slate-200 bg-slate-100" />
      <div className="h-11 w-32 animate-pulse rounded-full border border-slate-200 bg-slate-100" />
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [profile, setProfile] = useState<HeaderProfile | null>(null);
  const [authResolved, setAuthResolved] = useState(false);

  async function hydrateProfileFromUser(user: { email?: string | null; user_metadata?: Record<string, unknown> } | null) {
    if (!user?.email) {
      setProfile(null);
      setAuthResolved(true);
      return;
    }

    const fallbackName =
      (typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name.trim() : "") ||
      user.email.split("@")[0] ||
      "Utente Lume";

    let displayName = fallbackName;
    let avatarUrl: string | null = null;
    let city: string | null = null;
    let showCity = false;
    const badgeLabel = "Cliente";

    try {
      const profileResult = await withTimeout(
        supabase
          .from("profiles")
          .select("display_name, avatar_url, city, show_city")
          .eq("email", user.email)
          .limit(1),
        2500,
        { data: null, error: { message: "profiles timeout" } as { message: string } | null },
      );

      const profileRows = Array.isArray(profileResult.data) ? profileResult.data : [];
      const profileRow = profileRows[0] ?? null;

      if (profileRow) {
        displayName = profileRow.display_name || fallbackName;
        avatarUrl = profileRow.avatar_url || null;
        city = profileRow.city || null;
        showCity = profileRow.show_city === true;
      }
    } catch {
      // fallback auth
    }

    setProfile({
      email: user.email,
      displayName,
      avatarUrl,
      city,
      showCity,
      badgeLabel,
    });
    setAuthResolved(true);
  }

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      setAuthResolved(false);

      try {
        const userResult = await withTimeout(
          supabase.auth.getUser(),
          2500,
          { data: { user: null }, error: { message: "auth timeout" } as { message: string } | null },
        );

        if (!mounted) return;
        await hydrateProfileFromUser(userResult.data.user ?? null);
      } catch {
        if (!mounted) return;
        setProfile(null);
        setAuthResolved(true);
      }
    }

    void bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      await hydrateProfileFromUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfile(null);
    setAuthResolved(true);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="group relative flex items-center gap-2">
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-[34px] font-semibold tracking-[-0.02em] text-transparent">
            Lume
          </span>

          <motion.span
            aria-hidden
            animate={{ opacity: [0.55, 0.95, 0.55] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-2.5 w-2.5 rounded-full bg-amber-400"
          >
            <span className="absolute inset-0 rounded-full bg-amber-300 blur-md opacity-60" />
          </motion.span>

          <span className="hidden text-xs font-medium tracking-wide text-slate-500 md:inline">
            Private Reputation Network
          </span>
        </Link>

        <div className="flex flex-col gap-3 lg:items-end">
          <nav className="flex flex-wrap items-center gap-2">
            {NAV.map((item) => (
              <NavPill key={item.href} item={item} active={isActive(pathname, item.href)} />
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            {!authResolved ? (
              <AuthActionsSkeleton />
            ) : profile ? (
              <>
                <UserBadge profile={profile} />
                <ActionPill href="/creator" label="Creator Studio" icon={<Sparkle className="h-4 w-4" />} />
                <ActionPill href="/dashboard" label="Dashboard" icon={<LayoutDashboard className="h-4 w-4" />} />
                <LogoutPill onClick={handleLogout} />
              </>
            ) : (
              <>
                <AuthPill href="/login" label="Login" icon={<LogIn className="h-4 w-4" />} />
                <AuthPill href="/register" label="Registrati" icon={<UserPlus className="h-4 w-4" />} tone="gold" />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
