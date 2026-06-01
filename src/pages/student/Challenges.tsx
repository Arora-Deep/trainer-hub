import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGamificationStore, difficultyStyle, skillColor, challengeProgress, type Challenge, type SkillKey } from "@/stores/gamificationStore";
import { Cloud, Terminal, Boxes, Shield, Network, Workflow, Brain, Code, Server, Play, CheckCircle2, Swords, Gift, Clock, Users, Layers, ArrowRight, Target } from "lucide-react";
import { StudentPageHero } from "@/components/gamification/StudentPageHero";
import { useNavigate } from "react-router-dom";

const skillIcons: Record<SkillKey, typeof Cloud> = {
  cloud: Cloud, linux: Terminal, kubernetes: Boxes, security: Shield,
  networking: Network, devops: Workflow, ai: Brain, python: Code, infra: Server,
};

export default function Challenges() {
  const { challenges } = useGamificationStore();
  const [tab, setTab] = useState<"active" | "completed">("active");

  const active = challenges.filter((c) => c.status !== "completed");
  const completed = challenges.filter((c) => c.status === "completed");

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="magenta"
        eyebrow="Challenges"
        icon={Swords}
        title={<>Real scenarios. <span className="text-white/95">Real proof.</span></>}
        description="Hands-on technical challenges — one-off sprints and multi-step storylines. Finish, ship the reward."
        stats={[
          { icon: Target, label: "In progress", value: challenges.filter((c) => c.status === "in_progress").length },
          { icon: CheckCircle2, label: "Cleared", value: completed.length },
        ]}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((c) => <ChallengeCard key={c.id} c={c} />)}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardContent className="p-2">
              {completed.length === 0 && (
                <div className="p-6 text-sm text-muted-foreground text-center">No challenges completed yet.</div>
              )}
              {completed.map((c, i) => {
                const Icon = skillIcons[c.category];
                return (
                  <div key={c.id} className={`p-3 flex items-center gap-3 ${i !== completed.length - 1 ? "border-b border-border/50" : ""}`}>
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${skillColor[c.category]}20` }}>
                      <Icon className="h-4 w-4" style={{ color: skillColor[c.category] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-[11px] text-muted-foreground">{c.difficulty} · {c.reward ?? "Cleared"}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-success border-success/30 bg-success/10 gap-1 shrink-0">
                      <CheckCircle2 className="h-3 w-3" /> {c.completedAt ?? "Done"}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChallengeCard({ c }: { c: Challenge }) {
  const Icon = skillIcons[c.category];
  const navigate = useNavigate();
  const hasSteps = !!c.steps?.length;
  const cp = challengeProgress(c);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${skillColor[c.category]}20` }}>
              <Icon className="h-4 w-4" style={{ color: skillColor[c.category] }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold">{c.title}</p>
                {hasSteps && <Badge variant="outline" className="text-[9px] gap-1"><Layers className="h-2.5 w-2.5" /> {c.steps!.length} steps</Badge>}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{c.brief}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-[10px] shrink-0 ${difficultyStyle[c.difficulty]}`}>
            {c.difficulty}
          </Badge>
        </div>

        {hasSteps && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{cp.done} / {cp.total} steps</span>
              <span className="tabular-nums">{cp.pct}%</span>
            </div>
            <Progress value={cp.pct} className="h-1.5" />
          </div>
        )}

        {c.reward && (
          <div className="flex items-center gap-2 text-[11px] rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5">
            <Gift className="h-3 w-3 text-amber-600" />
            <span className="text-amber-700 dark:text-amber-400 font-medium">Reward · {c.reward}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.participants}</span>
          </div>
          {c.status === "in_progress" ? (
            <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => navigate("/student/labs")}>
              Resume <ArrowRight className="h-3 w-3" />
            </Button>
          ) : (
            <Button size="sm" className="h-7 text-xs gap-1" onClick={() => navigate("/student/labs")}>
              <Play className="h-3 w-3" /> Start
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
