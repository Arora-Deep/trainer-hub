import { useCallback } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { useGamificationStore, type SkillKey } from "@/stores/gamificationStore";
import { playXp, playLevelUp, haptic } from "@/lib/feedback";

export interface XpRewardInput {
  amount: number;
  skill: SkillKey;
  source: string; // e.g. "Lab · Kubernetes Networking"
  levelUp?: boolean;
}

export function useXpReward() {
  const addXpEvent = useGamificationStore((s) => s.addXpEvent);
  const feedback = useGamificationStore((s) => s.feedback);

  return useCallback((r: XpRewardInput) => {
    addXpEvent({ label: r.source, amount: r.amount, skill: r.skill });
    playXp(feedback.sound);
    haptic(8, feedback.haptics);
    toast.success(`+${r.amount} XP`, {
      description: r.source,
      duration: 2500,
    });
    if (r.levelUp) {
      setTimeout(() => {
        playLevelUp(feedback.sound);
        haptic([10, 40, 10, 40], feedback.haptics);
        toast(`Level up!`, { description: `New level reached on ${r.skill}.`, duration: 3500 });
      }, 400);
    }
  }, [addXpEvent, feedback]);
}
