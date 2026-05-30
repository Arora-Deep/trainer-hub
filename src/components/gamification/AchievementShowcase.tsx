import { useGamificationStore, rarityStyle } from "@/stores/gamificationStore";
import { Card } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { ChevronRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AchievementShowcase() {
  const all = useGamificationStore((s) => s.achievements);
  const navigate = useNavigate();

  const unlocked = all.filter((a) => a.unlocked).slice(0, 3);
  const next = all.find((a) => !a.unlocked && a.progress);
  const display = next ? [...unlocked, next] : unlocked;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Achievements
          </div>
          <h2 className="text-base font-semibold tracking-tight mt-1">Earned through engineering</h2>
        </div>
        <button
          onClick={() => navigate("/student/profile")}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {display.map((a) => {
          const Icon = (Icons as any)[a.icon] ?? Icons.Award;
          const locked = !a.unlocked;
          return (
            <Card key={a.id} className={`sp-card p-4 ${locked ? "opacity-70" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="h-9 w-9 rounded-xl border border-border flex items-center justify-center bg-muted/40">
                  {locked ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Icon className="h-4 w-4" />}
                </div>
                {a.rarity && (
                  <span className={`text-[9px] uppercase tracking-[0.14em] font-medium px-1.5 py-0.5 rounded border ${rarityStyle[a.rarity]}`}>
                    {a.rarity}
                  </span>
                )}
              </div>
              <h4 className="mt-3 text-sm font-semibold truncate">{a.title}</h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{a.description}</p>
              {locked && a.progress ? (
                <div className="mt-3">
                  <div className="h-0.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-foreground" style={{ width: `${(a.progress.current / a.progress.total) * 100}%` }} />
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground tabular-nums">
                    {a.progress.current} / {a.progress.total}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-[10px] text-muted-foreground tabular-nums">
                  Held by {a.holdersPct}% of engineers
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
