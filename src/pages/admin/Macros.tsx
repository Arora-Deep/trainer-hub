import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";

const macros = [
  { name: "Lab Not Starting", actions: "Collect logs → Retry provision → Notify tenant", trigger: "Manual", usedCount: 45 },
  { name: "Reset Student Credentials", actions: "Reset password → Send email → Log audit", trigger: "Manual", usedCount: 120 },
  { name: "Extend Lab Duration", actions: "Extend by 2h → Notify student → Log", trigger: "Manual", usedCount: 89 },
  { name: "Replace Broken VM", actions: "Snapshot → Destroy → Re-provision → Restore data", trigger: "Manual", usedCount: 23 },
  { name: "Quick Diagnosis", actions: "Check node health → Check network → Check storage → Report", trigger: "Automated", usedCount: 210 },
];

export default function Macros() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Macros</h1><p className="text-muted-foreground text-sm mt-1">Saved action bundles</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Macro</Button>
      </div>
      <div className="space-y-3">
        {macros.map((m, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.actions}</p>
                <div className="flex gap-2 mt-1.5">
                  <Badge variant="secondary" className="text-[9px]">{m.trigger}</Badge>
                  <span className="text-[10px] text-muted-foreground">Used {m.usedCount} times</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Play className="h-3 w-3" /> Run</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
