import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";

const completed = [
  { batch: "Docker Batch #3", customer: "SkillBridge Labs", seats: 20, duration: "31 days", labHours: 480, completionDate: "2026-02-05" },
  { batch: "Linux Admin #19", customer: "DevOps Academy", seats: 32, duration: "30 days", labHours: 720, completionDate: "2026-01-20" },
  { batch: "Python ML #4", customer: "DataScience Bootcamp", seats: 25, duration: "28 days", labHours: 560, completionDate: "2026-01-15" },
  { batch: "AWS Cert #5", customer: "Corporate L&D Co", seats: 40, duration: "45 days", labHours: 1200, completionDate: "2025-12-30" },
];

export default function CompletedBatches() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Completed Batches</h1>
          <p className="text-muted-foreground text-sm mt-1">Historical batch records</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Seats</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Lab Hours</TableHead>
                <TableHead>Completion Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completed.map((b, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{b.batch}</TableCell>
                  <TableCell className="text-sm">{b.customer}</TableCell>
                  <TableCell className="text-sm text-right">{b.seats}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.duration}</TableCell>
                  <TableCell className="text-sm text-right">{b.labHours}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.completionDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
