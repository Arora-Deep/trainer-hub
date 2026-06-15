import { useState } from "react";
import { useBatchStore } from "@/stores/batchStore";
import { useMeetingStore, type Meeting } from "@/stores/meetingStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Radio, CalendarDays, FileVideo, BarChart3, Activity, Users, Mic, Eye, ChevronRight, MessageSquare, Hand, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MeetingScheduleSheet } from "@/components/meetings/MeetingScheduleSheet";
import { MeetingsListPanel } from "@/components/meetings/MeetingsListPanel";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface MeetingsTabProps {
  batchName?: string;
  batchId?: string;
}

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
const fmtDur = (sec: number) => sec ? `${Math.floor(sec / 60)}m ${sec % 60}s` : "0s";
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export function MeetingsTab({ batchId }: MeetingsTabProps) {
  const batches = useBatchStore((s) => s.batches);
  const allMeetings = useMeetingStore((s) => s.meetings);
  const [open, setOpen] = useState(false);
  const [drillMeeting, setDrillMeeting] = useState<Meeting | null>(null);

  const batch = batchId ? batches.find((b) => b.id === batchId) : batches[0];
  if (!batch) return <Card className="p-8 text-sm text-muted-foreground text-center">Batch not found.</Card>;

  const meetings = allMeetings.filter((m) => m.batchId === batch.id);
  const live = meetings.filter((m) => m.status === "live");
  const upcoming = meetings.filter((m) => m.status === "scheduled").sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
  const past = meetings.filter((m) => m.status === "ended").sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));
  const withAnalytics = meetings.filter((m) => m.analytics);

  // Aggregate stats across all meetings for the batch
  const avg = (vals: number[]) => vals.length ? Math.round(vals.reduce((s, n) => s + n, 0) / vals.length) : 0;
  const agg = {
    sessions: withAnalytics.length,
    engagement: avg(withAnalytics.map((m) => m.analytics!.engagementScore)),
    attendance: avg(withAnalytics.map((m) => m.analytics!.attendanceRate)),
    attentiveness: avg(withAnalytics.map((m) => m.analytics!.avgAttentivenessPct)),
    talkTime: avg(withAnalytics.map((m) => m.analytics!.avgTalkTimeSec)),
    chats: withAnalytics.reduce((s, m) => s + m.analytics!.chatMsgCount, 0),
    hands: withAnalytics.reduce((s, m) => s + m.analytics!.handRaisesCount, 0),
    polls: withAnalytics.reduce((s, m) => s + m.analytics!.pollsCount, 0),
  };

  // Trend across sessions
  const trend = withAnalytics
    .slice()
    .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))
    .map((m) => ({
      name: fmtDate(m.scheduledAt),
      engagement: m.analytics!.engagementScore,
      attendance: m.analytics!.attendanceRate,
    }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold">Meetings for {batch.name}</h3>
          <p className="text-xs text-muted-foreground">All sessions attached to this batch — schedule, track and review analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="warning" label="BBB pending" size="sm" />
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Schedule Meeting
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SmallStat label="Live" value={live.length} icon={<Radio className="h-3.5 w-3.5 text-success" />} />
        <SmallStat label="Upcoming" value={upcoming.length} icon={<CalendarDays className="h-3.5 w-3.5 text-amber-500" />} />
        <SmallStat label="Past" value={past.length} icon={<FileVideo className="h-3.5 w-3.5 text-muted-foreground" />} />
        <SmallStat label="Avg engagement" value={`${agg.engagement}%`} icon={<BarChart3 className="h-3.5 w-3.5 text-primary" />} />
      </div>

      <Tabs defaultValue={live.length > 0 ? "live" : "analytics"}>
        <TabsList>
          <TabsTrigger value="live">Live ({live.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Meeting Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="live" className="mt-4">
          <MeetingsListPanel meetings={live} emptyText="No live meeting right now." />
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4">
          <MeetingsListPanel meetings={upcoming} emptyText="Nothing scheduled for this batch yet." />
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <MeetingsListPanel meetings={past} emptyText="No past sessions yet." />
        </TabsContent>

        <TabsContent value="analytics" className="mt-4 space-y-5">
          {agg.sessions === 0 ? (
            <Card className="p-10 text-center text-sm text-muted-foreground">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
              Analytics will appear once meetings have been held.
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard icon={<Sparkles className="h-4 w-4 text-primary" />} label="Avg Engagement" value={`${agg.engagement}%`} bar={agg.engagement} />
                <MetricCard icon={<Users className="h-4 w-4 text-emerald-500" />} label="Avg Attendance" value={`${agg.attendance}%`} bar={agg.attendance} />
                <MetricCard icon={<Eye className="h-4 w-4 text-blue-500" />} label="Avg Attentiveness" value={`${agg.attentiveness}%`} bar={agg.attentiveness} />
                <MetricCard icon={<Mic className="h-4 w-4 text-amber-500" />} label="Avg Talk Time" value={fmtDur(agg.talkTime)} hint={`across ${agg.sessions} session${agg.sessions === 1 ? "" : "s"}`} />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="p-4 lg:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold">Engagement & attendance trend</h4>
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="batchEng" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="batchAtt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                        <RTooltip contentStyle={{ fontSize: 12 }} />
                        <Area type="monotone" dataKey="engagement" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#batchEng)" name="Engagement" />
                        <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} fill="url(#batchAtt)" name="Attendance" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-3">Interactions total</h4>
                  <div className="space-y-2 text-sm">
                    <Row icon={<MessageSquare className="h-3.5 w-3.5 text-blue-500" />} label="Chat messages" value={agg.chats} />
                    <Row icon={<Hand className="h-3.5 w-3.5 text-amber-500" />} label="Hand raises" value={agg.hands} />
                    <Row icon={<BarChart3 className="h-3.5 w-3.5 text-emerald-500" />} label="Polls run" value={agg.polls} />
                  </div>
                </Card>
              </div>

              <Card className="p-4">
                <h4 className="text-sm font-semibold mb-3">Per-session breakdown</h4>
                <p className="text-xs text-muted-foreground mb-3">Click any session to view per-student engagement.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground border-b">
                        <th className="py-2 pr-3">Session</th>
                        <th className="py-2 pr-3">Date</th>
                        <th className="py-2 pr-3">Attendance</th>
                        <th className="py-2 pr-3">Engagement</th>
                        <th className="py-2 pr-3">Peak</th>
                        <th className="py-2 pr-3 w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {withAnalytics.map((m) => (
                        <tr
                          key={m.id}
                          className="border-b last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
                          onClick={() => setDrillMeeting(m)}
                        >
                          <td className="py-2 pr-3 font-medium text-xs">{m.title}</td>
                          <td className="py-2 pr-3 text-xs text-muted-foreground">{fmtDate(m.scheduledAt)}</td>
                          <td className="py-2 pr-3 w-32">
                            <div className="flex items-center gap-2">
                              <Progress value={m.analytics!.attendanceRate} className="h-1.5" />
                              <span className="text-[10px] tabular-nums text-muted-foreground">{m.analytics!.attendanceRate}%</span>
                            </div>
                          </td>
                          <td className="py-2 pr-3 w-32">
                            <div className="flex items-center gap-2">
                              <Progress value={m.analytics!.engagementScore} className="h-1.5" />
                              <span className="text-[10px] tabular-nums text-muted-foreground">{m.analytics!.engagementScore}%</span>
                            </div>
                          </td>
                          <td className="py-2 pr-3 text-xs tabular-nums">{m.analytics!.peakAttendees}</td>
                          <td className="py-2 pr-3"><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      <MeetingScheduleSheet open={open} onOpenChange={setOpen} lockedBatchId={batch.id} />

      <Dialog open={!!drillMeeting} onOpenChange={(o) => !o && setDrillMeeting(null)}>
        <DialogContent className="max-w-3xl">
          {drillMeeting && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{drillMeeting.title}</DialogTitle>
                <DialogDescription>
                  {fmtDate(drillMeeting.scheduledAt)} · {drillMeeting.durationMins} min · Per-student engagement
                </DialogDescription>
              </DialogHeader>
              {drillMeeting.attendees.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">No attendee data captured.</div>
              ) : (
                <div className="overflow-x-auto max-h-[60vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background">
                      <tr className="text-left text-xs text-muted-foreground border-b">
                        <th className="py-2 pr-3">Student</th>
                        <th className="py-2 pr-3">Joined</th>
                        <th className="py-2 pr-3">Talk</th>
                        <th className="py-2 pr-3">Chat</th>
                        <th className="py-2 pr-3">Polls</th>
                        <th className="py-2 pr-3">Hand</th>
                        <th className="py-2 pr-3">Attentiveness</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drillMeeting.attendees.map((att) => (
                        <tr key={att.id} className="border-b last:border-0">
                          <td className="py-2 pr-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{initials(att.name)}</AvatarFallback></Avatar>
                              <div>
                                <div className="text-xs font-medium">{att.name}</div>
                                <div className="text-[10px] text-muted-foreground">{att.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 pr-3 text-xs text-muted-foreground">{att.joinedAt ?? "—"}</td>
                          <td className="py-2 pr-3 text-xs tabular-nums">{fmtDur(att.talkTimeSec ?? 0)}</td>
                          <td className="py-2 pr-3 text-xs tabular-nums">{att.chatMsgs ?? 0}</td>
                          <td className="py-2 pr-3 text-xs tabular-nums">{att.pollsAnswered ?? 0}</td>
                          <td className="py-2 pr-3 text-xs tabular-nums">{att.handRaiseCount ?? 0}</td>
                          <td className="py-2 pr-3 w-40">
                            <div className="flex items-center gap-2">
                              <Progress value={att.attentivenessPct ?? 0} className="h-1.5" />
                              <span className="text-[10px] tabular-nums text-muted-foreground">{att.attentivenessPct ?? 0}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SmallStat({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card className="p-3 flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold tabular-nums">{value}</p>
      </div>
    </Card>
  );
}

function MetricCard({ icon, label, value, bar, hint }: { icon: React.ReactNode; label: string; value: string; bar?: number; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      {bar !== undefined && <Progress value={bar} className="h-1.5 mt-2" />}
      {hint && <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>}
    </Card>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}
