import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useLabStore } from "@/stores/labStore";
import { useCustomerStore } from "@/stores/customerStore";
import { toast } from "@/hooks/use-toast";
import { Search, Server, Plus, Power, RotateCw, Trash2, Camera } from "lucide-react";

type VM = {
  id: string;
  name: string;
  customer: string;
  region: string;
  status: "running" | "stopped" | "error" | "provisioning";
  cpu: string;
  ram: string;
  uptime: string;
  template?: string;
  node?: string;
  purpose?: string;
};

const seedVMs: VM[] = [
  { id: "vm-001", name: "aws-lab-01", customer: "TechSkills Academy", region: "ap-south-1", status: "running", cpu: "45%", ram: "62%", uptime: "3d 14h", template: "AWS Sandbox", node: "node-mum-01", purpose: "Batch VM" },
  { id: "vm-002", name: "k8s-cluster-01", customer: "CodeCraft Institute", region: "us-east-1", status: "running", cpu: "78%", ram: "85%", uptime: "1d 6h", template: "K8s Lab", node: "node-nyc-02", purpose: "Batch VM" },
  { id: "vm-003", name: "azure-lab-03", customer: "CloudLearn Pro", region: "eu-west-1", status: "stopped", cpu: "0%", ram: "0%", uptime: "-", template: "Azure Sandbox", node: "node-dub-01", purpose: "Batch VM" },
  { id: "vm-004", name: "docker-env-02", customer: "TechSkills Academy", region: "ap-south-1", status: "running", cpu: "22%", ram: "34%", uptime: "5d 2h", template: "Docker Lab", node: "node-mum-02", purpose: "Trainer Master" },
  { id: "vm-005", name: "ml-gpu-01", customer: "SkillBridge Labs", region: "us-west-2", status: "error", cpu: "0%", ram: "0%", uptime: "-", template: "ML GPU", node: "node-pdx-01", purpose: "Standalone" },
  { id: "vm-006", name: "terraform-lab-01", customer: "DevOps Training Co", region: "us-west-2", status: "provisioning", cpu: "-", ram: "-", uptime: "-", template: "Terraform Lab", node: "node-pdx-02", purpose: "Batch VM" },
];

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  stopped: "bg-muted text-muted-foreground",
  error: "bg-destructive/10 text-destructive",
  provisioning: "bg-warning/10 text-warning",
};

export default function AdminVMManagement() {
  const { templates } = useLabStore();
  const { customers } = useCustomerStore();
  const [vms, setVms] = useState<VM[]>(seedVMs);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [purpose, setPurpose] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<VM | null>(null);

  const [form, setForm] = useState({
    name: "",
    templateId: "",
    customerId: "",
    region: "ap-south-1",
    purpose: "Standalone",
    autoPlacement: true,
    node: "",
    notes: "",
  });

  const filtered = useMemo(() => vms.filter((v) =>
    (region === "all" || v.region === region) &&
    (status === "all" || v.status === status) &&
    (purpose === "all" || v.purpose === purpose) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.customer.toLowerCase().includes(search.toLowerCase()))
  ), [vms, search, region, status, purpose]);

  const stats = {
    total: vms.length,
    running: vms.filter((v) => v.status === "running").length,
    stopped: vms.filter((v) => v.status === "stopped").length,
    errors: vms.filter((v) => v.status === "error").length,
  };

  const handleCreate = () => {
    if (!form.name || !form.templateId) { toast({ title: "Missing fields", description: "Name and template required.", variant: "destructive" }); return; }
    const tpl = templates.find((t) => t.id === form.templateId);
    const cust = customers.find((c) => c.id === form.customerId);
    const newVM: VM = {
      id: `vm-${Date.now()}`, name: form.name, customer: cust?.name || "—", region: form.region,
      status: "provisioning", cpu: "-", ram: "-", uptime: "-",
      template: tpl?.name, node: form.autoPlacement ? "auto-placed" : form.node, purpose: form.purpose,
    };
    setVms((prev) => [newVM, ...prev]);
    setCreateOpen(false);
    setForm({ name: "", templateId: "", customerId: "", region: "ap-south-1", purpose: "Standalone", autoPlacement: true, node: "", notes: "" });
    toast({ title: "VM Provisioning", description: `${newVM.name} queued on ${newVM.node}` });
    setTimeout(() => setVms((prev) => prev.map((v) => v.id === newVM.id ? { ...v, status: "running", cpu: "5%", ram: "12%", uptime: "0m" } : v)), 2500);
  };

  const lifecycle = (vm: VM, action: "start" | "stop" | "restart" | "snapshot" | "delete") => {
    const map = {
      start: { msg: `${vm.name} started`, patch: { status: "running" as const } },
      stop: { msg: `${vm.name} stopped`, patch: { status: "stopped" as const, cpu: "0%", ram: "0%", uptime: "-" } },
      restart: { msg: `${vm.name} restarted`, patch: { status: "running" as const } },
      snapshot: { msg: `Snapshot taken for ${vm.name}`, patch: {} },
      delete: { msg: `${vm.name} deleted`, patch: null },
    };
    if (action === "delete") setVms((prev) => prev.filter((v) => v.id !== vm.id));
    else setVms((prev) => prev.map((v) => v.id === vm.id ? { ...v, ...map[action].patch } : v));
    toast({ title: "Action Complete", description: map[action].msg });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">VM Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor all VMs across customers and create standalone VMs</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Create VM</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total VMs", value: stats.total, color: "text-foreground" },
          { label: "Running", value: stats.running, color: "text-success" },
          { label: "Stopped", value: stats.stopped, color: "text-muted-foreground" },
          { label: "Errors", value: stats.errors, color: "text-destructive" },
        ].map((s) => (
          <Card key={s.label}><CardContent className="pt-6"><p className="text-sm text-muted-foreground">{s.label}</p><p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search VMs or customer..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                <SelectItem value="ap-south-1">ap-south-1</SelectItem>
                <SelectItem value="us-east-1">us-east-1</SelectItem>
                <SelectItem value="us-west-2">us-west-2</SelectItem>
                <SelectItem value="eu-west-1">eu-west-1</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="provisioning">Provisioning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All purposes</SelectItem>
                <SelectItem value="Batch VM">Batch VM</SelectItem>
                <SelectItem value="Trainer Master">Trainer Master</SelectItem>
                <SelectItem value="Standalone">Standalone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>VM</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Region / Node</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">CPU</TableHead>
                <TableHead className="text-right">RAM</TableHead>
                <TableHead className="text-right">Uptime</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((vm) => (
                <TableRow key={vm.id} className="group cursor-pointer" onClick={() => setSelected(vm)}>
                  <TableCell><div className="flex items-center gap-2"><Server className="h-4 w-4 text-muted-foreground" /><div><span className="font-medium text-sm">{vm.name}</span><p className="text-xs text-muted-foreground">{vm.template}</p></div></div></TableCell>
                  <TableCell className="text-sm">{vm.customer}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{vm.purpose}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vm.region}<br/><span className="text-xs">{vm.node}</span></TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[vm.status]}`}>{vm.status}</Badge></TableCell>
                  <TableCell className="text-right text-sm">{vm.cpu}</TableCell>
                  <TableCell className="text-right text-sm">{vm.ram}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{vm.uptime}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <Button variant="ghost" size="sm" title={vm.status === "running" ? "Stop" : "Start"} onClick={() => lifecycle(vm, vm.status === "running" ? "stop" : "start")}><Power className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Restart" onClick={() => lifecycle(vm, "restart")}><RotateCw className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Snapshot" onClick={() => lifecycle(vm, "snapshot")}><Camera className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Delete" onClick={() => lifecycle(vm, "delete")}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create VM */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Standalone VM</DialogTitle>
            <DialogDescription>For one-off provisioning outside a batch (e.g. demos, internal use, customer requests).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">VM name</Label>
                <Input placeholder="e.g. demo-lab-01" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Purpose</Label>
                <Select value={form.purpose} onValueChange={(v) => setForm({ ...form, purpose: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standalone">Standalone / Demo</SelectItem>
                    <SelectItem value="Trainer Master">Trainer Master</SelectItem>
                    <SelectItem value="Internal">Internal Use</SelectItem>
                  </SelectContent>
                </Select></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Template</Label>
              <Select value={form.templateId} onValueChange={(v) => setForm({ ...form, templateId: v })}>
                <SelectTrigger><SelectValue placeholder="Pick a lab template" /></SelectTrigger>
                <SelectContent>
                  {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} · {t.vcpus}vCPU / {t.memory}GB</SelectItem>)}
                </SelectContent>
              </Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Customer (optional)</Label>
                <Select value={form.customerId} onValueChange={(v) => setForm({ ...form, customerId: v })}>
                  <SelectTrigger><SelectValue placeholder="No customer" /></SelectTrigger>
                  <SelectContent>{customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="space-y-1.5"><Label className="text-xs">Region</Label>
                <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ap-south-1">ap-south-1 (Mumbai)</SelectItem>
                    <SelectItem value="us-east-1">us-east-1 (Virginia)</SelectItem>
                    <SelectItem value="us-west-2">us-west-2 (Oregon)</SelectItem>
                    <SelectItem value="eu-west-1">eu-west-1 (Dublin)</SelectItem>
                  </SelectContent>
                </Select></div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Auto-place on least-stressed node</p>
                <p className="text-xs text-muted-foreground">Uses scoring (CPU 40% / RAM 40% / Disk 20%)</p>
              </div>
              <Switch checked={form.autoPlacement} onCheckedChange={(c) => setForm({ ...form, autoPlacement: c })} />
            </div>
            {!form.autoPlacement && (
              <div className="space-y-1.5"><Label className="text-xs">Manual node</Label>
                <Select value={form.node} onValueChange={(v) => setForm({ ...form, node: v })}>
                  <SelectTrigger><SelectValue placeholder="Pick node" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="node-mum-01">node-mum-01 (42% load)</SelectItem>
                    <SelectItem value="node-mum-02">node-mum-02 (61% load)</SelectItem>
                    <SelectItem value="node-nyc-01">node-nyc-01 (28% load)</SelectItem>
                  </SelectContent>
                </Select></div>
            )}
            <div className="space-y-1.5"><Label className="text-xs">Notes (optional)</Label>
              <Input placeholder="Why is this VM being created?" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create VM</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle><DialogDescription>{selected?.template} · {selected?.purpose}</DialogDescription></DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border p-3">
                <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium">{selected.customer}</p></div>
                <div><p className="text-xs text-muted-foreground">Region</p><p className="font-medium">{selected.region}</p></div>
                <div><p className="text-xs text-muted-foreground">Node</p><p className="font-medium">{selected.node}</p></div>
                <div><p className="text-xs text-muted-foreground">Uptime</p><p className="font-medium">{selected.uptime}</p></div>
                <div><p className="text-xs text-muted-foreground">CPU</p><p className="font-medium">{selected.cpu}</p></div>
                <div><p className="text-xs text-muted-foreground">RAM</p><p className="font-medium">{selected.ram}</p></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { lifecycle(selected, selected.status === "running" ? "stop" : "start"); setSelected(null); }}>{selected.status === "running" ? "Stop" : "Start"}</Button>
                <Button size="sm" variant="outline" onClick={() => { lifecycle(selected, "restart"); setSelected(null); }}>Restart</Button>
                <Button size="sm" variant="outline" onClick={() => { lifecycle(selected, "snapshot"); setSelected(null); }}>Snapshot</Button>
                <Button size="sm" variant="destructive" className="ml-auto" onClick={() => { lifecycle(selected, "delete"); setSelected(null); }}>Delete</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
