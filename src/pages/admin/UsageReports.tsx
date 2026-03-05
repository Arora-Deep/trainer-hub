import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const labsPerDay = [
  { day: "Mon", labs: 180 }, { day: "Tue", labs: 210 }, { day: "Wed", labs: 245 },
  { day: "Thu", labs: 230 }, { day: "Fri", labs: 200 }, { day: "Sat", labs: 80 }, { day: "Sun", labs: 60 },
];

const labHours = [
  { month: "Oct", hours: 12000 }, { month: "Nov", hours: 13500 }, { month: "Dec", hours: 12800 },
  { month: "Jan", hours: 14500 }, { month: "Feb", hours: 16430 }, { month: "Mar", hours: 17200 },
];

const resourceData = [
  { month: "Oct", cpu: 55, ram: 60, storage: 45 }, { month: "Nov", cpu: 60, ram: 65, storage: 50 },
  { month: "Dec", cpu: 58, ram: 62, storage: 52 }, { month: "Jan", cpu: 65, ram: 70, storage: 55 },
  { month: "Feb", cpu: 72, ram: 75, storage: 60 }, { month: "Mar", cpu: 75, ram: 78, storage: 62 },
];

const chartStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 };

export default function AdminUsageReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usage Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform usage analytics</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Labs per Day</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={labsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="labs" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Lab Hours (Monthly)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={labHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Resource Consumption (%)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={chartStyle} />
              <Line type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" strokeWidth={2} name="CPU" />
              <Line type="monotone" dataKey="ram" stroke="hsl(var(--chart-2))" strokeWidth={2} name="RAM" />
              <Line type="monotone" dataKey="storage" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Storage" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
