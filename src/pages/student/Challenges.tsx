import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGamificationStore, difficultyStyle, skillColor, type SkillKey } from "@/stores/gamificationStore";
import { Filter, Users, Clock, Cloud, Terminal, Boxes, Shield, Network, Workflow, Brain, Code, Server, Play, CheckCircle2 } from "lucide-react";

const skillIcons: Record<SkillKey, typeof Cloud> = {
  cloud: Cloud, linux: Terminal, kubernetes: Boxes, security: Shield,
  networking: Network, devops: Workflow, ai: Brain, python: Code, infra: Server,
};

export default function Challenges() {
  const { dailyMissions, weeklyMissions, challenges } = useGamificationStore();
  const [filter, setFilter] = useState<"all" | "available" | "in_progress" | "completed">("all");
  const filtered = challenges.filter((c) => (filter === "all" ? true : c.status === filter));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Challenges & Missions"
        description="Push your edge. Real technical scenarios that prove your skill."
      />

      <Tabs defaultValue="missions">
        <TabsList>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="mt-4 space-y-6">
          <MissionsSection title="Daily missions" subtitle="Resets every 24h" missions={dailyMissions} />
          <MissionsSection title="Weekly missions" subtitle="Resets Sunday at midnight" missions={weeklyMissions} />
        </TabsContent>

        <TabsContent value="challenges" className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {(["all", "available", "in_progress", "completed"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className="h-7 text-xs capitalize"
              >
                {f.replace("_", " ")}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((c) => {
              const Icon = skillIcons[c.category];
              return (
                <Card key={c.id}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${skillColor[c.category]}20` }}
                        >
                          <Icon className="h-4 w-4" style={{ color: skillColor[c.category] }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{c.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{c.brief}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${difficultyStyle[c.difficulty]}`}>
                        {c.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
                        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.participants}</span>
                        <span className="font-semibold text-primary">+{c.xp} XP</span>
                      </div>
                      {c.status === "completed" ? (
                        <Badge variant="outline" className="text-[10px] text-success border-success/30 bg-success/10 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </Badge>
                      ) : c.status === "in_progress" ? (
                        <Button size="sm" variant="secondary" className="h-7 text-xs">Resume</Button>
                      ) : (
                        <Button size="sm" className="h-7 text-xs gap-1"><Play className="h-3 w-3" /> Start</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MissionsSection({ title, subtitle, missions }: { title: string; subtitle: string; missions: ReturnType<typeof useGamificationStore.getState>["dailyMissions"] }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <Badge variant="outline" className="text-[10px]">
          {missions.filter(m => m.progress >= m.target).length} / {missions.length} done
        </Badge>
      </div>
      <Card>
        <CardContent className="p-2">
          {missions.map((m, i) => {
            const pct = Math.min(100, Math.round((m.progress / m.target) * 100));
            const done = m.progress >= m.target;
            return (
              <div
                key={m.id}
                className={`flex items-center gap-4 p-3 ${i !== missions.length - 1 ? "border-b border-border/50" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${done ? "text-muted-foreground line-through" : ""}`}>{m.title}</p>
                  <p className="text-[11px] text-muted-foreground">{m.detail}</p>
                </div>
                <div className="w-40">
                  <Progress value={pct} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground text-right mt-0.5 tabular-nums">{m.progress} / {m.target}</p>
                </div>
                <span className="text-sm font-semibold text-primary tabular-nums w-16 text-right">+{m.xp} XP</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
