import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SSOSettings() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">SSO / MFA Settings</h1><p className="text-muted-foreground text-sm mt-1">Authentication security settings for CloudAdda staff</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">MFA Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><Label className="text-sm">Enforce MFA for all staff</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label className="text-sm">Allow TOTP (Google Auth)</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label className="text-sm">Allow SMS OTP</Label><Switch /></div>
            <div className="flex items-center justify-between"><Label className="text-sm">Allow hardware keys (WebAuthn)</Label><Switch /></div>
            <Button size="sm" className="text-xs">Save Changes</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">SSO Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><Label className="text-sm">Enable SSO for staff login</Label><Switch /></div>
            <p className="text-xs text-muted-foreground">Configure SAML 2.0 or OIDC for staff single sign-on. Requires identity provider setup.</p>
            <Button size="sm" variant="outline" className="text-xs">Configure SSO Provider</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
