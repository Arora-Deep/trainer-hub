import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, UserCheck, UserX, Clock, LogOut } from "lucide-react";
import { AttendanceRecord, Meeting } from "@/stores/meetingStore";
import { toast } from "@/hooks/use-toast";

const fmtTime = (iso?: string) => iso ? new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—";

const statusBadge = (s: AttendanceRecord["status"]) => {
  const map = {
    present: { className: "bg-success/10 text-success border-success/30", icon: UserCheck, label: "Present" },
    late: { className: "bg-amber-500/10 text-amber-600 border-amber-500/30", icon: Clock, label: "Late" },
    "left-early": { className: "bg-orange-500/10 text-orange-600 border-orange-500/30", icon: LogOut, label: "Left early" },
    absent: { className: "bg-destructive/10 text-destructive border-destructive/30", icon: UserX, label: "Absent" },
  }[s];
  const Icon = map.icon;
  return <Badge variant="outline" className={`text-[10px] gap-1 ${map.className}`}><Icon className="h-2.5 w-2.5" />{map.label}</Badge>;
};

function exportCsv(meeting: Meeting) {
  const rows = [
    ["Student", "Email", "Status", "Joined", "Left", "Duration (min)", "Present %"],
    ...meeting.attendance.map(a => [a.name, a.email, a.status, fmtTime(a.joinedAt), fmtTime(a.leftAt), String(a.durationMins), `${a.presentPct}%`]),
  ];
  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `attendance-${meeting.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast({ title: "Attendance CSV exported" });
}

export function AttendanceTable({ meeting }: { meeting: Meeting }) {
  const a = meeting.attendance;
  const present = a.filter(x => x.status === "present").length;
  const late = a.filter(x => x.status === "late").length;
  const early = a.filter(x => x.status === "left-early").length;
  const absent = a.filter(x => x.status === "absent").length;
  const avgPct = a.length ? Math.round(a.reduce((s, x) => s + x.presentPct, 0) / a.length) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Invited", value: meeting.totalInvited, tone: "muted" },
          { label: "Present", value: present, tone: "success" },
          { label: "Late", value: late, tone: "warning" },
          { label: "Left early", value: early, tone: "warning" },
          { label: "Absent", value: absent, tone: "destructive" },
        ].map((s) => (
          <Card key={s.label} className="p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="text-xl font-semibold mt-1">{s.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold">Attendance roster</div>
            <div className="text-xs text-muted-foreground">Average attendance: <span className="font-semibold text-foreground">{avgPct}%</span></div>
          </div>
          <Button size="sm" variant="outline" onClick={() => exportCsv(meeting)}><Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Left</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Present %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {a.map((row) => (
              <TableRow key={row.studentId}>
                <TableCell>
                  <div className="text-sm font-medium">{row.name}</div>
                  <div className="text-xs text-muted-foreground">{row.email}</div>
                </TableCell>
                <TableCell>{statusBadge(row.status)}</TableCell>
                <TableCell className="text-xs">{fmtTime(row.joinedAt)}</TableCell>
                <TableCell className="text-xs">{fmtTime(row.leftAt)}</TableCell>
                <TableCell className="text-right text-xs">{row.durationMins} min</TableCell>
                <TableCell className="text-right text-xs font-medium">{row.presentPct}%</TableCell>
              </TableRow>
            ))}
            {a.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">No attendance recorded.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
