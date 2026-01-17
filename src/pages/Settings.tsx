import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  User,
  Bell,
  Shield,
  Clock,
  Puzzle,
  Save,
  Camera,
} from "lucide-react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "lab-policies", label: "Lab Policies", icon: Clock },
  { id: "integrations", label: "Integrations", icon: Puzzle },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
        breadcrumbs={[{ label: "Settings" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Settings Navigation */}
        <Card className="h-fit">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <section.icon className="h-5 w-5" />
                  {section.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="space-y-6">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile picture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl">JD</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <p className="font-medium">Profile Photo</p>
                    <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="john.doe@example.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input defaultValue="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Tell us about yourself..."
                    defaultValue="Senior Technical Trainer with 10+ years of experience in cloud technologies."
                  />
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: "Email Notifications", description: "Receive email updates about your batches and labs", defaultChecked: true },
                  { title: "Lab Alerts", description: "Get notified when a lab has issues or errors", defaultChecked: true },
                  { title: "Student Activity", description: "Updates when students complete labs or assessments", defaultChecked: false },
                  { title: "Batch Reminders", description: "Reminders before batch start and end dates", defaultChecked: true },
                  { title: "Marketing Updates", description: "News about new features and updates", defaultChecked: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} />
                  </div>
                ))}
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password regularly to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2FA Status</p>
                      <p className="text-sm text-muted-foreground">Currently disabled</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lab Policies Section */}
          {activeSection === "lab-policies" && (
            <Card>
              <CardHeader>
                <CardTitle>Default Lab Policies</CardTitle>
                <CardDescription>Set default settings for new lab instances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Runtime (minutes)</label>
                    <Input type="number" defaultValue="60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Extensions Allowed</label>
                    <Input type="number" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Extension Duration (minutes)</label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Idle Timeout (minutes)</label>
                    <Input type="number" defaultValue="15" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-stop Idle Labs</p>
                      <p className="text-sm text-muted-foreground">Automatically stop labs after idle timeout</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Send Warning Before Stop</p>
                      <p className="text-sm text-muted-foreground">Notify students before their lab is stopped</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Policies
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Integrations Section */}
          {activeSection === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with third-party services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { name: "Moodle LMS", description: "Learning Management System", connected: true },
                    { name: "Zoom", description: "Video Conferencing", connected: false },
                    { name: "Slack", description: "Team Communication", connected: false },
                    { name: "GitHub", description: "Code Repository", connected: false },
                  ].map((integration, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                      <Button variant={integration.connected ? "outline" : "default"} size="sm">
                        {integration.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}