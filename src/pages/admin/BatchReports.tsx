import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const batchReports = [
  { batch: "K8s Batch #14", customer: "DevOps Academy", seats: 30, duration: "30 days", labHours: 720 },
  { batch: "ML Cohort #5", customer: "DataScience Bootcamp", seats: 25, duration: "30 days", labHours: 600 },
  { batch: "Linux Fund. #8", customer: "Corporate L&D Co", seats: 40, duration: "30 days", labHours: 960 },
  { batch: "Docker Batch #3", customer: "SkillBridge Labs", seats: 20, duration: "31 days", labHours: 480 },
  { batch: "AWS Batch #6", customer: "DevOps Academy", seats: 35, duration: "30 days", labHours: 840 },
];

export default function BatchReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Batch Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Batch performance and usage reports</p>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchReports.map((b, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{b.batch}</TableCell>
                  <TableCell className="text-sm">{b.customer}</TableCell>
                  <TableCell className="text-sm text-right">{b.seats}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.duration}</TableCell>
                  <TableCell className="text-sm text-right font-medium">{b.labHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
