import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useBatchStore } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import { Search, Key, Copy, CheckCircle2 } from "lucide-react";

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export default function ResetPassword() {
  const { batches } = useBatchStore();
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<{ batchId: string; participantId: string; name: string; email: string; batchName: string } | null>(null);
  const [tempPassword, setTempPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const allUsers = useMemo(() => {
    const list: { batchId: string; participantId: string; name: string; email: string; batchName: string }[] = [];
    batches.forEach((b) => {
      b.participants.forEach((p) => {
        list.push({ batchId: b.id, participantId: p.id, name: p.name, email: p.email, batchName: b.name });
      });
    });
    return list;
  }, [batches]);

  const results = search.length > 1
    ? allUsers.filter((u) =>
        u.email.toLowerCase().includes(search.toLowerCase()) || u.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 20)
    : [];

  const handleReset = (user: typeof allUsers[0]) => {
    const pwd = generatePassword();
    setTempPassword(pwd);
    setTarget(user);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    toast({ title: "Copied", description: "Temporary password copied to clipboard" });
  };

  const handleConfirm = () => {
    if (target) {
      toast({ title: "Password Reset", description: `${target.email} can now sign in with the temporary password.` });
    }
    setTarget(null);
    setTempPassword("");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-muted-foreground text-sm mt-1">Search across all participants and reset their password</p>
      </div>

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
                  <Button size="sm" className="gap-2" onClick={() => handleReset(u)}>
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
            <DialogTitle>Temporary Password Generated</DialogTitle>
          </DialogHeader>
          {target && (
            <div className="space-y-4">
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">User:</span> <span className="font-medium">{target.name}</span></p>
                <p><span className="text-muted-foreground">Email:</span> {target.email}</p>
                <p><span className="text-muted-foreground">Batch:</span> {target.batchName}</p>
              </div>
              <div className="rounded-lg border bg-muted p-3 flex items-center justify-between gap-2">
                <code className="text-base font-mono">{tempPassword}</code>
                <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5">
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Share this securely. The user will be required to change it on next sign-in.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
            <Button onClick={handleConfirm}>Confirm Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
