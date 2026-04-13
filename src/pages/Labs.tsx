import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLabStore } from "@/stores/labStore";
import { Search, Boxes, Cpu, HardDrive, Clock, Server } from "lucide-react";

export default function Labs() {
  const navigate = useNavigate();
  const { templates } = useLabStore();
  const [search, setSearch] = useState("");

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Lab Templates"
        description="Browse available lab templates for use in batches"
        breadcrumbs={[{ label: "Lab Templates" }]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Boxes className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{templates.length}</p>
              <p className="text-xs text-muted-foreground">Total Templates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <Server className="h-5 w-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{templates.filter(t => t.type === "Linux").length}</p>
              <p className="text-xs text-muted-foreground">Linux Templates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[hsl(var(--warning))]/10 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-[hsl(var(--warning))]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{templates.filter(t => t.type === "Windows").length}</p>
              <p className="text-xs text-muted-foreground">Windows Templates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-semibold">Available Templates</CardTitle>
            <CardDescription>These templates can be used when configuring VMs in batch creation</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64 bg-muted/40 border-0 rounded-lg"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-medium">Template Name</TableHead>
                <TableHead className="font-medium">Type</TableHead>
                <TableHead className="font-medium">OS</TableHead>
                <TableHead className="font-medium">Resources</TableHead>
                <TableHead className="font-medium">Runtime Limit</TableHead>
                <TableHead className="font-medium">Category</TableHead>
                <TableHead className="font-medium">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((template) => (
                <TableRow key={template.id} className="table-row-premium">
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={template.type === "Linux" ? "success" : "info"}
                      label={template.type}
                      dot={false}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {template.os} {template.osVersion}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Cpu className="h-3 w-3" />{template.vcpus} vCPU</span>
                      <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" />{template.memory}GB</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{template.runtimeLimit} min</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">{template.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{template.lastUpdated}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No templates found matching "{search}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
