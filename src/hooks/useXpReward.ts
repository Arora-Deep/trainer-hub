import { useCallback } from "react";

export type XpRewardInput = {
  source: string;
  amount: number;
  skill?: string;
};

export function useXpReward() {
  return useCallback((_r: XpRewardInput) => {
    /* no-op: gamification XP removed */
  }, []);
}
