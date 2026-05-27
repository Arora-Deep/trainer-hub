import { Crown, Sparkles, Hexagon, Diamond, Award, Gem } from "lucide-react";
import { type Tier, tierGradient, tierLabel } from "@/stores/gamificationStore";
import { cn } from "@/lib/utils";

const TierIcon: Record<Tier, typeof Crown> = {
  bronze: Award, silver: Hexagon, gold: Crown,
  platinum: Gem, diamond: Diamond, architect: Sparkles,
};

export function TierBadge({
  tier, size = "md", showLabel = true, shimmer = false, className,
}: {
  tier: Tier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  shimmer?: boolean;
  className?: string;
}) {
  const Icon = TierIcon[tier];
  const padding = size === "sm" ? "h-5 px-1.5 text-[10px]" : size === "lg" ? "h-8 px-3 text-sm" : "h-6 px-2 text-[11px]";
  const iconSize = size === "sm" ? "h-2.5 w-2.5" : size === "lg" ? "h-4 w-4" : "h-3 w-3";

  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-1 rounded-full font-semibold text-white overflow-hidden bg-gradient-to-r",
        tierGradient[tier],
        padding,
        className,
      )}
    >
      <Icon className={iconSize} />
      {showLabel && <span className="tracking-wide">{tierLabel[tier]}</span>}
      {shimmer && <span className="absolute inset-0 tier-shimmer pointer-events-none" />}
    </span>
  );
}
