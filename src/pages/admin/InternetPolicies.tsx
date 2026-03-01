import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

const policies = [
  { name: "Default Open", mode: "open", domains: "All", tenants: 4, status: "active" },
  { name: "DevOps Allowlist", mode: "allowlist", domains: "github.com, docker.io, registry.k8s.io, pypi.org", tenants: 2, status: "active" },
  { name: "Exam Lockdown", mode: "blocked", domains: "None", tenants: 1, status: "active" },
  { name: "ML Research", mode: "allowlist", domains: "huggingface.co, pypi.org, conda.io, github.com", tenants: 1, status: "active" },
];

export default function InternetPolicies() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Internet Policies</h1><p className="text-muted-foreground text-sm mt-1">Internet access control</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Policy</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Policy Name</TableHead><TableHead className="text-xs">Mode</TableHead>
            <TableHead className="text-xs">Domains</TableHead><TableHead className="text-xs text-right">Tenants</TableHead>
            <TableHead className="text-xs">Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {policies.map(p => (
              <TableRow key={p.name} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium text-sm">{p.name}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${p.mode === "open" ? "bg-success/10 text-success" : p.mode === "blocked" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{p.mode}</Badge></TableCell>
                <TableCell className="text-xs max-w-[300px] truncate text-muted-foreground">{p.domains}</TableCell>
                <TableCell className="text-xs text-right">{p.tenants}</TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px] bg-success/10 text-success capitalize">{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
