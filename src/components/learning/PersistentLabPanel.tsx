import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Infinity as InfinityIcon, ShieldCheck, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Props {
  templateName: string;
  status?: "provisioning" | "ready" | "suspended";
  validUntil?: string; // ISO
}

export function PersistentLabPanel({ templateName, status = "ready", validUntil }: Props) {
  const dateLabel = validUntil
    ? new Date(validUntil).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  return (
    <Card className="border-emerald-500/30 bg-emerald-500/5">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="text-[10px] bg-emerald-500/15 text-emerald-700 border-0 gap-1"><InfinityIcon className="h-2.5 w-2.5" /> Persistent</Badge>
              <span className="text-sm font-semibold">{templateName}</span>
              {status === "ready" && <StatusBadge status="success" label="Running" />}
              {status === "suspended" && <StatusBadge status="warning" label="Suspended" />}
              {status === "provisioning" && <StatusBadge status="default" label="Provisioning" />}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-3">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Your state is preserved</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Available until {dateLabel}</span>
            </p>
          </div>
          <Button className="gap-1.5"><ExternalLink className="h-4 w-4" /> Open my lab</Button>
        </div>
      </CardContent>
    </Card>
  );
}
