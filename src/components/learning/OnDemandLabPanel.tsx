import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, ExternalLink, Timer, Cpu, Wifi, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { toast } from "sonner";

type Status = "idle" | "provisioning" | "ready" | "suspended";

interface Props {
  templateName: string;
  estimatedHours?: number;
  walletRemaining: number | null; // null = unlimited
  onConsumeHours?: (hours: number) => boolean;
}

export function OnDemandLabPanel({ templateName, estimatedHours, walletRemaining, onConsumeHours }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [elapsedSec, setElapsedSec] = useState(0);

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

  const stop = () => {
    const hours = Math.max(0.1, Math.round((elapsedSec / 3600) * 10) / 10);
    if (onConsumeHours) onConsumeHours(hours);
    setStatus("suspended");
    setElapsedSec(0);
    toast.message(`Lab suspended · ${hours}h consumed.`);
  };

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

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
          {status === "idle" || status === "suspended" ? (
            <Button onClick={launch} className="gap-1.5"><Play className="h-4 w-4" /> Launch lab</Button>
          ) : status === "provisioning" ? (
            <Button disabled className="gap-1.5"><span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" /> Provisioning…</Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> Open console</Button>
              <Button variant="outline" size="sm" onClick={stop} className="gap-1.5"><Square className="h-3.5 w-3.5" /> Stop & save</Button>
            </div>
          )}
        </div>

        {status === "ready" && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <Mini label="Status" value={<StatusBadge status="success" label="Running" />} />
            <Mini label="Session" value={<span className="font-mono text-sm">{fmt(elapsedSec)}</span>} />
            <Mini label="Network" value={<span className="text-xs flex items-center justify-center gap-1"><Wifi className="h-3 w-3 text-success" /> Connected</span>} />
          </div>
        )}

        {status === "ready" && walletRemaining !== null && walletRemaining < 1 && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-500/10 rounded-md p-2">
            <AlertCircle className="h-3.5 w-3.5" /> Less than 1 hour of lab wallet left. Idle VMs auto-suspend after 10 min.
          </div>
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
