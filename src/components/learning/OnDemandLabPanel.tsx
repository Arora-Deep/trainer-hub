import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play, Square, ExternalLink, Timer, Cpu, Wifi, AlertCircle,
  Power, PowerOff, Camera, RotateCcw, History,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Status = "idle" | "provisioning" | "ready" | "stopped" | "suspended";

interface Snapshot { id: string; name: string; createdAt: string }

interface Props {
  templateName: string;
  estimatedHours?: number;
  walletRemaining: number | null;
  onConsumeHours?: (hours: number) => boolean;
}

export function OnDemandLabPanel({ templateName, estimatedHours, walletRemaining, onConsumeHours }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [elapsedSec, setElapsedSec] = useState(0);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  useEffect(() => {
    if (status !== "ready") return;
    const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  const launch = () => {
    if (walletRemaining !== null && walletRemaining <= 0) {
      toast.error("Out of lab hours. Top up to launch.");
      return;
    }
    setStatus("provisioning");
    toast.message("Provisioning your VM…");
    setTimeout(() => {
      setStatus("ready");
      toast.success("Lab ready — console open below.");
    }, 1800);
  };

  const stopAndSave = () => {
    const hours = Math.max(0.1, Math.round((elapsedSec / 3600) * 10) / 10);
    if (onConsumeHours) onConsumeHours(hours);
    setStatus("suspended");
    setElapsedSec(0);
    toast.message(`Lab suspended · ${hours}h consumed · state saved.`);
  };

  const shutdown = () => {
    const hours = Math.max(0.1, Math.round((elapsedSec / 3600) * 10) / 10);
    if (onConsumeHours) onConsumeHours(hours);
    setStatus("stopped");
    setElapsedSec(0);
    toast.message(`VM shut down · ${hours}h consumed.`);
  };

  const start = () => {
    setStatus("provisioning");
    toast.message("Starting VM…");
    setTimeout(() => { setStatus("ready"); toast.success("VM is back online."); }, 1200);
  };

  const takeSnapshot = () => {
    const snap: Snapshot = {
      id: `snap-${Date.now()}`,
      name: `Snapshot ${snapshots.length + 1}`,
      createdAt: new Date().toLocaleString(),
    };
    setSnapshots((s) => [snap, ...s]);
    toast.success(`Snapshot taken — "${snap.name}"`);
  };

  const restore = (snap: Snapshot) => {
    toast.success(`Restoring "${snap.name}"…`);
    setStatus("provisioning");
    setTimeout(() => { setStatus("ready"); toast.success(`Restored to "${snap.name}".`); }, 1500);
  };

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const isRunning = status === "ready";
  const isStopped = status === "stopped" || status === "suspended";

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="text-[10px] bg-amber-500/15 text-amber-700 border-0">On-demand</Badge>
              <span className="text-sm font-semibold">{templateName}</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-3">
              {estimatedHours && <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> ~{estimatedHours}h estimated</span>}
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                {walletRemaining === null ? "Unlimited within validity" : `${walletRemaining.toFixed(1)}h wallet left`}
              </span>
            </p>
          </div>
          {status === "idle" ? (
            <Button onClick={launch} className="gap-1.5"><Play className="h-4 w-4" /> Launch lab</Button>
          ) : status === "provisioning" ? (
            <Button disabled className="gap-1.5">
              <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" /> Provisioning…
            </Button>
          ) : null}
        </div>

        {/* Action bar — visible once VM has been launched */}
        {(isRunning || isStopped) && (
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg border border-border bg-background/60">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              disabled={!isRunning}
              onClick={() => toast.success("Opening console…")}
              asChild={isRunning}
            >
              {isRunning ? (
                <a href="#console"><ExternalLink className="h-3.5 w-3.5" /> Open console</a>
              ) : (
                <span><ExternalLink className="h-3.5 w-3.5" /> Open console</span>
              )}
            </Button>

            <Button size="sm" variant="outline" className="gap-1.5" disabled={!isRunning} onClick={stopAndSave}>
              <Square className="h-3.5 w-3.5" /> Stop &amp; save
            </Button>

            {isRunning ? (
              <Button size="sm" variant="outline" className="gap-1.5" onClick={shutdown}>
                <PowerOff className="h-3.5 w-3.5" /> Shutdown
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="gap-1.5" onClick={start}>
                <Power className="h-3.5 w-3.5" /> Start
              </Button>
            )}

            <Button size="sm" variant="outline" className="gap-1.5" disabled={!isRunning} onClick={takeSnapshot}>
              <Camera className="h-3.5 w-3.5" /> Snapshot
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <History className="h-3.5 w-3.5" /> Restore
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Snapshots
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {snapshots.length === 0 ? (
                  <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                    No snapshots yet — take one first.
                  </div>
                ) : (
                  snapshots.map((s) => (
                    <DropdownMenuItem key={s.id} onClick={() => restore(s)} className="flex flex-col items-start gap-0.5">
                      <span className="text-sm font-medium flex items-center gap-1.5">
                        <RotateCcw className="h-3 w-3" /> {s.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{s.createdAt}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {(isRunning || isStopped) && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <Mini
              label="Status"
              value={
                isRunning ? <StatusBadge status="success" label="Running" />
                : status === "suspended" ? <Badge className="bg-amber-500/15 text-amber-700 border-0 text-[10px]">Suspended</Badge>
                : <Badge variant="outline" className="text-[10px]">Stopped</Badge>
              }
            />
            <Mini label="Session" value={<span className="font-mono text-sm">{fmt(elapsedSec)}</span>} />
            <Mini
              label="Network"
              value={
                <span className="text-xs flex items-center justify-center gap-1">
                  <Wifi className={`h-3 w-3 ${isRunning ? "text-success" : "text-muted-foreground"}`} />
                  {isRunning ? "Connected" : "Offline"}
                </span>
              }
            />
          </div>
        )}

        {isRunning && walletRemaining !== null && walletRemaining < 1 && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-500/10 rounded-md p-2">
            <AlertCircle className="h-3.5 w-3.5" /> Less than 1 hour of lab wallet left. Idle VMs auto-suspend after 10 min.
          </div>
        )}

        {snapshots.length > 0 && (
          <p className="text-[10px] text-muted-foreground">
            {snapshots.length} snapshot{snapshots.length === 1 ? "" : "s"} saved · restore anytime to roll back changes.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-2 rounded-md bg-background/60 border border-border/60">
      <div>{value}</div>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
