import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerStore } from "@/stores/customerStore";

export default function UsageReports() {
  const { customers, blueprints } = useCustomerStore();

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Usage Reports</h1><p className="text-muted-foreground text-sm mt-1">Platform usage breakdown</p></div>
      <Tabs defaultValue="tenant">
        <TabsList><TabsTrigger value="tenant" className="text-xs">By Tenant</TabsTrigger><TabsTrigger value="template" className="text-xs">By Template</TabsTrigger><TabsTrigger value="region" className="text-xs">By Region</TabsTrigger></TabsList>
        <TabsContent value="tenant" className="mt-4">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead className="text-xs">Tenant</TableHead><TableHead className="text-xs text-right">Live Labs</TableHead><TableHead className="text-xs text-right">Active Seats</TableHead><TableHead className="text-xs text-right">VMs</TableHead><TableHead className="text-xs text-right">Monthly Usage</TableHead></TableRow></TableHeader>
              <TableBody>{customers.map(c => (<TableRow key={c.id}><TableCell className="text-sm font-medium">{c.name}</TableCell><TableCell className="text-xs text-right">{c.currentUsage.liveLabs}</TableCell><TableCell className="text-xs text-right">{c.currentUsage.activeSeats}</TableCell><TableCell className="text-xs text-right">{c.activeVMs}</TableCell><TableCell className="text-xs text-right font-medium">₹{c.monthlyUsage.toLocaleString()}</TableCell></TableRow>))}</TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="template" className="mt-4">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead className="text-xs">Blueprint</TableHead><TableHead className="text-xs text-right">Published To</TableHead><TableHead className="text-xs">Tags</TableHead></TableRow></TableHeader>
              <TableBody>{blueprints.map(b => (<TableRow key={b.id}><TableCell className="text-sm font-medium">{b.name}</TableCell><TableCell className="text-xs text-right">{b.publishedTo} tenants</TableCell><TableCell className="text-xs text-muted-foreground">{b.tags.join(", ")}</TableCell></TableRow>))}</TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="region" className="mt-4">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead className="text-xs">Region</TableHead><TableHead className="text-xs text-right">Tenants</TableHead><TableHead className="text-xs text-right">VMs</TableHead></TableRow></TableHeader>
              <TableBody>
                {["ap-south-1", "us-east-1", "eu-west-1", "us-west-2"].map(r => {
                  const tenants = customers.filter(c => c.regions.includes(r));
                  return <TableRow key={r}><TableCell className="text-sm font-mono">{r}</TableCell><TableCell className="text-xs text-right">{tenants.length}</TableCell><TableCell className="text-xs text-right">{tenants.reduce((s, c) => s + c.activeVMs, 0)}</TableCell></TableRow>;
                })}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
