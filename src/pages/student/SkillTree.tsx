import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGamificationStore, skillColor, type SkillKey, type SkillNode } from "@/stores/gamificationStore";
import { Lock, CheckCircle2, Circle, Loader2, Cloud, Terminal, Boxes, Shield, Network, Workflow, Brain, Code, Server, GitBranch } from "lucide-react";
import { StudentPageHero } from "@/components/gamification/StudentPageHero";

const skillIcons: Record<SkillKey, typeof Cloud> = {
  cloud: Cloud, linux: Terminal, kubernetes: Boxes, security: Shield,
  networking: Network, devops: Workflow, ai: Brain, python: Code, infra: Server,
};

const statusMap = {
  mastered: { Icon: CheckCircle2, className: "text-success", label: "Mastered" },
  in_progress: { Icon: Loader2, className: "text-primary", label: "In progress" },
  available: { Icon: Circle, className: "text-muted-foreground", label: "Available" },
  locked: { Icon: Lock, className: "text-muted-foreground/60", label: "Locked" },
} as const;

export default function SkillTree() {
  const { skillTracks } = useGamificationStore();

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="violet"
        eyebrow="Skill Tree"
        icon={GitBranch}
        title={<>Unlock your <span className="text-white/95">tech tree</span>.</>}
        description="Visual mastery paths across the technical tracks you're building."
      />


      <div className="space-y-6">
        {skillTracks.map((track) => {
          const Icon = skillIcons[track.key];
          return (
            <Card key={track.key}>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${skillColor[track.key]}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: skillColor[track.key] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold">{track.name}</h3>
                        <p className="text-xs text-muted-foreground">{track.tagline}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">{track.mastery}% mastered</Badge>
                    </div>
                    <Progress value={track.mastery} className="h-1.5 mt-3" />
                  </div>
                </div>

                <div className="pl-2 border-l-2 border-dashed border-border space-y-2.5">
                  {track.nodes.map((node, i) => (
                    <Node key={node.id} node={node} accent={skillColor[track.key]} last={i === track.nodes.length - 1} />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Node({ node, accent, depth = 0 }: { node: SkillNode; accent: string; depth?: number; last?: boolean }) {
  const s = statusMap[node.status];
  const isProgress = node.status === "in_progress";
  return (
    <div className="space-y-2">
      <div
        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
          node.status === "locked"
            ? "border-border bg-muted/20 opacity-70"
            : node.status === "in_progress"
              ? "border-primary/30 bg-primary/[0.04]"
              : "border-border hover:bg-muted/40"
        }`}
        style={{ marginLeft: depth * 16 }}
      >
        <span className={`h-7 w-7 rounded-full border flex items-center justify-center ${s.className}`}
              style={node.status === "mastered" ? { borderColor: accent, color: accent } : {}}>
          <s.Icon className={`h-3.5 w-3.5 ${isProgress ? "animate-spin" : ""}`} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{node.name}</p>
          <p className="text-[11px] text-muted-foreground">{s.label} · {node.xp} XP</p>
        </div>
      </div>
      {node.children && (
        <div className="pl-6 border-l border-dashed border-border space-y-2">
          {node.children.map((child) => (
            <Node key={child.id} node={child} accent={accent} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
