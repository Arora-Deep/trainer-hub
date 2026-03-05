import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const projectedData = [
  { week: "W1", current: 218, projected: 218 }, { week: "W2", current: 225, projected: 230 },
  { week: "W3", current: 0, projected: 245 }, { week: "W4", current: 0, projected: 260 },
  { week: "W5", current: 0, projected: 275 }, { week: "W6", current: 0, projected: 290 },
];

const capacityData = [
  { week: "W1", available: 182, total: 400 }, { week: "W2", available: 170, total: 400 },
  { week: "W3", available: 155, total: 400 }, { week: "W4", available: 140, total: 400 },
  { week: "W5", available: 125, total: 400 }, { week: "W6", available: 110, total: 400 },
];

const resources = [
  { resource: "vCPU", total: 1400, used: 725, free: 675 },
  { resource: "RAM (GB)", total: 5632, used: 3170, free: 2462 },
  { resource: "Storage (GB)", total: 55000, used: 28500, free: 26500 },
  { resource: "GPU", total: 12, used: 6, free: 6 },
];

const chartStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 };

export default function CapacityPlanning() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Capacity Planning</h1>
        <p className="text-muted-foreground text-sm mt-1">Projected usage and available capacity</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Projected VM Usage</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={projectedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={2} name="Current" />
                <Line type="monotone" dataKey="projected" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="5 5" name="Projected" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Available Capacity</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={capacityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="available" stroke="hsl(var(--success))" strokeWidth={2} name="Available" />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="3 3" name="Total" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Used</TableHead>
                <TableHead className="text-right">Free</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((r) => (
                <TableRow key={r.resource}>
                  <TableCell className="text-sm font-medium">{r.resource}</TableCell>
                  <TableCell className="text-sm text-right">{r.total.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-right">{r.used.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-right font-medium text-success">{r.free.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
