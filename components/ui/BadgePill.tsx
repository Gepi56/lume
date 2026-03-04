export function BadgePill({
  children,
  variant = "base",
}: {
  children: React.ReactNode;
  variant?: "verified" | "premium" | "elite" | "rising" | "base";
}) {
  const map: Record<string, string> = {
    base: "bg-slate-100 text-slate-700 border-slate-200",
    verified: "bg-emerald-50 text-emerald-800 border-emerald-200",
    premium: "bg-indigo-50 text-indigo-800 border-indigo-200",
    elite: "bg-amber-50 text-amber-900 border-amber-200",
    rising: "bg-violet-50 text-violet-800 border-violet-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${map[variant]}`}
    >
      {children}
    </span>
  );
}