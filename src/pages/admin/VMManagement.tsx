import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Server } from "lucide-react";

const vms = [
  { id: "vm-001", name: "aws-lab-01", customer: "TechSkills Academy", region: "ap-south-1", status: "running", cpu: "45%", ram: "62%", uptime: "3d 14h" },
  { id: "vm-002", name: "k8s-cluster-01", customer: "CodeCraft Institute", region: "us-east-1", status: "running", cpu: "78%", ram: "85%", uptime: "1d 6h" },
  { id: "vm-003", name: "azure-lab-03", customer: "CloudLearn Pro", region: "eu-west-1", status: "stopped", cpu: "0%", ram: "0%", uptime: "-" },
  { id: "vm-004", name: "docker-env-02", customer: "TechSkills Academy", region: "ap-south-1", status: "running", cpu: "22%", ram: "34%", uptime: "5d 2h" },
  { id: "vm-005", name: "ml-gpu-01", customer: "SkillBridge Labs", region: "us-west-2", status: "error", cpu: "0%", ram: "0%", uptime: "-" },
  { id: "vm-006", name: "terraform-lab-01", customer: "DevOps Training Co", region: "us-west-2", status: "provisioning", cpu: "-", ram: "-", uptime: "-" },
];

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  stopped: "bg-muted text-muted-foreground",
  error: "bg-destructive/10 text-destructive",
  provisioning: "bg-warning/10 text-warning",
};

export default function AdminVMManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">VM Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor all VMs across customers</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total VMs", value: "125", color: "text-foreground" },
          { label: "Running", value: "98", color: "text-success" },
          { label: "Stopped", value: "22", color: "text-muted-foreground" },
          { label: "Errors", value: "5", color: "text-destructive" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search VMs..." className="pl-9" />
            </div>
            <Select><SelectTrigger className="w-40"><SelectValue placeholder="All regions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                <SelectItem value="ap-south-1">ap-south-1</SelectItem>
                <SelectItem value="us-east-1">us-east-1</SelectItem>
                <SelectItem value="eu-west-1">eu-west-1</SelectItem>
              </SelectContent>
            </Select>
            <Select><SelectTrigger className="w-36"><SelectValue placeholder="All status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
                <SelectItem value="error">Error</SelectItem>
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
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">CPU</TableHead>
                <TableHead className="text-right">RAM</TableHead>
                <TableHead className="text-right">Uptime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vms.map((vm) => (
                <TableRow key={vm.id}>
                  <TableCell><div className="flex items-center gap-2"><Server className="h-4 w-4 text-muted-foreground" /><span className="font-medium text-sm">{vm.name}</span></div></TableCell>
                  <TableCell className="text-sm">{vm.customer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vm.region}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[vm.status]}`}>{vm.status}</Badge></TableCell>
                  <TableCell className="text-right text-sm">{vm.cpu}</TableCell>
                  <TableCell className="text-right text-sm">{vm.ram}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{vm.uptime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
