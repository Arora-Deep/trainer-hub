import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  User,
  Bell,
  Shield,
  Clock,
  Puzzle,
  Save,
  Camera,
  Check,
  ExternalLink,
} from "lucide-react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User, description: "Your account information" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Email and push alerts" },
  { id: "security", label: "Security", icon: Shield, description: "Password and 2FA" },
  { id: "lab-policies", label: "Lab Policies", icon: Clock, description: "Default lab settings" },
  { id: "integrations", label: "Integrations", icon: Puzzle, description: "Third-party connections" },
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

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Settings Navigation */}
        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200",
                    activeSection === section.id
                      ? "text-white font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  style={activeSection === section.id ? { background: "var(--gradient-coral)" } : undefined}
                >
                  <section.icon className="h-5 w-5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{section.label}</p>
                    <p className={cn(
                      "text-xs truncate",
                      activeSection === section.id ? "text-white/70" : "text-muted-foreground/70"
                    )}>{section.description}</p>
                  </div>
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
                <CardTitle className="font-bold">Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile picture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 ring-4 ring-border/30">
                      <AvatarFallback className="text-2xl font-bold" style={{ background: "var(--gradient-coral)", color: "white" }}>JD</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <p className="font-semibold">Profile Photo</p>
                    <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Upload new photo
                    </Button>
                  </div>
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="john.doe@example.com" type="email" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (555) 000-0000" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 resize-none transition-all"
                    placeholder="Tell us about yourself..."
                    defaultValue="Senior Technical Trainer with 10+ years of experience in cloud technologies."
                  />
                </div>
                <div className="flex justify-end">
                  <Button variant="coral">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  { title: "Email Notifications", description: "Receive email updates about your batches and labs", defaultChecked: true },
                  { title: "Lab Alerts", description: "Get notified when a lab has issues or errors", defaultChecked: true },
                  { title: "Student Activity", description: "Updates when students complete labs or assessments", defaultChecked: false },
                  { title: "Batch Reminders", description: "Reminders before batch start and end dates", defaultChecked: true },
                  { title: "Marketing Updates", description: "News about new features and updates", defaultChecked: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl p-4 hover:bg-muted/30 transition-all duration-200">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} />
                  </div>
                ))}
                <div className="pt-4 flex justify-end">
                  <Button variant="coral">
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold">Change Password</CardTitle>
                  <CardDescription>Update your password regularly to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" className="rounded-xl" />
                  </div>
                  <Button variant="coral">Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-bold">Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-xl border border-border/50 p-5" style={{ background: "var(--gradient-surface)" }}>
                    <div className="flex items-center gap-4">
                      <div className="icon-container p-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">2FA Status</p>
                        <p className="text-sm text-muted-foreground">Currently disabled</p>
                      </div>
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
                <CardTitle className="font-bold">Default Lab Policies</CardTitle>
                <CardDescription>Set default settings for new lab instances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="runtime">Default Runtime (minutes)</Label>
                    <Input id="runtime" type="number" defaultValue="60" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="extensions">Max Extensions Allowed</Label>
                    <Input id="extensions" type="number" defaultValue="3" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="extensionDuration">Extension Duration (minutes)</Label>
                    <Input id="extensionDuration" type="number" defaultValue="30" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idleTimeout">Idle Timeout (minutes)</Label>
                    <Input id="idleTimeout" type="number" defaultValue="15" className="rounded-xl" />
                  </div>
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="space-y-1">
                  {[
                    { title: "Auto-stop Idle Labs", description: "Automatically stop labs after idle timeout", defaultChecked: true },
                    { title: "Send Warning Before Stop", description: "Notify students before their lab is stopped", defaultChecked: true },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl p-4 hover:bg-muted/30 transition-all duration-200">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch defaultChecked={item.defaultChecked} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button variant="coral">
                    <Save className="mr-2 h-4 w-4" />
                    Save Policies
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Section */}
          {activeSection === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">Integrations</CardTitle>
                <CardDescription>Connect with third-party services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { name: "Moodle LMS", description: "Learning Management System", connected: true },
                    { name: "Zoom", description: "Video Conferencing", connected: false },
                    { name: "Slack", description: "Team Communication", connected: false },
                    { name: "GitHub", description: "Code Repository", connected: false },
                  ].map((integration, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl border border-border/50 p-5 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
                      style={{ background: "var(--gradient-surface)" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "rounded-xl p-2.5",
                          integration.connected ? "icon-container-success" : "icon-container"
                        )}>
                          {integration.connected ? (
                            <Check className="h-5 w-5 text-success" />
                          ) : (
                            <ExternalLink className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{integration.name}</p>
                          <p className="text-xs text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      <Button variant={integration.connected ? "outline" : "coral"} size="sm">
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
