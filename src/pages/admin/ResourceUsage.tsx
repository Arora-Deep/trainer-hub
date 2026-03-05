import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const cpuData = [
  { cluster: "Mumbai-1", usage: 70 }, { cluster: "Mumbai-2", usage: 55 }, { cluster: "Mumbai-3", usage: 82 },
  { cluster: "Virginia-1", usage: 45 }, { cluster: "Virginia-2", usage: 38 }, { cluster: "GPU-1", usage: 90 }, { cluster: "EU-West", usage: 30 },
];
const ramData = [
  { cluster: "Mumbai-1", usage: 75 }, { cluster: "Mumbai-2", usage: 62 }, { cluster: "Mumbai-3", usage: 88 },
  { cluster: "Virginia-1", usage: 50 }, { cluster: "Virginia-2", usage: 42 }, { cluster: "GPU-1", usage: 92 }, { cluster: "EU-West", usage: 65 },
];
const storageData = [
  { cluster: "Mumbai-1", usage: 60 }, { cluster: "Mumbai-2", usage: 48 }, { cluster: "Mumbai-3", usage: 72 },
  { cluster: "Virginia-1", usage: 40 }, { cluster: "Virginia-2", usage: 35 }, { cluster: "GPU-1", usage: 65 }, { cluster: "EU-West", usage: 82 },
];
const vmData = [
  { cluster: "Mumbai-1", vms: 45 }, { cluster: "Mumbai-2", vms: 38 }, { cluster: "Mumbai-3", vms: 52 },
  { cluster: "Virginia-1", vms: 28 }, { cluster: "Virginia-2", vms: 22 }, { cluster: "GPU-1", vms: 15 }, { cluster: "EU-West", vms: 18 },
];

const chartStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 };

export default function ResourceUsage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resource Usage</h1>
        <p className="text-muted-foreground text-sm mt-1">Cluster resource utilization</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {[
          { title: "CPU Usage", data: cpuData, key: "usage", color: "hsl(var(--primary))" },
          { title: "RAM Usage", data: ramData, key: "usage", color: "hsl(var(--chart-2))" },
          { title: "Storage Usage", data: storageData, key: "usage", color: "hsl(var(--chart-3))" },
          { title: "Active VMs", data: vmData, key: "vms", color: "hsl(var(--chart-4))" },
        ].map(({ title, data, key, color }) => (
          <Card key={title}>
            <CardHeader className="pb-2"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="cluster" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={chartStyle} />
                  <Bar dataKey={key} fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
