import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Meeting } from "@/stores/meetingStore";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const tierBadge = (t: "low" | "medium" | "high") => {
  const map = {
    high: "bg-success/10 text-success border-success/30",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    low: "bg-destructive/10 text-destructive border-destructive/30",
  };
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[t]}`}>{t}</Badge>;
};

export function EngagementPanel({ meeting }: { meeting: Meeting }) {
  const e = meeting.engagement;
  if (e.length === 0) {
    return <Card className="p-8 text-center text-sm text-muted-foreground">No engagement data — meeting hasn't ended yet.</Card>;
  }

  const avg = Math.round(e.reduce((s, x) => s + x.score, 0) / e.length);
  const low = e.filter(x => x.tier === "low").length;
  const med = e.filter(x => x.tier === "medium").length;
  const high = e.filter(x => x.tier === "high").length;

  const pieData = [
    { name: "High", value: high, color: "hsl(142 76% 36%)" },
    { name: "Medium", value: med, color: "hsl(38 92% 50%)" },
    { name: "Low", value: low, color: "hsl(0 84% 60%)" },
  ];

  const barData = [...e].sort((a, b) => b.score - a.score).slice(0, 10).map(x => ({
    name: x.name.split(" ")[0],
    score: x.score,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Average engagement</div>
          <div className="text-3xl font-semibold mt-1">{avg}<span className="text-base text-muted-foreground">/100</span></div>
          <div className="text-[11px] text-muted-foreground mt-1">across {e.length} attendees</div>
        </Card>

        <Card className="p-4">
          <div className="text-xs text-muted-foreground mb-2">Tier distribution</div>
          <div style={{ width: "100%", height: 100 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={2} dataKey="value">
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-3 text-[10px] mt-1">
            {pieData.map(d => (
              <span key={d.name} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} /> {d.name} ({d.value})
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:col-span-1">
          <div className="text-xs text-muted-foreground mb-2">Top engagers</div>
          <div style={{ width: "100%", height: 130 }}>
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ left: -20, right: 4, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Bar dataKey="score" fill="url(#engGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="text-sm font-semibold mb-3">Engagement breakdown</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className="text-right">Talk time</TableHead>
              <TableHead className="text-right">Chat</TableHead>
              <TableHead className="text-right">Hand</TableHead>
              <TableHead className="text-right">Polls</TableHead>
              <TableHead className="text-right">Camera %</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Tier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...e].sort((a, b) => b.score - a.score).map((row) => (
              <TableRow key={row.studentId}>
                <TableCell className="text-sm font-medium">{row.name}</TableCell>
                <TableCell className="text-right text-xs">{Math.round(row.talkTimeSec / 60)} min</TableCell>
                <TableCell className="text-right text-xs">{row.chatMessages}</TableCell>
                <TableCell className="text-right text-xs">{row.handRaises}</TableCell>
                <TableCell className="text-right text-xs">{row.pollResponses}</TableCell>
                <TableCell className="text-right text-xs">{row.cameraOnPct}%</TableCell>
                <TableCell className="text-right text-sm font-semibold">{row.score}</TableCell>
                <TableCell>{tierBadge(row.tier)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
