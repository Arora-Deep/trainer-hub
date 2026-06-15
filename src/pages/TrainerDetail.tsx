import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Star, Award, BookOpen, Users, TrendingUp, Plus, Mail, AlertTriangle } from "lucide-react";
import { useTrainerStore } from "@/stores/trainerStore";
import { useBatchStore } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--info))", "hsl(var(--destructive))"];
const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function TrainerDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const trainer = useTrainerStore((s) => s.getTrainer(id!));
  const assignToBatch = useTrainerStore((s) => s.assignToBatch);
  const unassign = useTrainerStore((s) => s.unassignFromBatch);
  const batches = useBatchStore((s) => s.batches);
  const [assignOpen, setAssignOpen] = useState(false);
  const [pickedBatch, setPickedBatch] = useState<string>("");

  const assignedBatches = useMemo(
    () => batches.filter((b) => trainer?.assignedBatchIds.includes(b.id)),
    [batches, trainer]
  );

  const assignableBatches = useMemo(
    () => batches.filter((b) => !trainer?.assignedBatchIds.includes(b.id) && b.status !== "completed"),
    [batches, trainer]
  );

  const conflict = useMemo(() => {
    if (!pickedBatch || !trainer) return null;
    const picked = batches.find((b) => b.id === pickedBatch);
    if (!picked) return null;
    const ps = new Date(picked.startDate);
    const pe = new Date(picked.endDate);
    return assignedBatches.find((b) => {
      const s = new Date(b.startDate);
      const e = new Date(b.endDate);
      return s <= pe && e >= ps;
    });
  }, [pickedBatch, assignedBatches, batches, trainer]);

  if (!trainer) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Trainer not found.</p>
        <Button onClick={() => nav("/trainers")}>Back to Trainers</Button>
      </div>
    );
  }

  const m = trainer.metrics;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Trainers", href: "/trainers" }, { label: trainer.name }]}
        title={trainer.name}
        description={trainer.email}
        actions={
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" /> Email
          </Button>
        }
      />

      <Card className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16"><AvatarFallback className="text-lg">{initials(trainer.name)}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={trainer.status === "active" ? "success" : "default"} label={trainer.status} size="sm" />
              <span className="text-xs text-muted-foreground">Joined {trainer.joinedAt}</span>
              <span className="text-xs text-muted-foreground">• ₹{trainer.hourlyRate}/hr</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{trainer.bio}</p>
            <div className="flex flex-wrap gap-1.5">
              {trainer.skills.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard title="Avg Rating" value={m.avgRating} icon={Star} size="compact" />
        <StatCard title="NPS" value={m.npsScore} icon={TrendingUp} size="compact" />
        <StatCard title="Completion" value={`${m.completionRate}%`} icon={Award} size="compact" />
        <StatCard title="Attendance" value={`${m.attendanceRate}%`} icon={Users} size="compact" />
        <StatCard title="Batches" value={m.batchesDelivered} icon={BookOpen} size="compact" />
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Rating Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={m.ratingTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Student Score Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={m.scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-4 lg:col-span-2">
              <h3 className="text-sm font-semibold mb-3">Outcome Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed", value: m.completionRate },
                      { name: "Dropped", value: 100 - m.completionRate },
                    ]}
                    dataKey="value"
                    cx="50%" cy="50%" outerRadius={80} label
                  >
                    {[0, 1].map((i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-3">
          <div className="flex justify-end">
            <Button onClick={() => setAssignOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Assign to Batch
            </Button>
          </div>
          {assignedBatches.length === 0 && (
            <Card className="p-8 text-sm text-muted-foreground text-center">Not assigned to any batches yet.</Card>
          )}
          {assignedBatches.map((b) => (
            <Card key={b.id} className="p-4 flex items-center justify-between">
              <div>
                <Link to={`/batches/${b.id}`} className="text-sm font-medium hover:underline">{b.name}</Link>
                <div className="text-xs text-muted-foreground">{b.startDate} → {b.endDate} • {b.courseName}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={b.status === "live" ? "success" : b.status === "upcoming" ? "warning" : "default"} label={b.status} size="sm" />
                <Button variant="ghost" size="sm" onClick={() => unassign(trainer.id, b.id)}>Remove</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="certifications">
          <Card className="p-4">
            {trainer.certifications.length === 0 && (
              <p className="text-sm text-muted-foreground">No certifications listed.</p>
            )}
            <div className="space-y-2">
              {trainer.certifications.map((c) => (
                <div key={c} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm">{c}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-3">
          {trainer.feedback.length === 0 && (
            <Card className="p-8 text-sm text-muted-foreground text-center">No student feedback yet.</Card>
          )}
          {trainer.feedback.map((f) => (
            <Card key={f.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">{f.studentName}</div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < f.rating ? "fill-warning text-warning" : "text-muted"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{f.comment}</p>
              <div className="text-xs text-muted-foreground">{f.batchName} • {f.date}</div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Sheet open={assignOpen} onOpenChange={setAssignOpen}>
        <SheetContent side="right" className="w-[440px]">
          <SheetHeader><SheetTitle>Assign to Batch</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-4">
            <div>
              <Label>Batch</Label>
              <div className="space-y-2 mt-2 max-h-[400px] overflow-y-auto">
                {assignableBatches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setPickedBatch(b.id)}
                    className={`w-full text-left p-3 rounded-lg border ${pickedBatch === b.id ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.startDate} → {b.endDate}</div>
                  </button>
                ))}
              </div>
            </div>
            {conflict && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 text-warning text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>Schedule conflict with <strong>{conflict.name}</strong> ({conflict.startDate} → {conflict.endDate}).</div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button>
              <Button
                disabled={!pickedBatch}
                onClick={() => {
                  assignToBatch(trainer.id, pickedBatch);
                  toast({ title: "Assigned", description: "Trainer added to batch." });
                  setPickedBatch("");
                  setAssignOpen(false);
                }}
              >Assign</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
