import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Crown, Server, Headphones, ShoppingCart, Calculator, Users } from "lucide-react";

type Dept = "C-Suite" | "IT / Infra" | "Core Team" | "Sales" | "Finance" | "Support";

const departmentMeta: Record<Dept, { icon: typeof Crown; color: string }> = {
  "C-Suite": { icon: Crown, color: "text-amber-600" },
  "IT / Infra": { icon: Server, color: "text-blue-600" },
  "Core Team": { icon: Users, color: "text-purple-600" },
  "Sales": { icon: ShoppingCart, color: "text-green-600" },
  "Finance": { icon: Calculator, color: "text-orange-600" },
  "Support": { icon: Headphones, color: "text-cyan-600" },
};

const permissionGroups = {
  "Customer": ["View Customers", "Create Customer", "Edit Customer", "Delete Customer"],
  "Batches": ["View Batches", "Create Batch", "Modify Batch", "Approve Batch Requests"],
  "Infrastructure": ["View Infra", "Provision VM", "Modify VM", "Replace VM", "Manage Nodes"],
  "Billing": ["View Invoices", "Create Invoice", "Edit Pricing", "Approve Refunds", "Manage Cost Centers"],
  "Support": ["View Tickets", "Reply Tickets", "Close Tickets", "Reset Password"],
  "Platform": ["View Audit Logs", "Manage Roles", "Manage Platform Users", "Maintenance Mode", "Edit Settings"],
} as const;

type Role = {
  id: string;
  name: string;
  department: Dept;
  preset?: string;
  description: string;
  permissions: string[];
};

const ALL_PERMS = Object.values(permissionGroups).flat() as string[];

const initialRoles: Role[] = [
  { id: "r1", name: "CEO", department: "C-Suite", preset: "C-Suite", description: "Full read access across the platform", permissions: ALL_PERMS },
  { id: "r2", name: "CTO", department: "C-Suite", preset: "C-Suite", description: "Full read + infra controls", permissions: ALL_PERMS },
  { id: "r3", name: "Head of Infra", department: "IT / Infra", preset: "IT Head", description: "Manages clusters, nodes, and provisioning", permissions: ["View Infra", "Provision VM", "Modify VM", "Replace VM", "Manage Nodes", "View Batches", "View Audit Logs", "Maintenance Mode"] },
  { id: "r4", name: "Ops Engineer", department: "IT / Infra", preset: "IT Head", description: "Day-to-day infra operations", permissions: ["View Infra", "Provision VM", "Modify VM", "Replace VM", "View Batches"] },
  { id: "r5", name: "Customer Success", department: "Core Team", preset: "Core Team", description: "Owns customer lifecycle and batches", permissions: ["View Customers", "Create Customer", "Edit Customer", "View Batches", "Create Batch", "Modify Batch", "Approve Batch Requests", "View Tickets", "Reply Tickets"] },
  { id: "r6", name: "Sales Rep", department: "Sales", preset: "Sales", description: "Quote, onboard, and renew customers", permissions: ["View Customers", "Create Customer", "Edit Customer", "View Invoices"] },
  { id: "r7", name: "Sales Manager", department: "Sales", preset: "Sales", description: "Sales team lead", permissions: ["View Customers", "Create Customer", "Edit Customer", "View Invoices", "Edit Pricing"] },
  { id: "r8", name: "Finance Lead", department: "Finance", preset: "Finance", description: "Full billing and refunds", permissions: ["View Invoices", "Create Invoice", "Edit Pricing", "Approve Refunds", "Manage Cost Centers", "View Customers"] },
  { id: "r9", name: "Accountant", department: "Finance", preset: "Finance", description: "Read invoices, reconcile payments", permissions: ["View Invoices", "View Customers", "Manage Cost Centers"] },
  { id: "r10", name: "Support L1", department: "Support", preset: "Support", description: "First-line ticket triage", permissions: ["View Tickets", "Reply Tickets", "View Customers", "View Batches"] },
  { id: "r11", name: "Support L2", department: "Support", preset: "Support", description: "Resolve tickets + password resets", permissions: ["View Tickets", "Reply Tickets", "Close Tickets", "Reset Password", "View Customers", "View Batches", "Modify Batch"] },
  { id: "r12", name: "Auditor", department: "Core Team", description: "Read-only across the platform", permissions: ["View Customers", "View Batches", "View Infra", "View Invoices", "View Tickets", "View Audit Logs"] },
];

const presets: Record<string, { label: string; permissions: string[] }> = {
  "C-Suite": { label: "C-Suite (full read)", permissions: ALL_PERMS },
  "IT Head": { label: "IT / Infra Head", permissions: ["View Infra", "Provision VM", "Modify VM", "Replace VM", "Manage Nodes", "View Batches", "Maintenance Mode", "View Audit Logs"] },
  "Core Team": { label: "Core Team (CS)", permissions: ["View Customers", "Create Customer", "Edit Customer", "View Batches", "Create Batch", "Modify Batch", "Approve Batch Requests", "View Tickets", "Reply Tickets"] },
  "Sales": { label: "Sales", permissions: ["View Customers", "Create Customer", "Edit Customer", "View Invoices"] },
  "Finance": { label: "Finance", permissions: ["View Invoices", "Create Invoice", "Edit Pricing", "Approve Refunds", "Manage Cost Centers", "View Customers"] },
  "Support": { label: "Support", permissions: ["View Tickets", "Reply Tickets", "Close Tickets", "View Customers", "View Batches"] },
};

export default function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [activeTab, setActiveTab] = useState<Dept | "all">("all");
  const [editing, setEditing] = useState<Role | null>(null);
  const [creating, setCreating] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({ department: "Core Team", permissions: [] });

  const departments = Object.keys(departmentMeta) as Dept[];

  const filtered = activeTab === "all" ? roles : roles.filter((r) => r.department === activeTab);

  const togglePerm = (role: Role, perm: string) => {
    const has = role.permissions.includes(perm);
    const updated = { ...role, permissions: has ? role.permissions.filter((p) => p !== perm) : [...role.permissions, perm] };
    setRoles(roles.map((r) => (r.id === role.id ? updated : r)));
    setEditing(updated);
  };

  const applyPreset = (presetKey: string, setter: (perms: string[]) => void) => {
    const p = presets[presetKey];
    if (p) { setter(p.permissions); toast({ title: "Preset Applied", description: p.label }); }
  };

  const handleCreate = () => {
    if (!newRole.name?.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    const r: Role = {
      id: `r-${Date.now()}`,
      name: newRole.name,
      department: (newRole.department as Dept) || "Core Team",
      preset: newRole.preset,
      description: newRole.description || "",
      permissions: newRole.permissions || [],
    };
    setRoles([...roles, r]);
    setCreating(false);
    setNewRole({ department: "Core Team", permissions: [] });
    toast({ title: "Role Created", description: `${r.name} added under ${r.department}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground text-sm mt-1">Department-based roles with permission presets</p>
        </div>
        <Button className="gap-2" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> New Role</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-6">
        {departments.map((d) => {
          const meta = departmentMeta[d];
          const Icon = meta.icon;
          const count = roles.filter((r) => r.department === d).length;
          return (
            <Card key={d} className="cursor-pointer hover:border-primary/40 transition" onClick={() => setActiveTab(d)}>
              <CardContent className="pt-4 pb-3">
                <Icon className={`h-4 w-4 ${meta.color}`} />
                <p className="text-xs text-muted-foreground mt-2">{d}</p>
                <p className="text-lg font-bold mt-0.5">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All ({roles.length})</TabsTrigger>
          {departments.map((d) => <TabsTrigger key={d} value={d}>{d}</TabsTrigger>)}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Preset</TableHead>
                    <TableHead className="text-center">Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id} className="group">
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.description}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{r.department}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.preset || "Custom"}</TableCell>
                      <TableCell className="text-center text-sm">{r.permissions.length} / {ALL_PERMS.length}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setEditing(r)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit role */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.name}</DialogTitle>
            <DialogDescription>{editing?.department} · {editing?.permissions.length} permissions</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Label className="text-xs">Apply preset:</Label>
                {Object.entries(presets).map(([k, p]) => (
                  <Button key={k} size="sm" variant="outline" onClick={() => {
                    const updated = { ...editing, permissions: p.permissions, preset: k };
                    setRoles(roles.map((r) => (r.id === editing.id ? updated : r)));
                    setEditing(updated);
                    toast({ title: "Preset Applied", description: p.label });
                  }}>{p.label}</Button>
                ))}
              </div>
              <div className="space-y-4">
                {Object.entries(permissionGroups).map(([group, perms]) => (
                  <div key={group} className="rounded-lg border p-3">
                    <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase">{group}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {perms.map((p) => (
                        <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox checked={editing.permissions.includes(p)} onCheckedChange={() => togglePerm(editing, p)} />
                          {p}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Close</Button>
            <Button onClick={() => { toast({ title: "Role Saved", description: `${editing?.name} updated` }); setEditing(null); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create role */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Role</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Role name</Label>
                <Input placeholder="e.g. Regional Sales Lead" value={newRole.name || ""} onChange={(e) => setNewRole({ ...newRole, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Department</Label>
                <Select value={newRole.department} onValueChange={(v) => setNewRole({ ...newRole, department: v as Dept })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Input placeholder="One-line summary" value={newRole.description || ""} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Start from preset</Label>
              <Select value={newRole.preset} onValueChange={(v) => { setNewRole({ ...newRole, preset: v, permissions: presets[v].permissions }); }}>
                <SelectTrigger><SelectValue placeholder="Select preset (optional)" /></SelectTrigger>
                <SelectContent>{Object.entries(presets).map(([k, p]) => <SelectItem key={k} value={k}>{p.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">Selected {newRole.permissions?.length || 0} permissions. Fine-tune after creation.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
