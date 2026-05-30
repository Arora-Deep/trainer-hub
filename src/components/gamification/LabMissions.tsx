import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Zap, Clock, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { difficultyStyle } from "@/stores/gamificationStore";

type LabMission = {
  name: string;
  brief: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  xp: number;
  estimated: string;
  skills: string[];
  status: "Running" | "Paused" | "Stopped";
};

const labMissions: LabMission[] = [
  {
    name: "Kubernetes Cluster Deployment",
    brief: "Stand up a 3-node cluster, deploy a stateful workload, validate failover.",
    difficulty: "Intermediate",
    xp: 1000,
    estimated: "45 min",
    skills: ["Kubernetes", "Linux", "Infrastructure"],
    status: "Running",
  },
  {
    name: "Linux Process Forensics",
    brief: "Identify a rogue process, trace its syscalls, contain it without reboot.",
    difficulty: "Beginner",
    xp: 450,
    estimated: "25 min",
    skills: ["Linux", "Security"],
    status: "Paused",
  },
  {
    name: "Docker Networking Deep Dive",
    brief: "Wire three services across overlay networks, debug a DNS misconfig.",
    difficulty: "Advanced",
    xp: 1400,
    estimated: "1h 10m",
    skills: ["Docker", "Networking"],
    status: "Stopped",
  },
];

export function LabMissions() {
  const navigate = useNavigate();

  return (
    <Card className="sp-card overflow-hidden">
      <CardContent className="p-0">
        {labMissions.map((l, i) => (
          <div
            key={l.name}
            className={`group p-4 hover:bg-muted/30 transition-colors ${
              i !== labMissions.length - 1 ? "border-b border-border/60" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Status dot */}
              <div className="pt-1 shrink-0">
                <span
                  className={`block h-2 w-2 rounded-full ${
                    l.status === "Running"
                      ? "bg-success"
                      : l.status === "Paused"
                      ? "bg-warning"
                      : "bg-muted-foreground/40"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold truncate">{l.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{l.brief}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate("/student/labs")}
                    className="gap-1 shrink-0"
                  >
                    <Play className="h-3 w-3" />
                    {l.status === "Running" ? "Open" : "Resume"}
                  </Button>
                </div>

                {/* Meta strip */}
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Cpu className="h-3 w-3" /> {l.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Zap className="h-3 w-3" /> +{l.xp.toLocaleString()} XP
                  </span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Clock className="h-3 w-3" /> {l.estimated}
                  </span>
                  <span className="text-muted-foreground/70">{l.skills.join(" · ")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
