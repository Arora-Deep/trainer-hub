import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Edit, Ban, Plus, Search, Mail, Key, CheckCircle2 } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  status: "active" | "disabled" | "invited";
  twoFA: boolean;
};

const seed: User[] = [
  { id: "u1", name: "Super Admin", email: "admin@cloudadda.com", role: "CEO", department: "C-Suite", lastLogin: "5 min ago", status: "active", twoFA: true },
  { id: "u2", name: "Ravi Menon", email: "ravi@cloudadda.com", role: "Support L2", department: "Support", lastLogin: "30 min ago", status: "active", twoFA: true },
  { id: "u3", name: "Anita Rao", email: "anita@cloudadda.com", role: "Finance Lead", department: "Finance", lastLogin: "2 hours ago", status: "active", twoFA: false },
  { id: "u4", name: "Devansh K.", email: "devansh@cloudadda.com", role: "Head of Infra", department: "IT / Infra", lastLogin: "1 hour ago", status: "active", twoFA: true },
  { id: "u5", name: "Priya Shah", email: "priya@cloudadda.com", role: "Sales Manager", department: "Sales", lastLogin: "Yesterday", status: "active", twoFA: false },
  { id: "u6", name: "Karan Doshi", email: "karan@cloudadda.com", role: "Customer Success", department: "Core Team", lastLogin: "10 min ago", status: "active", twoFA: true },
  { id: "u7", name: "Old Admin", email: "old@cloudadda.com", role: "Auditor", department: "Core Team", lastLogin: "3 months ago", status: "disabled", twoFA: false },
  { id: "u8", name: "Neha Iyer", email: "neha@cloudadda.com", role: "Support L1", department: "Support", lastLogin: "—", status: "invited", twoFA: false },
];

const departments = ["C-Suite", "IT / Infra", "Core Team", "Sales", "Finance", "Support"];
const roles = ["CEO", "CTO", "Head of Infra", "Ops Engineer", "Customer Success", "Sales Rep", "Sales Manager", "Finance Lead", "Accountant", "Support L1", "Support L2", "Auditor"];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  disabled: "bg-muted text-muted-foreground",
  invited: "bg-warning/10 text-warning",
};

export default function PlatformUsers() {
  const [users, setUsers] = useState<User[]>(seed);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [status, setStatus] = useState("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: roles[0], department: departments[0] });

  const filtered = useMemo(() => users.filter((u) =>
    (dept === "all" || u.department === dept) &&
    (status === "all" || u.status === status) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()))
  ), [users, search, dept, status]);

  const handleInvite = () => {
    if (!form.name || !form.email) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    const u: User = { id: `u-${Date.now()}`, name: form.name, email: form.email, role: form.role, department: form.department, lastLogin: "—", status: "invited", twoFA: false };
    setUsers([u, ...users]);
    setInviteOpen(false);
    setForm({ name: "", email: "", role: roles[0], department: departments[0] });
    toast({ title: "Invitation Sent", description: `${u.email} will receive a setup email.` });
  };

  const toggleStatus = (u: User) => {
    const newStatus = u.status === "active" ? "disabled" : "active";
    setUsers(users.map((x) => x.id === u.id ? { ...x, status: newStatus } : x));
    toast({ title: newStatus === "active" ? "User Enabled" : "User Disabled", description: u.email });
  };

  const resendInvite = (u: User) => toast({ title: "Invite Resent", description: `Setup link sent to ${u.email}` });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Users</h1>
          <p className="text-muted-foreground text-sm mt-1">CloudAdda admin & staff accounts ({users.length})</p>
        </div>
        <Button className="gap-2" onClick={() => setInviteOpen(true)}><Plus className="h-4 w-4" /> Invite User</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Active</p><p className="text-xl font-bold text-success">{users.filter((u) => u.status === "active").length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Invited</p><p className="text-xl font-bold text-warning">{users.filter((u) => u.status === "invited").length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Disabled</p><p className="text-xl font-bold text-muted-foreground">{users.filter((u) => u.status === "disabled").length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">2FA Enabled</p><p className="text-xl font-bold">{users.filter((u) => u.twoFA).length} / {users.length}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, role..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7"><AvatarFallback className="text-xs">{u.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{u.role}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.department}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.lastLogin}</TableCell>
                  <TableCell>{u.twoFA ? <CheckCircle2 className="h-4 w-4 text-success" /> : <span className="text-xs text-muted-foreground">Off</span>}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[u.status]}`}>{u.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition">
                      <Button variant="ghost" size="sm" title="Edit" onClick={() => setEditing(u)}><Edit className="h-3 w-3" /></Button>
                      {u.status === "invited" && <Button variant="ghost" size="sm" title="Resend invite" onClick={() => resendInvite(u)}><Mail className="h-3 w-3" /></Button>}
                      <Button variant="ghost" size="sm" title="Force reset password" onClick={() => toast({ title: "Reset Sent", description: `Reset link sent to ${u.email}` })}><Key className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title={u.status === "active" ? "Disable" : "Enable"} onClick={() => toggleStatus(u)}><Ban className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invite */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Platform User</DialogTitle>
            <DialogDescription>A setup email with magic-link will be sent. The user picks their own password on first login.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Full name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rohan Mehta" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Work email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@cloudadda.com" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="space-y-1.5"><Label className="text-xs">Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1.5"><Label className="text-xs">Name</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Department</Label>
                  <Select value={editing.department} onValueChange={(v) => setEditing({ ...editing, department: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div className="space-y-1.5"><Label className="text-xs">Role</Label>
                  <Select value={editing.role} onValueChange={(v) => setEditing({ ...editing, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => { if (editing) { setUsers(users.map((u) => u.id === editing.id ? editing : u)); toast({ title: "User Updated", description: editing.email }); } setEditing(null); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
