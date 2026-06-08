import { useState, useMemo, useRef } from "react";
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
  BookOpen, KeyRound, Search, Download, Upload, Mail, ArrowUpDown, Pencil, Check, X, Copy, Eye, EyeOff,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Batch } from "@/stores/batchStore";
import { useBatchStore } from "@/stores/batchStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ParticipantsTabProps {
  batch: Batch;
}

type SortField = "name" | "attendance" | "lastActive";

export function ParticipantsTab({ batch }: ParticipantsTabProps) {
  const { addParticipant, removeParticipant, updateParticipant, importParticipantsCSV } = useBatchStore();
  const [addParticipantOpen, setAddParticipantOpen] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantEmail, setNewParticipantEmail] = useState("");
  const [search, setSearch] = useState("");
  const [vmFilter, setVmFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Deterministic credential generator (mock — would come from backend in prod)
  const getCredentials = (participant: { id: string; email: string; name: string }) => {
    const username = participant.email.split("@")[0].toLowerCase().replace(/[^a-z0-9._-]/g, "");
    // Stable pseudo-random password from id
    const seed = participant.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const syllables = ["Tr", "Cl", "Pk", "Mx", "Vn", "Br", "Sk", "Lt", "Qz", "Hp"];
    const vowels = ["a", "i", "o", "u", "e"];
    const s1 = syllables[seed % syllables.length];
    const v1 = vowels[(seed >> 2) % vowels.length];
    const s2 = syllables[(seed >> 3) % syllables.length].toLowerCase();
    const num = 100 + (seed % 900);
    return { username, password: `${s1}${v1}${s2}@${num}` };
  };

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard` });
  };

  const handleAddParticipant = () => {
    if (!newParticipantName.trim() || !newParticipantEmail.trim()) {
      toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
      return;
    }
    addParticipant(batch.id, { name: newParticipantName.trim(), email: newParticipantEmail.trim() });
    toast({ title: "Success", description: "Participant added successfully" });
    setNewParticipantName(""); setNewParticipantEmail(""); setAddParticipantOpen(false);
  };

  const startEditing = (id: string, name: string, email: string) => {
    setEditingId(id);
    setEditName(name);
    setEditEmail(email);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim() || !editEmail.trim()) return;
    updateParticipant(batch.id, editingId, { name: editName.trim(), email: editEmail.trim() });
    toast({ title: "Updated", description: "Participant details saved" });
    setEditingId(null);
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      // Skip header row if it looks like headers
      const startIdx = lines[0]?.toLowerCase().includes("name") ? 1 : 0;
      const participants = lines.slice(startIdx).map(line => {
        const parts = line.split(",").map(p => p.trim().replace(/^["']|["']$/g, ""));
        return { name: parts[0] || "", email: parts[1] || "" };
      }).filter(p => p.name);

      if (participants.length === 0) {
        toast({ title: "Error", description: "No valid participants found in CSV", variant: "destructive" });
        return;
      }
      importParticipantsCSV(batch.id, participants);
      toast({ title: "Imported", description: `${participants.length} participants imported from CSV` });
    };
    reader.readAsText(file);
    // Reset input
    if (csvInputRef.current) csvInputRef.current.value = "";
  };

  const handleExportCSV = () => {
    const header = "Name,Email\n";
    const rows = batch.participants.map(p => `"${p.name}","${p.email}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${batch.name.replace(/\s+/g, "_")}_participants.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${batch.participants.length} participants exported` });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filteredParticipants = useMemo(() => {
    let filtered = batch.participants.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
      const matchesVm = vmFilter === "all" || p.vmStatus === vmFilter;
      return matchesSearch && matchesVm;
    });

    filtered.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortField) {
        case "name": return a.name.localeCompare(b.name) * dir;
        case "attendance": {
          const aRate = a.attendance.total > 0 ? a.attendance.present / a.attendance.total : 0;
          const bRate = b.attendance.total > 0 ? b.attendance.present / b.attendance.total : 0;
          return (aRate - bRate) * dir;
        }
        default: return 0;
      }
    });

    return filtered;
  }, [batch.participants, search, vmFilter, sortField, sortDir]);

  const vmCounts = useMemo(() => ({
    all: batch.participants.length,
    running: batch.participants.filter(p => p.vmStatus === "running").length,
    stopped: batch.participants.filter(p => p.vmStatus === "stopped").length,
    error: batch.participants.filter(p => p.vmStatus === "error").length,
  }), [batch.participants]);

  const avgScore = useMemo(() => {
    const scored = batch.participants.filter(p => p.quizScore !== null);
    if (scored.length === 0) return null;
    return Math.round(scored.reduce((sum, p) => sum + (p.quizScore || 0), 0) / scored.length);
  }, [batch.participants]);

  const avgAttendance = useMemo(() => {
    const withAtt = batch.participants.filter(p => p.attendance.total > 0);
    if (withAtt.length === 0) return null;
    return Math.round(withAtt.reduce((sum, p) => sum + (p.attendance.present / p.attendance.total) * 100, 0) / withAtt.length);
  }, [batch.participants]);

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

  const isAutoGenerated = (name: string) => /^Participant \d+$/.test(name);

  return (
    <div className="space-y-4">
      {/* Hidden CSV input */}
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleCSVImport}
      />

      {/* Summary Strip */}
      {batch.participants.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            batch.deliveryMode === "self-paced" || batch.enrollmentMode === "floating"
              ? { label: "Enrolled (Floating)", value: `${batch.enrolledCount ?? batch.participants.length}`, icon: Users }
              : { label: "Total Participants", value: `${batch.participants.length}/${batch.seatCount}`, icon: Users },
            { label: "VMs Running", value: vmCounts.running, icon: Monitor },
            { label: "Credentials Issued", value: batch.participants.length, icon: KeyRound },
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

      {/* Auto-generated hint */}
      {batch.participants.length > 0 && batch.participants.some(p => isAutoGenerated(p.name)) && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
          <Pencil className="h-4 w-4 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">Participants auto-generated from seat count</p>
            <p className="text-xs text-muted-foreground">Click the edit icon on any row to update names and emails, or import a CSV to replace all at once.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => csvInputRef.current?.click()}>
            <Upload className="mr-1.5 h-3.5 w-3.5" />Import CSV
          </Button>
        </div>
      )}

      {/* Main Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Participants</CardTitle>
            <CardDescription>Manage enrolled participants — share login credentials, attendance, and VM access</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => csvInputRef.current?.click()}>
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Import CSV
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handleExportCSV}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
            <Dialog open={addParticipantOpen} onOpenChange={setAddParticipantOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><UserPlus className="mr-1.5 h-3.5 w-3.5" />Add Participant</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Participant</DialogTitle>
                  <DialogDescription>Add a new participant to this batch.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="participantName">Full Name</Label>
                    <Input id="participantName" placeholder="e.g., John Doe" value={newParticipantName} onChange={(e) => setNewParticipantName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participantEmail">Email Address</Label>
                    <Input id="participantEmail" type="email" placeholder="john@company.com" value={newParticipantEmail} onChange={(e) => setNewParticipantEmail(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddParticipantOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddParticipant}>Add Participant</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        {batch.participants.length > 0 && (
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
          {batch.participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold">No participants enrolled</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1.5">Add participants individually or import from a CSV file.</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => csvInputRef.current?.click()}><Upload className="mr-1.5 h-3.5 w-3.5" />Import CSV</Button>
                <Button size="sm" onClick={() => setAddParticipantOpen(true)}><UserPlus className="mr-1.5 h-3.5 w-3.5" />Add Participant</Button>
              </div>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium">No participants match your filters</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or VM filter</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-medium">
                    <SortableHeader field="name">Participant</SortableHeader>
                  </TableHead>
                  <TableHead className="font-medium">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5" />
                      Login Credentials
                    </div>
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
                {filteredParticipants.map((participant) => (
                  <TableRow key={participant.id} className="group">
                    <TableCell>
                      {editingId === participant.id ? (
                        <div className="flex items-center gap-2">
                          <div className="space-y-1 flex-1">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-7 text-sm"
                              placeholder="Name"
                              autoFocus
                              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                            />
                            <Input
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="h-7 text-sm"
                              placeholder="Email"
                              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-[hsl(var(--success))]" onClick={saveEdit}>
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingId(null)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-primary/10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.name}`} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {participant.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-sm">{participant.name}</span>
                              {isAutoGenerated(participant.name) && (
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 border-0 bg-muted">Auto</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{participant.email}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => startEditing(participant.id, participant.name, participant.email)}
                          >
                            <Pencil className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const creds = getCredentials(participant);
                        const revealed = revealedIds.has(participant.id);
                        return (
                          <div className="space-y-1 min-w-[220px]">
                            <div className="flex items-center gap-1.5">
                              <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-muted text-foreground truncate max-w-[150px]" title={creds.username}>
                                {creds.username}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-muted-foreground hover:text-foreground"
                                onClick={() => copyToClipboard(creds.username, "Username")}
                                title="Copy username"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-muted text-foreground tabular-nums">
                                {revealed ? creds.password : "••••••••"}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-muted-foreground hover:text-foreground"
                                onClick={() => toggleReveal(participant.id)}
                                title={revealed ? "Hide password" : "Show password"}
                              >
                                {revealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-muted-foreground hover:text-foreground"
                                onClick={() => copyToClipboard(creds.password, "Password")}
                                title="Copy password"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{participant.currentModule}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("font-medium text-sm tabular-nums", getAttendanceColor(participant.attendance.present, participant.attendance.total))}>
                          {participant.attendance.present}/{participant.attendance.total}
                        </span>
                        {participant.attendance.total > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({Math.round((participant.attendance.present / participant.attendance.total) * 100)}%)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getVmStatusBadge(participant.vmStatus)}
                        {participant.vmIpAddress && participant.vmStatus === "running" && (
                          <code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted hidden xl:inline">{participant.vmIpAddress}</code>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{participant.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {participant.vmStatus === "running" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              toast({ title: "VM Console", description: `Opening ${participant.name}'s VM console...` });
                              window.open(`https://console.platform.com/vm/${batch.id}/${participant.id}`, "_blank");
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
                            <DropdownMenuItem onClick={() => startEditing(participant.id, participant.name, participant.email)}>
                              <Pencil className="mr-2 h-3.5 w-3.5" />Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem><Mail className="mr-2 h-3.5 w-3.5" />Send Message</DropdownMenuItem>
                            <DropdownMenuItem>Mark Attendance</DropdownMenuItem>
                            {participant.vmStatus === "running" && (
                              <DropdownMenuItem onClick={() => {
                                toast({ title: "VM Console", description: `Accessing ${participant.name}'s VM...` });
                              }}>
                                <ExternalLink className="mr-2 h-3.5 w-3.5" />Access VM Console
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                removeParticipant(batch.id, participant.id);
                                toast({ title: "Removed", description: "Participant removed from batch" });
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
