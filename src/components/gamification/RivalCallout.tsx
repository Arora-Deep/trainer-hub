import { Card, CardContent } from "@/components/ui/card";
import { Swords, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGamificationStore } from "@/stores/gamificationStore";
import { useNavigate } from "react-router-dom";

export function RivalCallout() {
  const { rival } = useGamificationStore();
  const navigate = useNavigate();
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4 h-full">
        <div className="h-10 w-10 rounded-xl border border-border bg-muted/40 flex items-center justify-center shrink-0">
          <Swords className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Rival</div>
          <p className="mt-1 text-sm font-medium truncate">
            <span className="tabular-nums">{rival.xpAhead}</span> XP behind {rival.name}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            Lvl {rival.level} · {rival.identity}
          </p>
        </div>
        <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 text-muted-foreground" onClick={() => navigate("/student/challenges")}>
          Catch up <ArrowRight className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
