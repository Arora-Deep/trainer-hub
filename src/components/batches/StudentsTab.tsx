import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, UserPlus, MoreHorizontal, ExternalLink, Monitor, CalendarCheck,
  BookOpen, GraduationCap, Search, Download, Upload, Mail, ArrowUpDown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Batch } from "@/stores/batchStore";
import { useBatchStore } from "@/stores/batchStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface StudentsTabProps {
  batch: Batch;
}

type SortField = "name" | "quizScore" | "attendance" | "lastActive";

export function StudentsTab({ batch }: StudentsTabProps) {
  const { addStudent, removeStudent } = useBatchStore();
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [search, setSearch] = useState("");
  const [vmFilter, setVmFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentEmail.trim()) {
      toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
      return;
    }
    addStudent(batch.id, { name: newStudentName.trim(), email: newStudentEmail.trim() });
    toast({ title: "Success", description: "Student added successfully" });
    setNewStudentName(""); setNewStudentEmail(""); setAddStudentOpen(false);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filteredStudents = useMemo(() => {
    let students = batch.students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
      const matchesVm = vmFilter === "all" || s.vmStatus === vmFilter;
      return matchesSearch && matchesVm;
    });

    students.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortField) {
        case "name": return a.name.localeCompare(b.name) * dir;
        case "quizScore": return ((a.quizScore ?? -1) - (b.quizScore ?? -1)) * dir;
        case "attendance": {
          const aRate = a.attendance.total > 0 ? a.attendance.present / a.attendance.total : 0;
          const bRate = b.attendance.total > 0 ? b.attendance.present / b.attendance.total : 0;
          return (aRate - bRate) * dir;
        }
        default: return 0;
      }
    });

    return students;
  }, [batch.students, search, vmFilter, sortField, sortDir]);

  const vmCounts = useMemo(() => ({
    all: batch.students.length,
    running: batch.students.filter(s => s.vmStatus === "running").length,
    stopped: batch.students.filter(s => s.vmStatus === "stopped").length,
    error: batch.students.filter(s => s.vmStatus === "error").length,
  }), [batch.students]);

  const avgScore = useMemo(() => {
    const scored = batch.students.filter(s => s.quizScore !== null);
    if (scored.length === 0) return null;
    return Math.round(scored.reduce((sum, s) => sum + (s.quizScore || 0), 0) / scored.length);
  }, [batch.students]);

  const avgAttendance = useMemo(() => {
    const withAtt = batch.students.filter(s => s.attendance.total > 0);
    if (withAtt.length === 0) return null;
    return Math.round(withAtt.reduce((sum, s) => sum + (s.attendance.present / s.attendance.total) * 100, 0) / withAtt.length);
  }, [batch.students]);

  const getVmStatusBadge = (status?: string) => {
    switch (status) {
      case "running": return <StatusBadge status="success" label="Running" />;
      case "stopped": return <StatusBadge status="warning" label="Stopped" />;
      case "error": return <StatusBadge status="error" label="Error" />;
      default: return <StatusBadge status="default" label="N/A" />;
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getAttendanceColor = (present: number, total: number) => {
    if (total === 0) return "text-muted-foreground";
    const pct = (present / total) * 100;
    if (pct >= 80) return "text-success";
    if (pct >= 60) return "text-warning";
    return "text-destructive";
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button onClick={() => toggleSort(field)} className="flex items-center gap-1 hover:text-foreground transition-colors">
      {children}
      <ArrowUpDown className={cn("h-3 w-3", sortField === field ? "text-primary" : "text-muted-foreground/40")} />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Summary Strip */}
      {batch.students.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Students", value: `${batch.students.length}/${batch.seatCount}`, icon: Users },
            { label: "VMs Running", value: vmCounts.running, icon: Monitor },
            { label: "Avg Quiz Score", value: avgScore !== null ? `${avgScore}%` : "—", icon: GraduationCap },
            { label: "Avg Attendance", value: avgAttendance !== null ? `${avgAttendance}%` : "—", icon: CalendarCheck },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-3"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-xl font-bold tabular-nums">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Students</CardTitle>
            <CardDescription>Manage enrolled students — monitor quiz scores, attendance, and VM access</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Import CSV
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
            <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><UserPlus className="mr-1.5 h-3.5 w-3.5" />Add Student</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Student</DialogTitle>
                  <DialogDescription>Add a new student to this batch.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Full Name</Label>
                    <Input id="studentName" placeholder="e.g., John Doe" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentEmail">Email Address</Label>
                    <Input id="studentEmail" type="email" placeholder="john@company.com" value={newStudentEmail} onChange={(e) => setNewStudentEmail(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddStudentOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddStudent}>Add Student</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        {batch.students.length > 0 && (
          <div className="px-6 pb-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 bg-muted/50 border-0 text-sm"
              />
            </div>
            <Select value={vmFilter} onValueChange={setVmFilter}>
              <SelectTrigger className="w-[150px] h-8 text-xs">
                <Monitor className="h-3 w-3 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All VMs ({vmCounts.all})</SelectItem>
                <SelectItem value="running">Running ({vmCounts.running})</SelectItem>
                <SelectItem value="stopped">Stopped ({vmCounts.stopped})</SelectItem>
                <SelectItem value="error">Error ({vmCounts.error})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <CardContent className="p-0">
          {batch.students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold">No students enrolled</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1.5">Add students individually or import from a CSV file.</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm"><Upload className="mr-1.5 h-3.5 w-3.5" />Import CSV</Button>
                <Button size="sm" onClick={() => setAddStudentOpen(true)}><UserPlus className="mr-1.5 h-3.5 w-3.5" />Add Student</Button>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium">No students match your filters</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or VM filter</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-medium">
                    <SortableHeader field="name">Student</SortableHeader>
                  </TableHead>
                  <TableHead className="font-medium">
                    <SortableHeader field="quizScore">
                      <GraduationCap className="h-3.5 w-3.5" />
                      Quiz Score
                    </SortableHeader>
                  </TableHead>
                  <TableHead className="font-medium">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      Current Module
                    </div>
                  </TableHead>
                  <TableHead className="font-medium">
                    <SortableHeader field="attendance">
                      <CalendarCheck className="h-3.5 w-3.5" />
                      Attendance
                    </SortableHeader>
                  </TableHead>
                  <TableHead className="font-medium">
                    <div className="flex items-center gap-1.5">
                      <Monitor className="h-3.5 w-3.5" />
                      VM
                    </div>
                  </TableHead>
                  <TableHead className="font-medium">Last Active</TableHead>
                  <TableHead className="w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-primary/10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium text-sm">{student.name}</span>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-semibold text-sm tabular-nums", getScoreColor(student.quizScore))}>
                          {student.quizScore !== null ? `${student.quizScore}%` : "—"}
                        </span>
                        {student.quizScore !== null && student.quizScore >= 90 && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-success/10 text-success border-0">Top</Badge>
                        )}
                        {student.quizScore !== null && student.quizScore < 50 && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-destructive/10 text-destructive border-0">At Risk</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{student.currentModule}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("font-medium text-sm tabular-nums", getAttendanceColor(student.attendance.present, student.attendance.total))}>
                          {student.attendance.present}/{student.attendance.total}
                        </span>
                        {student.attendance.total > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({Math.round((student.attendance.present / student.attendance.total) * 100)}%)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getVmStatusBadge(student.vmStatus)}
                        {student.vmIpAddress && student.vmStatus === "running" && (
                          <code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted hidden xl:inline">{student.vmIpAddress}</code>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{student.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {student.vmStatus === "running" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              toast({ title: "VM Console", description: `Opening ${student.name}'s VM console...` });
                              window.open(`https://console.cloudadda.com/vm/${batch.id}/${student.id}`, "_blank");
                            }}
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Console
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem><Mail className="mr-2 h-3.5 w-3.5" />Send Message</DropdownMenuItem>
                            <DropdownMenuItem>Mark Attendance</DropdownMenuItem>
                            {student.vmStatus === "running" && (
                              <DropdownMenuItem onClick={() => {
                                toast({ title: "VM Console", description: `Accessing ${student.name}'s VM...` });
                              }}>
                                <ExternalLink className="mr-2 h-3.5 w-3.5" />Access VM Console
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                removeStudent(batch.id, student.id);
                                toast({ title: "Removed", description: "Student removed from batch" });
                              }}
                            >
                              Remove from Batch
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
