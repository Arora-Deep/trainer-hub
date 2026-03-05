import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const payments = [
  { customer: "DevOps Academy", amount: 45000, method: "Bank Transfer", date: "2026-02-28" },
  { customer: "Corporate L&D Co", amount: 72000, method: "Wire Transfer", date: "2026-02-01" },
  { customer: "DataScience Bootcamp", amount: 15000, method: "Credit Card", date: "2026-01-15" },
  { customer: "CloudLearn Pro", amount: 800, method: "Credit Card", date: "2026-02-20" },
  { customer: "SkillBridge Labs", amount: 8000, method: "Bank Transfer", date: "2025-12-15" },
];

export default function AdminPayments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground text-sm mt-1">Payment records</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{p.customer}</TableCell>
                  <TableCell className="text-sm text-right font-medium">${p.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{p.method}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
