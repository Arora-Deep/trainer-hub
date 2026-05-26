import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/StatCard";
import { useGamificationStore, difficultyStyle } from "@/stores/gamificationStore";
import { Users, Trophy, Flame, Zap, Plus, Sparkles, Activity, Target } from "lucide-react";
import { useState } from "react";

const cohortEngagement = [
  { name: "Aarav Mehta",   weeklyXp: 4820, streak: 21, momentum: 1.8, attendance: 96, status: "thriving" },
  { name: "Priya Sharma",  weeklyXp: 4510, streak: 92, momentum: 2.0, attendance: 100, status: "thriving" },
  { name: "Sarah Johnson", weeklyXp: 4180, streak: 14, momentum: 1.4, attendance: 92, status: "thriving" },
  { name: "Marcus Lee",    weeklyXp: 3520, streak: 6,  momentum: 1.1, attendance: 80, status: "steady" },
  { name: "Diego Alvarez", weeklyXp: 1240, streak: 0,  momentum: 0.7, attendance: 54, status: "at_risk" },
  { name: "Ananya Iyer",   weeklyXp: 980,  streak: 2,  momentum: 0.9, attendance: 70, status: "steady" },
  { name: "Vikram Singh",  weeklyXp: 320,  streak: 0,  momentum: 0.6, attendance: 42, status: "at_risk" },
];

const statusStyle: Record<string, string> = {
  thriving: "text-success bg-success/10 border-success/20",
  steady: "text-primary bg-primary/10 border-primary/20",
  at_risk: "text-destructive bg-destructive/10 border-destructive/20",
};

export default function Engagement() {
  const { challenges } = useGamificationStore();
  const [leaderboardOn, setLeaderboardOn] = useState(true);
  const [teamsOn, setTeamsOn] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engagement Management"
        description="Drive consistency, momentum, and competition across your cohort."
        actions={
          <>
            <Button variant="outline"><Sparkles className="mr-1.5 h-4 w-4" /> Grant Bonus XP</Button>
            <Button><Plus className="mr-1.5 h-4 w-4" /> Create Challenge</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Active learners" value="24 / 28" icon={Users} description="Active in last 7 days" />
        <StatCard title="Avg weekly XP" value="2,840" icon={Zap} description="↑ 12% vs last week" />
        <StatCard title="Avg streak" value="9.4 days" icon={Flame} description="Cohort momentum healthy" />
        <StatCard title="Challenges issued" value="14" icon={Trophy} description="6 in progress" />
      </div>

      <Tabs defaultValue="cohort">
        <TabsList>
          <TabsTrigger value="cohort">Cohort Engagement</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="competitions">Team Competitions</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="cohort" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2.5 border-b text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span>Student</span><span>Weekly XP</span><span>Streak</span><span>Momentum</span><span>Attendance</span><span>Status</span>
              </div>
              {cohortEngagement.map((s) => (
                <div key={s.name} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center border-b last:border-b-0 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                      {s.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                    </div>
                    <p className="text-sm font-medium truncate">{s.name}</p>
                  </div>
                  <span className="text-sm tabular-nums">{s.weeklyXp.toLocaleString()}</span>
                  <span className="text-sm tabular-nums inline-flex items-center gap-1">
                    <Flame className="h-3 w-3 text-warning" /> {s.streak}d
                  </span>
                  <span className="text-sm tabular-nums">{s.momentum.toFixed(1)}×</span>
                  <span className="text-sm tabular-nums">{s.attendance}%</span>
                  <Badge variant="outline" className={`text-[10px] capitalize ${statusStyle[s.status]}`}>
                    {s.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {challenges.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{c.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{c.brief}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${difficultyStyle[c.difficulty]}`}>{c.difficulty}</Badge>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                    <span>{c.participants} participants · +{c.xp} XP</span>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competitions" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold">Team Competitions</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Run cohort-vs-cohort or red-vs-blue sprints.</p>
                </div>
                <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New competition</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: "DevOps Sprint Week", teams: 2, status: "Running", days: 4 },
                  { name: "Red Team vs Blue Team", teams: 2, status: "Scheduled", days: 7 },
                  { name: "Batch A vs Batch B", teams: 2, status: "Completed", days: 0 },
                ].map((co) => (
                  <Card key={co.name}>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-sm font-semibold">{co.name}</p>
                      <div className="text-[11px] text-muted-foreground">{co.teams} teams · {co.status}</div>
                      <Badge variant="outline" className="text-[10px]">{co.days > 0 ? `${co.days} days remaining` : "Wrapped"}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <ControlRow
                icon={Trophy} title="Public leaderboards"
                description="Show weekly XP, batch, and skill leaderboards to all students in this cohort."
                value={leaderboardOn} onChange={setLeaderboardOn}
              />
              <ControlRow
                icon={Users} title="Team competitions"
                description="Enable optional team-based sprints and capture challenges."
                value={teamsOn} onChange={setTeamsOn}
              />
              <ControlRow
                icon={Target} title="Daily missions"
                description="Rotate daily and weekly missions that reward XP and streak bonuses."
                value={true} onChange={() => {}}
              />
              <ControlRow
                icon={Activity} title="Engagement nudges"
                description="Send gentle reminders to students whose momentum is decaying."
                value={true} onChange={() => {}}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ControlRow({
  icon: Icon, title, description, value, onChange,
}: { icon: typeof Users; title: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border">
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
