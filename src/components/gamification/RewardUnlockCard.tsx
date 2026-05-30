import { Gift, ArrowUpRight } from "lucide-react";
import { useGamificationStore } from "@/stores/gamificationStore";

export function RewardUnlockCard() {
  const { season } = useGamificationStore();
  const pct = Math.min(100, Math.round((season.weeklyXpEarned / season.weeklyXpCap) * 100));

  return (
    <section className="sp-reward p-6 relative">
      <div className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/85">Unlock reward</p>
          <h3 className="mt-1 text-lg font-bold text-white">Weekly Achievement</h3>
          <p className="text-xs text-white/80 mt-0.5">{season.name}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-white/20 border border-white/25 backdrop-blur flex items-center justify-center">
          <Gift className="h-4 w-4 text-white" />
        </div>
      </div>

      <div className="relative mt-6">
        <div className="flex items-end justify-between mb-2 text-white">
          <span className="text-[11px] tabular-nums text-white/85">{pct}% complete</span>
          <span className="text-xs tabular-nums font-semibold">
            {season.weeklyXpEarned.toLocaleString()} <span className="text-white/70">/ {season.weeklyXpCap.toLocaleString()}</span>
          </span>
        </div>
        <div className="h-2 rounded-full bg-black/25 overflow-hidden ring-1 ring-white/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-white via-cyan-100 to-emerald-200 sp-sheen"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <button className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/95 hover:text-white">
        View reward <ArrowUpRight className="h-3 w-3" />
      </button>
    </section>
  );
}
