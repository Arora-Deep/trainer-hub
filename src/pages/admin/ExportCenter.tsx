import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, Clock } from "lucide-react";

const exports = [
  { name: "Tenant Usage - Feb 2026", type: "Usage", format: "CSV", status: "completed", createdAt: "2026-02-28 10:00", size: "2.4 MB" },
  { name: "Audit Logs - Feb 2026", type: "Audit", format: "CSV", status: "completed", createdAt: "2026-02-28 08:00", size: "8.1 MB" },
  { name: "Invoice Export - Q1", type: "Billing", format: "PDF", status: "processing", createdAt: "2026-02-28 16:00", size: "—" },
  { name: "Session Logs - Weekly", type: "Access", format: "CSV", status: "scheduled", createdAt: "Every Monday 06:00", size: "~5 MB" },
];

export default function ExportCenter() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Export Center</h1><p className="text-muted-foreground text-sm mt-1">Data exports and scheduled reports</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Clock className="h-3.5 w-3.5" /> Schedule Export</Button>
          <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> New Export</Button>
        </div>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Export Name</TableHead><TableHead className="text-xs">Type</TableHead>
            <TableHead className="text-xs">Format</TableHead><TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs">Created</TableHead><TableHead className="text-xs">Size</TableHead>
            <TableHead className="text-xs w-10"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {exports.map((e, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-sm">{e.name}</TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px]">{e.type}</Badge></TableCell>
                <TableCell className="text-xs">{e.format}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${e.status === "completed" ? "bg-success/10 text-success" : e.status === "processing" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"}`}>{e.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.createdAt}</TableCell>
                <TableCell className="text-xs">{e.size}</TableCell>
                <TableCell>{e.status === "completed" && <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
