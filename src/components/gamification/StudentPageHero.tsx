import { ReactNode } from "react";
import { useGamificationStore } from "@/stores/gamificationStore";
import { Flame, Zap, Trophy, Sparkles } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Stat {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: "violet" | "cyan" | "amber" | "lime" | "magenta";
}

interface StudentPageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  icon?: LucideIcon;
  stats?: Stat[];
  actions?: ReactNode;
  /** "violet" (default), "cyan", "amber", "magenta", "lime" */
  variant?: "violet" | "cyan" | "amber" | "magenta" | "lime";
}

const variantGradient: Record<NonNullable<StudentPageHeroProps["variant"]>, string> = {
  violet: "var(--sp-grad-hero)",
  cyan: "var(--sp-grad-reward)",
  amber: "var(--sp-grad-amber)",
  magenta: "var(--sp-grad-magenta)",
  lime: "var(--sp-grad-lime)",
};

export function StudentPageHero({
  eyebrow,
  title,
  description,
  icon: Icon = Sparkles,
  stats,
  actions,
  variant = "violet",
}: StudentPageHeroProps) {
  const { profile, streak, momentum } = useGamificationStore();

  const defaultStats: Stat[] = [
    { icon: Trophy, label: "Level", value: profile.level },
    { icon: Flame, label: "Streak", value: `${streak.current}d` },
    { icon: Zap, label: "Momentum", value: `${momentum.multiplier}×` },
  ];
  const renderStats = stats ?? defaultStats;

  return (
    <section
      className="sp-hero relative px-6 py-6 md:px-8 md:py-7"
      style={{ background: variantGradient[variant], backgroundSize: "200% 200%" }}
    >
      <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/15 blur-3xl animate-float-soft" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-44 w-44 rounded-full bg-fuchsia-400/25 blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="min-w-0 flex items-start gap-4">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 border border-white/25 backdrop-blur">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            {eyebrow && (
              <p className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/85">
                <Sparkles className="h-3 w-3" /> {eyebrow}
              </p>
            )}
            <h1 className="mt-1 text-2xl md:text-[28px] font-bold tracking-tight leading-tight text-white drop-shadow-sm">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 text-sm text-white/85 max-w-2xl">{description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          <div className="flex flex-wrap gap-2">
            {renderStats.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white tabular-nums"
              >
                <s.icon className="h-3.5 w-3.5" />
                <span className="text-white/80">{s.label}</span>
                <span className="font-semibold">{s.value}</span>
              </span>
            ))}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
