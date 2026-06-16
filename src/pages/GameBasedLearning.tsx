import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gamepad2, Plus, Search, Trophy, Zap, Users, Sparkles, Check, BookOpen, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Format = "quiz-show" | "escape-room" | "leaderboard-race" | "scenario-sim";

interface Game {
  id: string;
  title: string;
  course: string;
  format: Format;
  rounds: number;
  players: number;
  topScore: number;
  status: "published" | "draft";
  description?: string;
  usedInCourses?: string[];
  avgDuration?: string;
  lastPlayed?: string;
}

const formatLabel: Record<Format, string> = {
  "quiz-show": "Quiz Show",
  "escape-room": "Escape Room",
  "leaderboard-race": "Leaderboard Race",
  "scenario-sim": "Scenario Simulation",
};

interface GameTemplate {
  id: string;
  name: string;
  tagline: string;
  format: Format;
  rounds: number;
  description: string;
  icon: typeof Gamepad2;
  accent: string;
}

const gameTemplates: GameTemplate[] = [
  {
    id: "game-1",
    name: "Game 1 — Quick Quiz Show",
    tagline: "Fast-paced 5-round MCQ battle",
    format: "quiz-show",
    rounds: 5,
    description: "Teams race through multiple-choice rounds with a live leaderboard. Best for revising concepts before an exam.",
    icon: Zap,
    accent: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  },
  {
    id: "game-2",
    name: "Game 2 — Escape Room",
    tagline: "3 puzzles. One way out.",
    format: "escape-room",
    rounds: 3,
    description: "Students solve scenario-based puzzles in sequence to 'escape'. Great for problem-solving and applied learning.",
    icon: Target,
    accent: "from-violet-500/20 to-indigo-500/10 border-violet-500/30",
  },
  {
    id: "game-3",
    name: "Game 3 — Leaderboard Race",
    tagline: "10-round speedrun, top score wins",
    format: "leaderboard-race",
    rounds: 10,
    description: "Individual time-attack format. Each correct answer adds points; speed multiplier rewards fast thinkers.",
    icon: Trophy,
    accent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
  },
];

const seed: Game[] = [
  { id: "g1", title: "AWS Networking Showdown", course: "AWS Solutions Architect", format: "quiz-show", rounds: 5, players: 24, topScore: 980, status: "published", description: "Fast-paced quiz covering VPC, subnets, routing and security groups.", usedInCourses: ["AWS Solutions Architect", "Cloud Practitioner Bootcamp"], avgDuration: "18 min", lastPlayed: "2 days ago" },
  { id: "g2", title: "Kubernetes Escape Room", course: "Kubernetes Fundamentals", format: "escape-room", rounds: 3, players: 16, topScore: 720, status: "published", description: "Debug a broken cluster across 3 scenarios to escape.", usedInCourses: ["Kubernetes Fundamentals", "DevOps Bootcamp"], avgDuration: "32 min", lastPlayed: "5 days ago" },
  { id: "g3", title: "Linux CLI Speedrun", course: "Linux Server Hardening", format: "leaderboard-race", rounds: 10, players: 32, topScore: 1450, status: "published", description: "Race against the clock to complete CLI tasks correctly.", usedInCourses: ["Linux Server Hardening", "DevOps Bootcamp", "SRE Essentials"], avgDuration: "22 min", lastPlayed: "Yesterday" },
  { id: "g4", title: "Incident Response Sim", course: "DevOps Bootcamp", format: "scenario-sim", rounds: 4, players: 0, topScore: 0, status: "draft", description: "Walk through a production incident as the on-call engineer.", usedInCourses: [], avgDuration: "—", lastPlayed: "Never" },
];

export default function GameBasedLearning() {
  const [games, setGames] = useState<Game[]>(seed);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(gameTemplates[0].id);
  const [draft, setDraft] = useState({ title: "", course: "", description: "" });
  const [detailGame, setDetailGame] = useState<Game | null>(null);

  const filtered = games.filter((g) => g.title.toLowerCase().includes(q.toLowerCase()) || g.course.toLowerCase().includes(q.toLowerCase()));
  const published = games.filter((g) => g.status === "published").length;
  const totalPlayers = games.reduce((s, g) => s + g.players, 0);
  const topScore = games.reduce((s, g) => Math.max(s, g.topScore), 0);

  const template = gameTemplates.find((t) => t.id === selectedTemplate)!;

  const create = () => {
    if (!draft.title.trim() || !draft.course.trim()) {
      toast({ title: "Missing fields", description: "Title and course are required.", variant: "destructive" });
      return;
    }
    setGames((prev) => [
      ...prev,
      { id: `g${prev.length + 1}`, title: draft.title, course: draft.course, format: template.format, rounds: template.rounds, players: 0, topScore: 0, status: "draft", description: draft.description || template.description, usedInCourses: [draft.course] },
    ]);
    setDraft({ title: "", course: "", description: "" });
    setSelectedTemplate(gameTemplates[0].id);
    setOpen(false);
    toast({ title: "Game session created", description: `${template.name.split("—")[0].trim()} saved as draft.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Game-based Learning"
        description="Gamified sessions — quiz shows, escape rooms, scenario sims. Push them live into a class or attach as a lesson."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> New Game Session</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Gamepad2 className="h-4 w-4 text-primary" /> New Game-based Session</DialogTitle>
                <DialogDescription>Pick a game template, then customise the title, course and description.</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-2">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Choose a game</Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {gameTemplates.map((t) => {
                      const Icon = t.icon;
                      const active = selectedTemplate === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTemplate(t.id)}
                          className={cn(
                            "relative text-left rounded-xl border p-4 transition-all bg-gradient-to-br",
                            t.accent,
                            active ? "ring-2 ring-primary shadow-md" : "hover:shadow-sm opacity-90 hover:opacity-100"
                          )}
                        >
                          {active && (
                            <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                          <Icon className="h-5 w-5 mb-2" />
                          <div className="text-sm font-semibold">{t.name}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{t.tagline}</div>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className="text-[10px]">{formatLabel[t.format]}</Badge>
                            <Badge variant="outline" className="text-[10px]">{t.rounds} rounds</Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. AWS Networking Showdown" /></div>
                  <div className="space-y-2"><Label>Course</Label><Input value={draft.course} onChange={(e) => setDraft({ ...draft, course: e.target.value })} placeholder="e.g. AWS Solutions Architect" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder={template.description} className="min-h-[70px]" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={create}>Save draft</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0"><Sparkles className="h-4 w-4 text-primary" /></div>
          <div className="text-sm">
            <p className="font-medium">Push game sessions live</p>
            <p className="text-muted-foreground text-xs mt-0.5">During live training, push any game session to the class. Students see it instantly on their Learning Centre with a "Join now" prompt.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Games" value={games.length} icon={Gamepad2} />
        <StatCard title="Published" value={published} icon={Zap} />
        <StatCard title="Total Players" value={totalPlayers} icon={Users} />
        <StatCard title="Top Score" value={topScore} icon={Trophy} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search games or courses..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Rounds</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Top Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((g) => (
                <TableRow key={g.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetailGame(g)}>
                  <TableCell className="text-sm font-medium">{g.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{g.course}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{formatLabel[g.format]}</Badge></TableCell>
                  <TableCell className="text-sm">{g.rounds}</TableCell>
                  <TableCell className="text-sm">{g.players}</TableCell>
                  <TableCell className="text-sm font-semibold">{g.topScore || "—"}</TableCell>
                  <TableCell><StatusBadge status={g.status === "published" ? "success" : "neutral"} label={g.status} /></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-10">No game sessions match.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!detailGame} onOpenChange={(o) => !o && setDetailGame(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detailGame && (
            <>
              <SheetHeader className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{formatLabel[detailGame.format]}</Badge>
                  <StatusBadge status={detailGame.status === "published" ? "success" : "neutral"} label={detailGame.status} />
                </div>
                <SheetTitle className="text-xl">{detailGame.title}</SheetTitle>
                <SheetDescription>{detailGame.description || "No description provided."}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Rounds</div>
                    <div className="text-lg font-semibold mt-1">{detailGame.rounds}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Players</div>
                    <div className="text-lg font-semibold mt-1">{detailGame.players}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Top Score</div>
                    <div className="text-lg font-semibold mt-1">{detailGame.topScore || "—"}</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" /> Used in courses
                  </div>
                  {detailGame.usedInCourses && detailGame.usedInCourses.length > 0 ? (
                    <div className="space-y-1.5">
                      {detailGame.usedInCourses.map((c) => (
                        <div key={c} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                          <span>{c}</span>
                          <Badge variant="outline" className="text-[10px]">Active</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not attached to any course yet.</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><Clock className="h-3 w-3" /> Avg duration</div>
                    <div className="text-sm font-medium mt-1">{detailGame.avgDuration || "—"}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Last played</div>
                    <div className="text-sm font-medium mt-1">{detailGame.lastPlayed || "—"}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1"><Zap className="h-4 w-4 mr-2" /> Push live</Button>
                  <Button variant="outline" className="flex-1">Edit</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
