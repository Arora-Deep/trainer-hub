import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Pencil, Copy, Trash2, Shield, Clock, Timer, Camera, Lock, UserCheck } from "lucide-react";
import { useState } from "react";

interface Policy {
  id: number;
  name: string;
  idleTimeout: number;
  autoDestroy: number;
  examLock: boolean;
  trainerApproval: boolean;
  snapshot: boolean;
  snapshotFrequency: string;
  scope: string;
  assignedCustomers: number;
  status: "active" | "draft";
}

const policies: Policy[] = [
  { id: 1, name: "Default Lab Policy", idleTimeout: 30, autoDestroy: 14, examLock: false, trainerApproval: false, snapshot: true, snapshotFrequency: "weekly", scope: "Global", assignedCustomers: 12, status: "active" },
  { id: 2, name: "Enterprise Policy", idleTimeout: 60, autoDestroy: 30, examLock: true, trainerApproval: true, snapshot: true, snapshotFrequency: "daily", scope: "Enterprise customers", assignedCustomers: 3, status: "active" },
  { id: 3, name: "Trial Policy", idleTimeout: 15, autoDestroy: 7, examLock: false, trainerApproval: false, snapshot: false, snapshotFrequency: "none", scope: "Trial customers", assignedCustomers: 5, status: "active" },
  { id: 4, name: "GPU Lab Policy", idleTimeout: 45, autoDestroy: 3, examLock: false, trainerApproval: true, snapshot: true, snapshotFrequency: "weekly", scope: "GPU-enabled customers", assignedCustomers: 2, status: "active" },
  { id: 5, name: "Exam Mode Policy", idleTimeout: 0, autoDestroy: 1, examLock: true, trainerApproval: false, snapshot: false, snapshotFrequency: "none", scope: "Exam batches", assignedCustomers: 8, status: "draft" },
];

export default function LifecyclePolicies() {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lifecycle Policies</h1>
          <p className="text-muted-foreground text-sm mt-1">Automated lab lifecycle rules — assign globally or per customer</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setShowCreate(true)}>
          <Plus className="h-3.5 w-3.5" /> Create Policy
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Policies", value: policies.filter(p => p.status === "active").length, icon: Shield, color: "text-emerald-500" },
          { label: "Avg Idle Timeout", value: `${Math.round(policies.reduce((a, p) => a + p.idleTimeout, 0) / policies.length)} min`, icon: Timer, color: "text-amber-500" },
          { label: "Exam-Locked", value: policies.filter(p => p.examLock).length, icon: Lock, color: "text-blue-500" },
          { label: "Snapshot Enabled", value: policies.filter(p => p.snapshot).length, icon: Camera, color: "text-purple-500" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold">Policy Name</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Idle Timeout</TableHead>
                <TableHead className="text-xs font-semibold text-right">Auto Destroy</TableHead>
                <TableHead className="text-xs font-semibold text-center">Exam Lock</TableHead>
                <TableHead className="text-xs font-semibold text-center">Trainer Approval</TableHead>
                <TableHead className="text-xs font-semibold text-center">Snapshot</TableHead>
                <TableHead className="text-xs font-semibold">Scope</TableHead>
                <TableHead className="text-xs font-semibold text-right">Customers</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map(p => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelectedPolicy(p)}>
                  <TableCell className="font-medium text-sm">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`text-[10px] capitalize ${p.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono">{p.idleTimeout === 0 ? "Disabled" : `${p.idleTimeout} min`}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{p.autoDestroy} days</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className={`text-[9px] ${p.examLock ? "bg-emerald-500/10 text-emerald-500" : ""}`}>
                      {p.examLock ? "ON" : "OFF"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className={`text-[9px] ${p.trainerApproval ? "bg-emerald-500/10 text-emerald-500" : ""}`}>
                      {p.trainerApproval ? "ON" : "OFF"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className={`text-[9px] ${p.snapshot ? "bg-emerald-500/10 text-emerald-500" : ""}`}>
                      {p.snapshot ? p.snapshotFrequency : "OFF"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.scope}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{p.assignedCustomers}</TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedPolicy(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Policy Detail / Edit Drawer */}
      <Sheet open={!!selectedPolicy || showCreate} onOpenChange={open => { if (!open) { setSelectedPolicy(null); setShowCreate(false); } }}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{showCreate ? "Create Policy" : `Edit — ${selectedPolicy?.name}`}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Policy Name</Label>
              <Input defaultValue={selectedPolicy?.name || ""} className="h-9 text-sm" placeholder="e.g. Enterprise GPU Policy" />
            </div>

            <Separator />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lifecycle Rules</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5"><Timer className="h-3.5 w-3.5" /> Idle Timeout</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={selectedPolicy?.idleTimeout ?? 30} className="h-9 text-sm" min={0} />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">minutes</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Auto Destroy</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={selectedPolicy?.autoDestroy ?? 14} className="h-9 text-sm" min={1} />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">days</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium flex items-center gap-1.5"><Lock className="h-4 w-4" /> Exam Lock</p>
                  <p className="text-xs text-muted-foreground">Lock lab during exam windows — prevents extend/shutdown</p>
                </div>
                <Switch defaultChecked={selectedPolicy?.examLock} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium flex items-center gap-1.5"><UserCheck className="h-4 w-4" /> Trainer Approval Required</p>
                  <p className="text-xs text-muted-foreground">Extension requires trainer approval before applying</p>
                </div>
                <Switch defaultChecked={selectedPolicy?.trainerApproval} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium flex items-center gap-1.5"><Camera className="h-4 w-4" /> Automated Snapshots</p>
                  <p className="text-xs text-muted-foreground">Periodically snapshot lab state for recovery</p>
                </div>
                <Switch defaultChecked={selectedPolicy?.snapshot} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Snapshot Frequency</Label>
              <Select defaultValue={selectedPolicy?.snapshotFrequency || "weekly"}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="none">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assignment</p>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Scope</Label>
              <Select defaultValue="global">
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global (all customers)</SelectItem>
                  <SelectItem value="enterprise">Enterprise customers only</SelectItem>
                  <SelectItem value="trial">Trial customers only</SelectItem>
                  <SelectItem value="custom">Custom customer list</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">{showCreate ? "Create Policy" : "Save Changes"}</Button>
              {!showCreate && (
                <>
                  <Button size="sm" variant="outline" className="gap-1.5"><Copy className="h-3.5 w-3.5" /> Duplicate</Button>
                  <Button size="sm" variant="outline" className="text-destructive gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
