import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuestStore, questProgress, type Quest } from "@/stores/questStore";
import { skillColor, difficultyStyle, type SkillKey } from "@/stores/gamificationStore";
import { QuestTimeline } from "@/components/gamification/QuestTimeline";
import { useState } from "react";
import {
  Cloud, Terminal, Boxes, Shield, Network, Workflow, Brain, Code, Server,
  Sparkles, Lock, Trophy, ArrowRight,
} from "lucide-react";

const skillIcons: Record<SkillKey, typeof Cloud> = {
  cloud: Cloud, linux: Terminal, kubernetes: Boxes, security: Shield,
  networking: Network, devops: Workflow, ai: Brain, python: Code, infra: Server,
};

export default function Quests() {
  const { quests } = useQuestStore();
  const inProgress = quests.find(q => q.status === "in_progress") ?? quests[0];
  const [activeId, setActiveId] = useState(inProgress.id);
  const active = quests.find(q => q.id === activeId)!;
  const p = questProgress(active);
  const Icon = skillIcons[active.skill];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quests"
        description="Multi-step storylines that chain real labs, lessons, and challenges into proof-of-skill."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Quest list */}
        <div className="space-y-2">
          {quests.map((q) => {
            const QIcon = skillIcons[q.skill];
            const qp = questProgress(q);
            const locked = q.status === "locked";
            const isActive = q.id === activeId;
            return (
              <button
                key={q.id}
                onClick={() => !locked && setActiveId(q.id)}
                disabled={locked}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isActive ? "border-primary/30 bg-primary/[0.04] shadow-sm" : locked ? "border-border opacity-60 cursor-not-allowed" : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                       style={{ backgroundColor: `${skillColor[q.skill]}20` }}>
                    {locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : <QIcon className="h-3.5 w-3.5" style={{ color: skillColor[q.skill] }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{q.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{q.tagline}</p>
                    {!locked && (
                      <div className="mt-2 space-y-1">
                        <div className="h-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary transition-all" style={{ width: `${qp.pct}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground tabular-nums">{qp.done}/{qp.total} steps</p>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quest detail */}
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0"
                   style={{ backgroundColor: `${skillColor[active.skill]}20` }}>
                <Icon className="h-6 w-6" style={{ color: skillColor[active.skill] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-semibold tracking-tight">{active.title}</h2>
                  <Badge variant="outline" className={`text-[10px] ${difficultyStyle[active.difficulty]}`}>{active.difficulty}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{active.tagline}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
              {active.story}
            </p>

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Progress" value={`${p.pct}%`} sub={`${p.done}/${p.total} steps`} />
              <Stat label="Total XP" value={active.totalXp.toLocaleString()} sub="across all steps" />
              <Stat label="Reward" value={active.rewardTitle} sub="title equipped on win" icon={<Trophy className="h-3 w-3 text-warning" />} />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Quest steps
              </h3>
              <QuestTimeline quest={active} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}{label}
      </div>
      <div className="mt-1 text-base font-semibold tabular-nums leading-tight">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
