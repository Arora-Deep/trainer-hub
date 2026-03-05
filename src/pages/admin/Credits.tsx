import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const credits = [
  { customer: "DataScience Bootcamp", creditAdded: 5000, reason: "GPU provisioning failure compensation", date: "2026-02-28" },
  { customer: "SkillBridge Labs", creditAdded: 2000, reason: "Network downtime SLA credit", date: "2026-02-20" },
  { customer: "DevOps Academy", creditAdded: 1000, reason: "Early renewal bonus", date: "2026-02-15" },
  { customer: "Corporate L&D Co", creditAdded: 3000, reason: "Volume discount adjustment", date: "2026-02-10" },
];

export default function AdminCredits() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Credits</h1>
        <p className="text-muted-foreground text-sm mt-1">Credit adjustments</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Credit Added</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credits.map((c, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{c.customer}</TableCell>
                  <TableCell className="text-sm text-right font-medium text-success">${c.creditAdded.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{c.reason}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
