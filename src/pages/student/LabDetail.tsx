import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { getStudentLab } from "@/data/studentMockData";
import { toast } from "sonner";
import {
  ArrowLeft, Monitor, Power, RotateCcw, Snowflake, Camera,
  Play, Square, HistoryIcon,
} from "lucide-react";

export default function StudentLabDetail() {
  const { id = "" } = useParams();
  const lab = getStudentLab(id);
  const nav = useNavigate();

  if (!lab) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => nav(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Lab not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "My Labs", href: "/student/labs" }, { label: lab.name }]}
        title={lab.name}
        description={`${lab.template} · ${lab.batch}`}
        actions={
          <Badge
            className={
              lab.status === "running"
                ? "bg-success/10 text-success border-0"
                : "bg-muted text-muted-foreground border-0"
            }
          >
            {lab.status === "running" && "● "}
            {lab.status}
          </Badge>
        }
      />

      {/* Console */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-foreground/95 aspect-video flex items-center justify-center text-success/70 font-mono text-xs relative">
            {lab.status === "running" ? (
              <div className="absolute inset-0 p-4 overflow-hidden">
                <p className="text-success/40 text-[10px]">
                  Connected to {lab.ip} as {lab.username}
                </p>
                {lab.lastCommands.map((c, i) => (
                  <div key={i} className="text-success">{c}</div>
                ))}
                <div className="mt-2 inline-flex items-center">
                  <span className="text-success">$</span>
                  <span className="ml-1 w-2 h-3 bg-success animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Monitor className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Console offline — start the lab to connect</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* VM Controls */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold mb-3">VM Controls</h3>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Start queued")}>
              <Play className="h-3.5 w-3.5" /> Start
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Stop queued")}>
              <Square className="h-3.5 w-3.5" /> Stop
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Restart queued")}>
              <RotateCcw className="h-3.5 w-3.5" /> Restart
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Reset queued")}>
              <Snowflake className="h-3.5 w-3.5" /> Reset
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Power off queued")}>
              <Power className="h-3.5 w-3.5" /> Power Off
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Restore requested")}>
              <HistoryIcon className="h-3.5 w-3.5" /> Restore Snapshot
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Snapshots */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h3 className="text-sm font-semibold">Snapshots</h3>
          {lab.snapshots.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">No snapshots yet</p>
          )}
          {lab.snapshots.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.createdAt} · {s.size}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success(`Restoring ${s.name}`)}>
                Restore
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" className="w-full gap-1.5">
            <Camera className="h-3.5 w-3.5" /> Take new snapshot
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
