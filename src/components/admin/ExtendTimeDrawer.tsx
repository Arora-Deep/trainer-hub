import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useAuditStore } from "@/stores/auditStore";
import { Clock } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  targetLabel: string;
  scope: "vm" | "batch" | "session" | "template";
  onConfirm: (hours: number, reason: string) => void;
}

const PRESETS = [1, 2, 4, 8];

export function ExtendTimeDrawer({ open, onOpenChange, targetLabel, scope, onConfirm }: Props) {
  const [hours, setHours] = useState<number>(2);
  const [reason, setReason] = useState("");
  const [notify, setNotify] = useState(true);
  const log = useAuditStore((s) => s.log);

  const handle = () => {
    if (!reason.trim()) {
      toast({ title: "Reason required", description: "Please provide a reason for the extension.", variant: "destructive" });
      return;
    }
    onConfirm(hours, reason);
    log({
      action: `extend_time:${scope}`,
      target: targetLabel,
      reason,
      meta: { hours, notify },
    });
    toast({ title: "Time extended", description: `${hours}h added to ${targetLabel}.` });
    setReason("");
    setHours(2);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:max-w-[420px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Clock className="h-4 w-4" /> Extend VM Time</SheetTitle>
          <SheetDescription className="text-xs">
            Scope: <span className="font-medium capitalize">{scope}</span> · {targetLabel}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-xs">Hours to add</Label>
            <div className="flex gap-2 mt-1.5 flex-wrap">
              {PRESETS.map((p) => (
                <Button key={p} type="button" size="sm" variant={hours === p ? "default" : "outline"} className="text-xs" onClick={() => setHours(p)}>
                  +{p}h
                </Button>
              ))}
              <Input type="number" min={1} max={72} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="h-8 w-20 text-xs" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Reason <span className="text-destructive">*</span></Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. learner needs more time to complete lab" rows={3} className="mt-1.5 text-xs" />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-xs font-medium">Notify trainer & learner</p>
              <p className="text-[10px] text-muted-foreground">Email + in-app notification</p>
            </div>
            <Switch checked={notify} onCheckedChange={setNotify} />
          </div>
          <div className="rounded-md bg-muted/40 p-3 text-[11px] text-muted-foreground">
            This action will be recorded in the audit log with your identity and reason.
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={handle}>Extend by {hours}h</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
