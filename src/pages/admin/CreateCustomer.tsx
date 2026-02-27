import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateCustomer() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Customer created", description: "New customer has been onboarded successfully." });
    navigate("/admin/customers");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/customers")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Customer</h1>
          <p className="text-muted-foreground text-sm mt-1">Onboard a new training company</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle className="text-base">Company Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Company Name</Label><Input placeholder="e.g. TechSkills Academy" required /></div>
              <div className="space-y-2"><Label>Contact Person</Label><Input placeholder="Full name" required /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="contact@company.com" required /></div>
              <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 9876543210" /></div>
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
                    <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                    <SelectItem value="eu-west-1">EU West (Ireland)</SelectItem>
                    <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => navigate("/admin/customers")}>Cancel</Button>
              <Button type="submit">Create Customer</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
