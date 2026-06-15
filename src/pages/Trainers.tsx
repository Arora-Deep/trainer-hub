import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Star, Users, BookOpen, Search, UserSquare2 } from "lucide-react";
import { useTrainerStore, ALL_SKILLS } from "@/stores/trainerStore";
import { toast } from "@/hooks/use-toast";

const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function Trainers() {
  const trainers = useTrainerStore((s) => s.trainers);
  const addTrainer = useTrainerStore((s) => s.addTrainer);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", bio: "", hourlyRate: 2000,
    skills: [] as string[], certifications: "",
  });

  const filtered = useMemo(
    () =>
      trainers.filter((t) => {
        if (statusFilter !== "all" && t.status !== statusFilter) return false;
        if (skillFilter !== "all" && !t.skills.includes(skillFilter)) return false;
        if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.email.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [trainers, search, skillFilter, statusFilter]
  );

  const stats = useMemo(() => {
    const active = trainers.filter((t) => t.status === "active").length;
    const avgRating = trainers.length
      ? +(trainers.reduce((s, t) => s + t.metrics.avgRating, 0) / trainers.length).toFixed(2)
      : 0;
    const totalStudents = trainers.reduce((s, t) => s + t.metrics.studentsTrained, 0);
    const totalBatches = trainers.reduce((s, t) => s + t.metrics.batchesDelivered, 0);
    return { active, avgRating, totalStudents, totalBatches };
  }, [trainers]);

  const submit = () => {
    if (!form.name || !form.email) {
      toast({ title: "Name and email are required", variant: "destructive" });
      return;
    }
    addTrainer({
      name: form.name,
      email: form.email,
      bio: form.bio,
      hourlyRate: Number(form.hourlyRate) || 0,
      skills: form.skills,
      certifications: form.certifications.split(",").map((c) => c.trim()).filter(Boolean),
    });
    toast({ title: "Trainer added", description: `${form.name} added to the directory.` });
    setDrawerOpen(false);
    setForm({ name: "", email: "", bio: "", hourlyRate: 2000, skills: [], certifications: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainers"
        description="Manage trainers, skills and performance across all batches."
        actions={
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Trainer
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Active Trainers" value={stats.active} icon={UserSquare2} size="compact" />
        <StatCard title="Avg Rating" value={stats.avgRating} icon={Star} size="compact" />
        <StatCard title="Batches Delivered" value={stats.totalBatches} icon={BookOpen} size="compact" />
        <StatCard title="Students Trained" value={stats.totalStudents} icon={Users} size="compact" />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or email…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All skills</SelectItem>
              {ALL_SKILLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trainer</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Batches</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id} className="cursor-pointer">
                <TableCell>
                  <Link to={`/trainers/${t.id}`} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback>{initials(t.name)}</AvatarFallback></Avatar>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.email}</div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[260px]">
                    {t.skills.slice(0, 3).map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                    {t.skills.length > 3 && <Badge variant="outline" className="text-[10px]">+{t.skills.length - 3}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{t.metrics.batchesDelivered}</TableCell>
                <TableCell className="text-sm flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {t.metrics.avgRating}
                </TableCell>
                <TableCell className="text-sm">{t.metrics.completionRate}%</TableCell>
                <TableCell>
                  <StatusBadge status={t.status === "active" ? "success" : "default"} label={t.status} size="sm" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-[480px] overflow-y-auto">
          <SheetHeader><SheetTitle>Add Trainer</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div>
              <Label>Hourly Rate (₹)</Label>
              <Input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: +e.target.value })} />
            </div>
            <div>
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-1.5 mt-2 max-h-[160px] overflow-y-auto border rounded-md p-2">
                {ALL_SKILLS.map((s) => {
                  const selected = form.skills.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          skills: selected ? form.skills.filter((x) => x !== s) : [...form.skills, s],
                        })
                      }
                      className={`px-2 py-0.5 rounded-full text-[11px] border ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40"}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Certifications (comma separated)</Label>
              <Input value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button onClick={submit}>Add Trainer</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
