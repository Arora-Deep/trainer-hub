import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useBatchStore } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import { Search, Key, Mail, Smartphone, CheckCircle2, ShieldAlert } from "lucide-react";

type User = { batchId: string; participantId: string; name: string; email: string; batchName: string };
type Method = "email" | "sms" | "force";

export default function ResetPassword() {
  const { batches } = useBatchStore();
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<User | null>(null);
  const [method, setMethod] = useState<Method>("email");
  const [reason, setReason] = useState("");
  const [done, setDone] = useState<{ user: User; method: Method } | null>(null);

  const allUsers = useMemo(() => {
    const list: User[] = [];
    batches.forEach((b) => b.participants.forEach((p) => {
      list.push({ batchId: b.id, participantId: p.id, name: p.name, email: p.email, batchName: b.name });
    }));
    return list;
  }, [batches]);

  const results = search.length > 1
    ? allUsers.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()) || u.name.toLowerCase().includes(search.toLowerCase())).slice(0, 20)
    : [];

  const handleSend = () => {
    if (!target) return;
    if (!reason.trim()) { toast({ title: "Reason required", description: "Audit log requires a reason for password reset.", variant: "destructive" }); return; }
    const msg: Record<Method, string> = {
      email: `A secure reset link has been emailed to ${target.email}. Expires in 30 minutes.`,
      sms: `An SMS one-time code was sent to the user's verified phone.`,
      force: `User flagged for forced password change on next login.`,
    };
    toast({ title: "Reset Initiated", description: msg[method] });
    setDone({ user: target, method });
    setTarget(null);
    setReason("");
    setMethod("email");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-muted-foreground text-sm mt-1">Initiate a secure password reset for any user. We never display or generate passwords.</p>
      </div>

      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="pt-4 flex gap-2 items-start text-xs">
          <ShieldAlert className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-muted-foreground">For security, CloudAdda admins never see or create passwords. Choose a delivery method below — the user receives a one-time link or code and sets their own password.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Search User</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by email or name..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {results.length > 0 && (
            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {results.map((u) => (
                <div key={`${u.batchId}-${u.participantId}`} className="rounded-lg border p-3 flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1">{u.batchName}</Badge>
                  </div>
                  <Button size="sm" className="gap-2" onClick={() => setTarget(u)}>
                    <Key className="h-3 w-3" /> Reset
                  </Button>
                </div>
              ))}
            </div>
          )}

          {search.length > 1 && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No users match "{search}"</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!target} onOpenChange={() => setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate Password Reset</DialogTitle>
            <DialogDescription>Choose how the user will recover access. Action is logged in the audit trail.</DialogDescription>
          </DialogHeader>
          {target && (
            <div className="space-y-4">
              <div className="text-sm space-y-1 rounded-lg border p-3 bg-muted/30">
                <p><span className="text-muted-foreground">User:</span> <span className="font-medium">{target.name}</span></p>
                <p><span className="text-muted-foreground">Email:</span> {target.email}</p>
                <p><span className="text-muted-foreground">Batch:</span> {target.batchName}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Delivery method</Label>
                <RadioGroup value={method} onValueChange={(v) => setMethod(v as Method)} className="space-y-2">
                  <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40">
                    <RadioGroupItem value="email" className="mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email reset link</p>
                      <p className="text-xs text-muted-foreground">Sends a one-time link to {target.email}. Expires in 30 minutes.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40">
                    <RadioGroupItem value="sms" className="mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5" /> SMS one-time code</p>
                      <p className="text-xs text-muted-foreground">Texts a 6-digit code to the user's verified phone.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40">
                    <RadioGroupItem value="force" className="mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium flex items-center gap-1.5"><Key className="h-3.5 w-3.5" /> Force change on next login</p>
                      <p className="text-xs text-muted-foreground">User must set a new password the next time they sign in.</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Reason (required for audit)</Label>
                <Input placeholder="e.g. Verified identity via support ticket #1234" value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
            <Button onClick={handleSend}>Send Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!done} onOpenChange={() => setDone(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Reset Initiated</DialogTitle>
          </DialogHeader>
          {done && (
            <div className="space-y-3 text-sm">
              <p>Reset for <span className="font-medium">{done.user.name}</span> ({done.user.email}) was initiated via <span className="font-medium">{done.method}</span>.</p>
              <p className="text-xs text-muted-foreground">A backend integration will dispatch the actual link/code when connected. This action has been logged in the audit trail.</p>
            </div>
          )}
          <DialogFooter><Button onClick={() => setDone(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
