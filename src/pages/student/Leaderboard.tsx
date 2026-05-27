import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGamificationStore, type LeaderboardEntry } from "@/stores/gamificationStore";
import { TrendingUp, TrendingDown, Minus, Crown, Flame } from "lucide-react";
import { SeasonBanner } from "@/components/gamification/SeasonBanner";
import { RivalCallout } from "@/components/gamification/RivalCallout";

export default function Leaderboard() {
  const { leaderboard } = useGamificationStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leaderboards"
        description="See where you stand — your weekly XP, your batch, and skill-specific rankings."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <SeasonBanner />
        <RivalCallout />
      </div>


      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Weekly XP</TabsTrigger>
          <TabsTrigger value="batch">My Batch</TabsTrigger>
          <TabsTrigger value="streaks">Streak Leaders</TabsTrigger>
          <TabsTrigger value="kubernetes">Kubernetes Track</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-4">
          <Board entries={leaderboard.weekly} unit="XP this week" />
        </TabsContent>
        <TabsContent value="batch" className="mt-4">
          <Board entries={leaderboard.batch} unit="XP this week" />
        </TabsContent>
        <TabsContent value="streaks" className="mt-4">
          <Board entries={leaderboard.streaks} unit="days" streakMode />
        </TabsContent>
        <TabsContent value="kubernetes" className="mt-4">
          <Board entries={leaderboard.kubernetes} unit="Kubernetes XP" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Board({ entries, unit, streakMode }: { entries: LeaderboardEntry[]; unit: string; streakMode?: boolean }) {
  return (
    <Card>
      <CardContent className="p-2">
        {entries.map((e, i) => (
          <div
            key={e.rank + e.handle}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
              e.you ? "bg-primary/[0.06] border border-primary/20" : "hover:bg-muted/40"
            } ${i !== entries.length - 1 ? "mb-1" : ""}`}
          >
            <div className="w-8 flex items-center justify-center">
              {e.rank === 1 ? (
                <Crown className="h-4 w-4 text-yellow-500" />
              ) : (
                <span className="text-sm font-semibold tabular-nums text-muted-foreground">#{e.rank}</span>
              )}
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {e.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{e.name}</p>
                {e.you && <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-primary/30 text-primary">You</Badge>}
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {streakMode ? e.identity : `Lvl ${e.level} · ${e.identity}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums inline-flex items-center gap-1">
                {streakMode && <Flame className="h-3.5 w-3.5 text-warning" />}
                {e.xp.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">{unit}</p>
            </div>
            <div className="w-12 flex justify-end">
              {e.delta > 0 ? (
                <span className="text-[11px] font-medium text-success inline-flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />{e.delta}</span>
              ) : e.delta < 0 ? (
                <span className="text-[11px] font-medium text-destructive inline-flex items-center gap-0.5"><TrendingDown className="h-3 w-3" />{Math.abs(e.delta)}</span>
              ) : (
                <span className="text-[11px] text-muted-foreground inline-flex items-center gap-0.5"><Minus className="h-3 w-3" />0</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
