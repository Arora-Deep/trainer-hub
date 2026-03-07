import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Download, Search, CalendarDays, Eye, FileText } from "lucide-react";

const completed = [
  { batch: "Docker Batch #3", customer: "SkillBridge Labs", seats: 20, duration: "31 days", labHours: 480, completion: "2026-02-05", template: "Docker Compose" },
  { batch: "Linux Admin #19", customer: "DevOps Academy", seats: 32, duration: "30 days", labHours: 720, completion: "2026-01-20", template: "Linux + Networking" },
  { batch: "Python ML #4", customer: "DataScience Bootcamp", seats: 25, duration: "28 days", labHours: 560, completion: "2026-01-15", template: "ML GPU Lab v1" },
  { batch: "AWS Cert #5", customer: "Corporate L&D Co", seats: 40, duration: "45 days", labHours: 1200, completion: "2025-12-30", template: "AWS Simulation" },
  { batch: "K8s Fundamentals #10", customer: "DevOps Academy", seats: 28, duration: "21 days", labHours: 450, completion: "2025-12-15", template: "Kubernetes Lab v2" },
  { batch: "Terraform Batch #1", customer: "SkillBridge Labs", seats: 15, duration: "14 days", labHours: 180, completion: "2025-11-30", template: "Linux + Networking" },
];

const customers = [...new Set(completed.map(c => c.customer))];
const templates = [...new Set(completed.map(c => c.template))];

export default function CompletedBatches() {
  const [search, setSearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filtered = completed.filter(b => {
    if (search && !b.batch.toLowerCase().includes(search.toLowerCase())) return false;
    if (customerFilter !== "all" && b.customer !== customerFilter) return false;
    if (templateFilter !== "all" && b.template !== templateFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Completed Batches</h1>
          <p className="text-muted-foreground text-sm mt-1">Archive of past training batches</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search batches..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Customer" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={templateFilter} onValueChange={setTemplateFilter}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                {templates.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-9">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {dateRange?.from ? `${format(dateRange.from, "MMM d")} – ${dateRange.to ? format(dateRange.to, "MMM d") : "..."}` : "Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-center">Seats</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Lab Hours</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{b.batch}</TableCell>
                  <TableCell className="text-sm">{b.customer}</TableCell>
                  <TableCell className="text-sm text-center">{b.seats}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.duration}</TableCell>
                  <TableCell className="text-sm text-right font-mono">{b.labHours}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.completion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="text-xs gap-1"><Eye className="h-3 w-3" /> Report</Button>
                      <Button variant="ghost" size="sm" className="text-xs gap-1"><Download className="h-3 w-3" /> Export</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
