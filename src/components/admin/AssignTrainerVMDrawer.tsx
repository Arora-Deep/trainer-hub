import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNodeVMStore } from "@/stores/nodeVMStore";
import { useBatchStore } from "@/stores/batchStore";
import { useLabStore } from "@/stores/labStore";
import { toast } from "@/hooks/use-toast";
import { Search, Server, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchId: string;
  batchName: string;
  customerName: string;
}

export function AssignTrainerVMDrawer({ open, onOpenChange, batchId, batchName, customerName }: Props) {
  const { vms, assign } = useNodeVMStore();
  const { assignTrainerVMDirect } = useBatchStore();
  const { templates } = useLabStore();

  const [mode, setMode] = useState<"pool" | "new">("pool");
  const [query, setQuery] = useState("");
  const [pickedVmId, setPickedVmId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // Create-new form
  const [newName, setNewName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [region, setRegion] = useState("ap-south-1");

  const available = useMemo(
    () => vms.filter((v) => !v.customerId && v.status === "running"),
    [vms]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return available.slice(0, 20);
    return available.filter(
      (v) =>
        v.id.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.ipAddress.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [available, query]);

  const picked = vms.find((v) => v.id === pickedVmId);

  const reset = () => {
    setMode("pool");
    setQuery("");
    setPickedVmId(null);
    setNote("");
    setNewName("");
    setTemplateId("");
    setRegion("ap-south-1");
  };

  const handleAssignFromPool = () => {
    if (!picked) return;
    assign([picked.id], {
      customerId: `batch-${batchId}`,
      customerName,
      batchId,
      batchName,
    });
    assignTrainerVMDirect(batchId, {
      vmName: picked.name,
      ipAddress: picked.ipAddress,
      poolVmId: picked.id,
      credentials: { username: "root", password: `Tr@in${Math.random().toString(36).slice(2, 8)}!`, sshPort: 22 },
      note,
    });
    toast({
      title: "Trainer VM assigned",
      description: `${picked.name} (${picked.ipAddress}) handed to trainer for ${batchName}.`,
    });
    reset();
    onOpenChange(false);
  };

  const handleCreateAndAssign = () => {
    if (!newName || !templateId) {
      toast({ title: "Missing fields", description: "VM name and template are required.", variant: "destructive" });
      return;
    }
    const ip = `10.9.${Math.floor(Math.random() * 200) + 20}.${Math.floor(Math.random() * 240) + 10}`;
    assignTrainerVMDirect(batchId, {
      vmName: newName,
      ipAddress: ip,
      note,
      credentials: { username: "root", password: `Tr@in${Math.random().toString(36).slice(2, 8)}!`, sshPort: 22 },
    });
    toast({
      title: "Trainer VM created & assigned",
      description: `${newName} (${ip}) is being handed to trainer for ${batchName}.`,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Assign Trainer VM Directly</SheetTitle>
          <SheetDescription>
            Skip provisioning, configuration, snapshotting, and cloning. Hand a ready VM straight to the trainer for{" "}
            <span className="font-medium">{batchName}</span>.
          </SheetDescription>
        </SheetHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as "pool" | "new")} className="mt-5">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="pool">Pick from pool</TabsTrigger>
            <TabsTrigger value="new">Create new</TabsTrigger>
          </TabsList>

          <TabsContent value="pool" className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by VM ID, name, or IP..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="rounded-md border max-h-72 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>VM</TableHead>
                    <TableHead>Node</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">No matching unassigned VMs</TableCell></TableRow>
                  )}
                  {filtered.map((v) => (
                    <TableRow
                      key={v.id}
                      className={`cursor-pointer ${pickedVmId === v.id ? "bg-primary/5" : ""}`}
                      onClick={() => setPickedVmId(v.id)}
                    >
                      <TableCell>{pickedVmId === v.id ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Server className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{v.name}</div>
                        <div className="text-xs text-muted-foreground">{v.id} · {v.vcpu}vCPU / {v.ramGB}GB</div>
                      </TableCell>
                      <TableCell className="text-xs">{v.node}</TableCell>
                      <TableCell className="text-xs font-mono">{v.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {picked && (
              <div className="rounded-lg border bg-muted/30 p-3 text-xs space-y-0.5">
                <div className="flex items-center gap-2 font-medium text-sm"><CheckCircle2 className="h-4 w-4 text-green-600" />{picked.name}</div>
                <div className="text-muted-foreground">{picked.os} · {picked.region} · {picked.ipAddress}</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new" className="space-y-3 mt-4">
            <div className="space-y-1.5">
              <Label className="text-xs">VM name</Label>
              <Input placeholder="e.g. trainer-k8s-b14" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Template</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger><SelectValue placeholder="Pick a lab template" /></SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name} · {t.vcpus}vCPU / {t.memory}GB</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ap-south-1">ap-south-1 (Mumbai)</SelectItem>
                  <SelectItem value="us-east-1">us-east-1 (Virginia)</SelectItem>
                  <SelectItem value="us-west-2">us-west-2 (Oregon)</SelectItem>
                  <SelectItem value="eu-west-1">eu-west-1 (Dublin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">Auto-placed on the least-stressed node in the selected region.</p>
          </TabsContent>
        </Tabs>

        <div className="space-y-1.5 mt-4">
          <Label className="text-xs">Assignment note (optional, audit log)</Label>
          <Textarea
            rows={2}
            placeholder="e.g. Customer provided pre-configured image, handing directly to trainer."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-6">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
          {mode === "pool" ? (
            <Button disabled={!picked} onClick={handleAssignFromPool}>Assign trainer VM</Button>
          ) : (
            <Button disabled={!newName || !templateId} onClick={handleCreateAndAssign}>Create & assign</Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
