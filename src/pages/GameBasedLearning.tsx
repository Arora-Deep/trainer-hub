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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gamepad2, Plus, Search, Trophy, Zap, Users, Sparkles } from "lucide-react";
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
}

const formatLabel: Record<Format, string> = {
  "quiz-show": "Quiz Show",
  "escape-room": "Escape Room",
  "leaderboard-race": "Leaderboard Race",
  "scenario-sim": "Scenario Simulation",
};

const seed: Game[] = [
  { id: "g1", title: "AWS Networking Showdown", course: "AWS Solutions Architect", format: "quiz-show", rounds: 5, players: 24, topScore: 980, status: "published" },
  { id: "g2", title: "Kubernetes Escape Room", course: "Kubernetes Fundamentals", format: "escape-room", rounds: 3, players: 16, topScore: 720, status: "published" },
  { id: "g3", title: "Linux CLI Speedrun", course: "Linux Server Hardening", format: "leaderboard-race", rounds: 10, players: 32, topScore: 1450, status: "published" },
  { id: "g4", title: "Incident Response Sim", course: "DevOps Bootcamp", format: "scenario-sim", rounds: 4, players: 0, topScore: 0, status: "draft" },
];

export default function GameBasedLearning() {
  const [games, setGames] = useState<Game[]>(seed);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", course: "", description: "", format: "quiz-show" as Format, rounds: 5 });

  const filtered = games.filter((g) => g.title.toLowerCase().includes(q.toLowerCase()) || g.course.toLowerCase().includes(q.toLowerCase()));
  const published = games.filter((g) => g.status === "published").length;
  const totalPlayers = games.reduce((s, g) => s + g.players, 0);
  const topScore = games.reduce((s, g) => Math.max(s, g.topScore), 0);

  const create = () => {
    if (!draft.title.trim() || !draft.course.trim()) {
      toast({ title: "Missing fields", description: "Title and course are required.", variant: "destructive" });
      return;
    }
    setGames((prev) => [
      ...prev,
      { id: `g${prev.length + 1}`, title: draft.title, course: draft.course, format: draft.format, rounds: draft.rounds, players: 0, topScore: 0, status: "draft" },
    ]);
    setDraft({ title: "", course: "", description: "", format: "quiz-show", rounds: 5 });
    setOpen(false);
    toast({ title: "Game-based session created", description: "Saved as draft." });
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Gamepad2 className="h-4 w-4 text-primary" /> New Game-based Session</DialogTitle>
                <DialogDescription>Design a gamified learning experience with rounds, points and a leaderboard.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2"><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. AWS Networking Showdown" /></div>
                <div className="space-y-2"><Label>Course</Label><Input value={draft.course} onChange={(e) => setDraft({ ...draft, course: e.target.value })} placeholder="e.g. AWS Solutions Architect" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={draft.format} onValueChange={(v: Format) => setDraft({ ...draft, format: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(formatLabel) as Format[]).map((f) => (<SelectItem key={f} value={f}>{formatLabel[f]}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Rounds</Label><Input type="number" min={1} value={draft.rounds} onChange={(e) => setDraft({ ...draft, rounds: parseInt(e.target.value) || 1 })} /></div>
                </div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Briefly describe the game flow, objectives and scoring." className="min-h-[80px]" /></div>
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
                <TableRow key={g.id}>
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
    </div>
  );
}
