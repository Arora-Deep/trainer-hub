import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGamificationStore, type BatchLeaderboardEntry } from "@/stores/gamificationStore";
import { Crown, Trophy } from "lucide-react";
import { StudentPageHero } from "@/components/gamification/StudentPageHero";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Leaderboard() {
  const { profile, getBatchLeaderboard } = useGamificationStore();
  const batches = profile.enrolledBatches;

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="magenta"
        eyebrow="Batch Leaderboard"
        icon={Trophy}
        title={<>Where you stand in <span className="text-white/95">your batch</span>.</>}
        description="Ranking inside your own cohort — no global ladders. Climb by shipping work, scoring on assessments, and finishing modules."
      />

      <Tabs defaultValue={batches[0]?.id}>
        <TabsList className="flex-wrap h-auto">
          {batches.map((b) => (
            <TabsTrigger key={b.id} value={b.id}>{b.name}</TabsTrigger>
          ))}
        </TabsList>

        {batches.map((b) => (
          <TabsContent key={b.id} value={b.id} className="mt-4">
            <Board entries={getBatchLeaderboard(b.id)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function Board({ entries }: { entries: BatchLeaderboardEntry[] }) {
  return (
    <Card>
      <CardContent className="p-2">
        <div className="px-3 py-2 grid grid-cols-[40px_1fr_auto] gap-4 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
          <span>Rank</span>
          <span>Student</span>
          <span className="text-right">Score</span>
        </div>
        <TooltipProvider delayDuration={150}>
          {entries.map((e, i) => (
            <Tooltip key={e.handle}>
              <TooltipTrigger asChild>
                <div
                  className={`grid grid-cols-[40px_1fr_auto] items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                    e.you ? "bg-primary/[0.06] border border-primary/20" : "hover:bg-muted/40"
                  } ${i !== entries.length - 1 ? "mb-1" : ""}`}
                >
                  <div className="flex items-center justify-center">
                    {e.rank === 1 ? (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <span className="text-sm font-semibold tabular-nums text-muted-foreground">#{e.rank}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {e.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{e.name}</p>
                        {e.you && <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-primary/30 text-primary">You</Badge>}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">@{e.handle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold tabular-nums">{e.score}</p>
                    <p className="text-[10px] text-muted-foreground">composite</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs">
                <div className="space-y-1">
                  <Row label="Completion" value={`${e.completionPct}%`} />
                  <Row label="Avg score" value={`${e.avgScore}%`} />
                  <Row label="Labs shipped" value={`${e.labsShipped}`} />
                  <div className="pt-1 mt-1 border-t border-border/30 text-[10px] text-muted-foreground">
                    50% completion · 35% score · 15% labs
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 tabular-nums">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
