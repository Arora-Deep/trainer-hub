import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useMeetingStore } from "@/stores/meetingStore";
import { useRoleStore } from "@/stores/roleStore";
import {
  PlayCircle, ExternalLink, Trash2, FileVideo, Download, Users, Video,
  Activity, BarChart3, MessageSquare, Hand, Mic, Eye, Sparkles, Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis, Legend,
} from "recharts";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const fmtDuration = (sec: number) => {
  if (!sec) return "0s";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

export default function MeetingDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const meeting = useMeetingStore((s) => s.getMeeting(id!));
  const del = useMeetingStore((s) => s.deleteMeeting);
  const role = useRoleStore((s) => s.role);
  const basePath = role === "student" ? "/student/meetings" : "/meetings";

  if (!meeting) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Meeting not found.</p>
        <Button onClick={() => nav(basePath)}>Back</Button>
      </div>
    );
  }

  const a = meeting.analytics;
  const isTrainerOrAdmin = role !== "student";

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Meetings", href: basePath }, { label: meeting.title }]}
        title={meeting.title}
        description={`${meeting.batchName ?? "No batch"} · ${meeting.trainerName ?? "No trainer"}`}
        actions={
          <div className="flex gap-2">
            {isTrainerOrAdmin && (
              <Button variant="outline" onClick={() => { del(meeting.id); nav(basePath); }}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            )}
            <Button
              onClick={() => {
                toast({ title: "BBB integration pending", description: "Connect BigBlueButton secrets to enable live rooms." });
                window.open(meeting.joinUrl, "_blank");
              }}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              {meeting.status === "live" ? "Join Now" : meeting.status === "scheduled" ? "Open BBB Room" : "Review"}
              <ExternalLink className="h-3.5 w-3.5 ml-2" />
            </Button>
          </div>
        }
      />

      <Card className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <StatusBadge
              status={meeting.status === "live" ? "success" : meeting.status === "scheduled" ? "warning" : "default"}
              label={meeting.status}
              size="sm"
              pulse={meeting.status === "live"}
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">When</div>
            <div className="font-medium">{fmt(meeting.scheduledAt)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Duration</div>
            <div className="font-medium">{meeting.durationMins} min</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Capacity</div>
            <div className="font-medium">{meeting.attendees.length} / {meeting.maxAttendees}</div>
          </div>
        </div>
        {meeting.welcome && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground mb-1">Welcome message</div>
            <p className="text-sm">{meeting.welcome}</p>
          </div>
        )}
      </Card>

      <Tabs defaultValue={a && isTrainerOrAdmin ? "analytics" : "attendees"}>
        <TabsList>
          {a && isTrainerOrAdmin && <TabsTrigger value="analytics" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Analytics</TabsTrigger>}
          <TabsTrigger value="attendees" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Attendees ({meeting.attendees.length})</TabsTrigger>
          <TabsTrigger value="recordings" className="gap-1.5"><FileVideo className="h-3.5 w-3.5" /> Recordings ({meeting.recordings.length})</TabsTrigger>
          {isTrainerOrAdmin && <TabsTrigger value="settings">BBB Settings</TabsTrigger>}
        </TabsList>

        {a && isTrainerOrAdmin && (
          <TabsContent value="analytics" className="space-y-5 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard icon={<Sparkles className="h-4 w-4 text-primary" />} label="Engagement Score" value={`${a.engagementScore}%`} barValue={a.engagementScore} />
              <MetricCard icon={<Users className="h-4 w-4 text-emerald-500" />} label="Attendance" value={`${a.attendanceRate}%`} barValue={a.attendanceRate} hint={`${a.peakAttendees} peak`} />
              <MetricCard icon={<Eye className="h-4 w-4 text-blue-500" />} label="Avg Attentiveness" value={`${a.avgAttentivenessPct}%`} barValue={a.avgAttentivenessPct} />
              <MetricCard icon={<Mic className="h-4 w-4 text-amber-500" />} label="Avg Talk Time" value={fmtDuration(a.avgTalkTimeSec)} hint={`${a.handRaisesCount} hand raises`} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Attendance over time</h3>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={a.timeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="t" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}m`} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <RTooltip contentStyle={{ fontSize: 12 }} labelFormatter={(v) => `Minute ${v}`} />
                      <Area type="monotone" dataKey="attendees" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#attGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Engagement over time</h3>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={a.timeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="t" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}m`} />
                      <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                      <RTooltip contentStyle={{ fontSize: 12 }} labelFormatter={(v) => `Minute ${v}`} />
                      <Area type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} fill="url(#engGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="p-4 lg:col-span-1">
                <h3 className="text-sm font-semibold mb-3">Interactions</h3>
                <div className="space-y-2 text-sm">
                  <Row icon={<MessageSquare className="h-3.5 w-3.5 text-blue-500" />} label="Chat messages" value={a.chatMsgCount} />
                  <Row icon={<Hand className="h-3.5 w-3.5 text-amber-500" />} label="Hand raises" value={a.handRaisesCount} />
                  <Row icon={<BarChart3 className="h-3.5 w-3.5 text-emerald-500" />} label="Polls run" value={a.pollsCount} />
                  <Row icon={<FileVideo className="h-3.5 w-3.5 text-purple-500" />} label="Recording views" value={a.recordingViews} />
                </div>
              </Card>

              <Card className="p-4 lg:col-span-2">
                <h3 className="text-sm font-semibold mb-3">Poll results</h3>
                {a.polls.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">No polls were run in this session.</p>
                ) : (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={a.polls.map((p) => ({ q: p.question.slice(0, 30) + "…", correct: p.correctPct ?? 0, responses: p.responseCount }))} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="q" tick={{ fontSize: 9 }} interval={0} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <RTooltip contentStyle={{ fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="correct" name="% correct" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="responses" name="Responses" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </div>

            {isTrainerOrAdmin && meeting.attendees.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Per-attendee engagement</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground border-b">
                        <th className="py-2 pr-3">Attendee</th>
                        <th className="py-2 pr-3">Joined</th>
                        <th className="py-2 pr-3">Talk Time</th>
                        <th className="py-2 pr-3">Chat</th>
                        <th className="py-2 pr-3">Polls</th>
                        <th className="py-2 pr-3">Hand</th>
                        <th className="py-2 pr-3">Attentiveness</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meeting.attendees.map((att) => (
                        <tr key={att.id} className="border-b last:border-0">
                          <td className="py-2 pr-3 flex items-center gap-2">
                            <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{initials(att.name)}</AvatarFallback></Avatar>
                            <div>
                              <div className="font-medium text-xs">{att.name}</div>
                              <div className="text-[10px] text-muted-foreground">{att.email}</div>
                            </div>
                          </td>
                          <td className="py-2 pr-3 text-xs text-muted-foreground">{att.joinedAt ?? "—"}</td>
                          <td className="py-2 pr-3 text-xs tabular-nums">{fmtDuration(att.talkTimeSec ?? 0)}</td>
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
              </Card>
            )}
          </TabsContent>
        )}

        <TabsContent value="attendees" className="space-y-2 mt-4">
          {meeting.attendees.length === 0 && (
            <Card className="p-8 text-sm text-muted-foreground text-center">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No attendees recorded yet.
            </Card>
          )}
          {meeting.attendees.map((att) => (
            <Card key={att.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8"><AvatarFallback>{initials(att.name)}</AvatarFallback></Avatar>
                <div>
                  <div className="text-sm font-medium">{att.name}</div>
                  <div className="text-xs text-muted-foreground">{att.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={att.role === "moderator" ? "default" : "secondary"} className="text-[10px]">{att.role}</Badge>
                {att.joinedAt && <span className="text-xs text-muted-foreground">Joined {att.joinedAt}</span>}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recordings" className="space-y-2 mt-4">
          {meeting.recordings.length === 0 && (
            <Card className="p-8 text-sm text-muted-foreground text-center">
              <FileVideo className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No recordings available.
            </Card>
          )}
          {meeting.recordings.map((r) => (
            <Card key={r.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.durationMins} min · {r.sizeMb} MB · {fmt(r.recordedAt)} · {r.views ?? 0} views</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><PlayCircle className="h-3.5 w-3.5 mr-1.5" /> Play</Button>
                <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        {isTrainerOrAdmin && (
          <TabsContent value="settings" className="mt-4">
            <Card className="p-5 space-y-4">
              <SettingRow label="Record session" desc="Save the session to cloud recordings." value={meeting.bbb?.record ?? meeting.record} />
              <SettingRow label="Auto-start recording" value={meeting.bbb?.autoStartRecording ?? false} />
              <SettingRow label="Mute on join" value={meeting.bbb?.muteOnStart ?? meeting.muteOnJoin} />
              <SettingRow label="Waiting room" value={meeting.waitingRoom} />
              <SettingRow label="Webcams only for moderator" value={meeting.bbb?.webcamsOnlyForModerator ?? false} />
              <SettingRow label="Lock viewer mic" value={meeting.bbb?.lockSettingsDisableMic ?? false} />
              <SettingRow label="Lock viewer cam" value={meeting.bbb?.lockSettingsDisableCam ?? false} />
              <SettingRow label="Breakout rooms enabled" value={meeting.bbb?.breakoutRoomsEnabled ?? false} />
              <div className="pt-3 border-t text-xs text-muted-foreground">
                Guest policy: <span className="font-medium text-foreground">{meeting.bbb?.guestPolicy ?? "ALWAYS_ACCEPT"}</span> · Layout: <span className="font-medium text-foreground">{meeting.bbb?.layout ?? "CUSTOM_LAYOUT"}</span> · BBB meetingID: <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{meeting.bbb?.meetingID ?? "—"}</code>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function MetricCard({ icon, label, value, barValue, hint }: { icon: React.ReactNode; label: string; value: string; barValue?: number; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {barValue !== undefined && <Progress value={barValue} className="h-1 mt-2" />}
      {hint && <p className="text-[10px] text-muted-foreground mt-1.5">{hint}</p>}
    </Card>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function SettingRow({ label, desc, value }: { label: string; desc?: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label>{label}</Label>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      <Switch checked={value} disabled />
    </div>
  );
}
