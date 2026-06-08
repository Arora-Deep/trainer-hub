import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Gamepad2, Play, Trophy, Maximize2, Crown, Medal, Clock, Sparkles, RotateCcw, ExternalLink } from "lucide-react";
import { getLeaderboardForLesson, formatLeaderboardTime } from "@/data/gameLeaderboards";

interface Props {
  lessonId: string;
  title: string;
  gameType?: "escape-room" | "hangman";
  gameUrl?: string;
  description?: string;
}

const typeMeta: Record<string, { label: string; tone: string; tagline: string }> = {
  "escape-room": {
    label: "Escape Room",
    tone: "bg-violet-500/10 text-violet-600",
    tagline: "Scenario-based · Answer correctly to unlock clues and escape",
  },
  hangman: {
    label: "Hangman",
    tone: "bg-amber-500/10 text-amber-600",
    tagline: "Guess the word · Six wrong letters and it's game over",
  },
};

export function GameLessonPanel({ lessonId, title, gameType, gameUrl, description }: Props) {
  const [launched, setLaunched] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const leaderboard = getLeaderboardForLesson(lessonId);
  const meta = gameType ? typeMeta[gameType] : null;
  const isPlaceholder = !gameUrl || gameUrl.trim() === "";

  const openInNewTab = () => {
    if (gameUrl) window.open(gameUrl, "_blank", "noopener,noreferrer");
  };

  const requestFullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  return (
    <div className="space-y-4">
      {/* Game stage */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                {meta && (
                  <div className="mt-1 flex items-center gap-2">
                    <Badge className={`text-[10px] border-0 ${meta.tone}`}>{meta.label}</Badge>
                    <span className="text-xs text-muted-foreground">{meta.tagline}</span>
                  </div>
                )}
              </div>
            </div>
            {launched && !isPlaceholder && (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setLaunched(false)}>
                  <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
                <Button size="sm" variant="outline" onClick={requestFullscreen}>
                  <Maximize2 className="h-3.5 w-3.5 mr-1" /> Fullscreen
                </Button>
                <Button size="sm" variant="outline" onClick={openInNewTab}>
                  <ExternalLink className="h-3.5 w-3.5 mr-1" /> New tab
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!launched ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-16 text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-violet-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Ready to play?</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  {description || "Launch the game in an immersive view. Your best score will be added to the batch leaderboard."}
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setLaunched(true)}
                disabled={isPlaceholder}
                className="gap-2"
              >
                <Play className="h-4 w-4" /> Launch Game
              </Button>
              {isPlaceholder && (
                <p className="text-[11px] text-muted-foreground">
                  Game URL hasn't been set up yet. Your trainer will share the link soon.
                </p>
              )}
            </div>
          ) : (
            <div
              ref={stageRef}
              className="rounded-xl overflow-hidden border border-border bg-black/5 w-full"
              style={{ height: "min(80vh, 900px)" }}
            >
              <iframe
                src={gameUrl}
                title={title}
                className="w-full h-full block"
                allow="fullscreen; clipboard-read; clipboard-write; autoplay"
                allowFullScreen
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard below */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" /> Batch Leaderboard
            </CardTitle>
            {leaderboard && (
              <p className="text-[11px] text-muted-foreground">
                {leaderboard.totalPlayers} players · avg {leaderboard.averageScore}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {leaderboard ? (
            <div className="divide-y divide-border">
              {leaderboard.entries.map((e) => (
                <div
                  key={e.studentId}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm ${e.isMe ? "bg-primary/5" : ""}`}
                >
                  <div className="w-8 flex justify-center">
                    {e.rank === 1 ? (
                      <Crown className="h-4 w-4 text-amber-500" />
                    ) : e.rank === 2 ? (
                      <Medal className="h-4 w-4 text-zinc-400" />
                    ) : e.rank === 3 ? (
                      <Medal className="h-4 w-4 text-orange-500" />
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">#{e.rank}</span>
                    )}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-[10px]">
                      {e.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium truncate">{e.name}</p>
                      {e.isMe && <Badge className="text-[9px] h-4 px-1 bg-primary/15 text-primary border-0">You</Badge>}
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {formatLeaderboardTime(e.timeSec)}</span>
                      <span>· {e.attempts} attempt{e.attempts > 1 ? "s" : ""}</span>
                      <span>· {e.completedAt}</span>
                    </p>
                  </div>
                  <span className="text-base font-semibold tabular-nums">{e.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground">No scores yet — be the first!</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
