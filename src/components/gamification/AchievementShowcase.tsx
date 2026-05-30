import { useGamificationStore, tierStyle, rarityStyle } from "@/stores/gamificationStore";
import { Card } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { ChevronRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AchievementShowcase() {
  const all = useGamificationStore((s) => s.achievements);
  const navigate = useNavigate();

  // Show 3 unlocked + 1 in-progress
  const unlocked = all.filter((a) => a.unlocked).slice(0, 3);
  const next = all.find((a) => !a.unlocked && a.progress);
  const display = next ? [...unlocked, next] : unlocked;

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
            Achievements
          </div>
          <h2 className="text-base font-semibold tracking-tight mt-0.5">
            Earned through real engineering
          </h2>
        </div>
        <button
          onClick={() => navigate("/student/profile")}
          className="text-xs text-primary font-semibold inline-flex items-center gap-1 hover:gap-1.5 transition-all"
        >
          View all <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {display.map((a) => {
          const Icon = (Icons as any)[a.icon] ?? Icons.Award;
          const locked = !a.unlocked;
          return (
            <Card
              key={a.id}
              className={`sp-card relative overflow-hidden p-4 ${locked ? "opacity-90" : ""}`}
            >
              {/* Tier ribbon */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5"
                style={{
                  background:
                    a.tier === "platinum"
                      ? "linear-gradient(90deg, hsl(var(--xp)), hsl(var(--tier-architect)))"
                      : a.tier === "gold"
                      ? "linear-gradient(90deg, hsl(var(--tier-gold)), hsl(var(--warning)))"
                      : a.tier === "silver"
                      ? "linear-gradient(90deg, hsl(var(--tier-silver)), hsl(var(--muted-foreground)))"
                      : "linear-gradient(90deg, hsl(var(--tier-bronze)), hsl(28 70% 38%))",
                }}
              />
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`h-10 w-10 rounded-xl border flex items-center justify-center ${tierStyle[a.tier]}`}
                >
                  {locked ? <Lock className="h-4 w-4" /> : <Icon className="h-5 w-5" />}
                </div>
                {a.rarity && (
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded border ${rarityStyle[a.rarity]}`}
                  >
                    {a.rarity}
                  </span>
                )}
              </div>
              <h4 className={`mt-3 text-sm font-semibold truncate ${locked ? "text-muted-foreground" : ""}`}>
                {a.title}
              </h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{a.description}</p>
              {locked && a.progress ? (
                <div className="mt-3">
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-[hsl(var(--xp))]"
                      style={{ width: `${(a.progress.current / a.progress.total) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground tabular-nums">
                    {a.progress.current} / {a.progress.total}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-[10px] text-muted-foreground tabular-nums">
                  {a.holdersPct}% of engineers hold this
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
