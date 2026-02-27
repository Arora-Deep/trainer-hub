import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure CloudAdda platform preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
          <CardDescription>Platform-wide configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Platform Name</Label><Input defaultValue="CloudAdda" /></div>
          <div className="space-y-2"><Label>Support Email</Label><Input defaultValue="support@cloudadda.com" /></div>
          <div className="space-y-2"><Label>Default Region</Label><Input defaultValue="ap-south-1" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Alert preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><div><Label>VM Health Alerts</Label><p className="text-xs text-muted-foreground">Get notified when VMs have issues</p></div><Switch defaultChecked /></div>
          <Separator />
          <div className="flex items-center justify-between"><div><Label>New Customer Notifications</Label><p className="text-xs text-muted-foreground">Alert when a new customer signs up</p></div><Switch defaultChecked /></div>
          <Separator />
          <div className="flex items-center justify-between"><div><Label>Billing Alerts</Label><p className="text-xs text-muted-foreground">Overdue payment notifications</p></div><Switch defaultChecked /></div>
        </CardContent>
      </Card>

      <div className="flex justify-end"><Button>Save Changes</Button></div>
    </div>
  );
}
