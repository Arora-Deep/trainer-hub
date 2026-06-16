import { useState, useMemo } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLabStore } from "@/stores/labStore";
import { useSandboxStore, type SandboxStatus } from "@/stores/sandboxVMStore";
import { Search, Boxes, Cpu, HardDrive, Clock, Server, Sparkles, ExternalLink } from "lucide-react";
import { RequestTemplateSheet } from "@/components/sandbox/RequestTemplateSheet";
import { cn } from "@/lib/utils";

const statusStyle: Record<SandboxStatus, string> = {
  requested: "bg-amber-500/10 text-amber-600",
  provisioning: "bg-blue-500/10 text-blue-600",
  ready: "bg-violet-500/10 text-violet-600",
  validation: "bg-cyan-500/10 text-cyan-600",
  snapshot: "bg-indigo-500/10 text-indigo-600",
  published: "bg-green-500/10 text-green-600",
  rejected: "bg-red-500/10 text-red-600",
};

const statusLabel: Record<SandboxStatus, string> = {
  requested: "Requested",
  provisioning: "Provisioning",
  ready: "Ready — configure",
  validation: "Awaiting snapshot",
  snapshot: "Snapshotting",
  published: "Published",
  rejected: "Rejected",
};

export default function Labs() {
  const navigate = useNavigate();
  const { templates } = useLabStore();
  const { items: sandboxItems } = useSandboxStore();
  const [search, setSearch] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);

  // Filter to current trainer (mock)
  const myRequests = useMemo(
    () => sandboxItems.filter((i) => i.trainerEmail === "john@techskills.com" || i.trainerName === "John Smith"),
    [sandboxItems],
  );
  const pendingCount = myRequests.filter((i) => i.status !== "published" && i.status !== "rejected").length;

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Lab Templates"
        description="Browse available lab templates or request a new one from the CloudAdda team"
        breadcrumbs={[{ label: "Lab Templates" }]}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setRequestOpen(true)}>
            <Sparkles className="h-3.5 w-3.5" /> Request a template
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Boxes className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{templates.length}</p>
              <p className="text-xs text-muted-foreground">Available templates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <Server className="h-5 w-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{templates.filter((t) => t.source === "sandbox").length}</p>
              <p className="text-xs text-muted-foreground">Built from your sandboxes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending requests</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog" className="text-xs">Catalog</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs gap-1.5">
            My requests
            {pendingCount > 0 && <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">{pendingCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Available templates</CardTitle>
                <CardDescription>These templates can be used when configuring labs in batches or courses</CardDescription>
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
                    <TableHead className="font-medium">Template name</TableHead>
                    <TableHead className="font-medium">Type</TableHead>
                    <TableHead className="font-medium">OS</TableHead>
                    <TableHead className="font-medium">Resources</TableHead>
                    <TableHead className="font-medium">Runtime limit</TableHead>
                    <TableHead className="font-medium">Source</TableHead>
                    <TableHead className="font-medium">Last updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((template) => (
                    <TableRow key={template.id} className="table-row-premium">
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={template.type === "Linux" ? "success" : "info"} label={template.type} dot={false} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{template.os} {template.osVersion}</TableCell>
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
                        {template.source === "sandbox" ? (
                          <Badge variant="outline" className="text-[10px] gap-1"><Sparkles className="h-2.5 w-2.5" />From your sandbox</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">Built-in</Badge>
                        )}
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
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Your template requests</CardTitle>
                <CardDescription>Track sandbox VMs and templates the CloudAdda team is building for you</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => navigate("/sandbox-vms")}>
                <ExternalLink className="h-3.5 w-3.5" /> Open sandbox workspace
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-medium">Purpose</TableHead>
                    <TableHead className="font-medium">Specs</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Published template</TableHead>
                    <TableHead className="font-medium">Requested</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.map((it) => (
                    <TableRow key={it.id} className="cursor-pointer" onClick={() => navigate("/sandbox-vms")}>
                      <TableCell>
                        <div className="text-sm font-medium">{it.purpose}</div>
                        {it.targetCourse && <div className="text-[10px] text-muted-foreground">{it.targetCourse}</div>}
                      </TableCell>
                      <TableCell className="text-xs">{it.os} · {it.vcpu}vCPU · {it.ramGB}GB</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("text-[10px]", statusStyle[it.status])}>{statusLabel[it.status]}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {it.templateName ? <Badge variant="outline" className="text-[10px]">{it.templateName}</Badge> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(it.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {myRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                        No template requests yet. Click "Request a template" to start.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RequestTemplateSheet open={requestOpen} onOpenChange={setRequestOpen} />
    </div>
  );
}
