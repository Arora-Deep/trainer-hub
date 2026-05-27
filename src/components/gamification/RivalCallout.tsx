import { Card, CardContent } from "@/components/ui/card";
import { Swords, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGamificationStore } from "@/stores/gamificationStore";
import { useNavigate } from "react-router-dom";

export function RivalCallout() {
  const { rival } = useGamificationStore();
  const navigate = useNavigate();
  return (
    <Card className="border-primary/15">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Swords className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">
            {rival.xpAhead} XP behind <span className="text-primary">{rival.name}</span>
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            Lvl {rival.level} · {rival.identity} · close it before week's end
          </p>
        </div>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => navigate("/student/challenges")}>
          <TrendingUp className="h-3 w-3" /> Catch up
        </Button>
      </CardContent>
    </Card>
  );
}
