import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Key } from "lucide-react";

export default function ResetPassword() {
  const [search, setSearch] = useState("");
  const [found, setFound] = useState(false);

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-muted-foreground text-sm mt-1">Search for a user and reset their password</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Search User</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by email or name..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setFound(e.target.value.length > 3); }} />
            </div>
            <Button variant="outline">Search</Button>
          </div>

          {found && (
            <div className="rounded-lg border p-4 space-y-3">
              <div className="text-sm"><span className="text-muted-foreground">User:</span> <span className="font-medium">alice@example.com</span></div>
              <div className="text-sm"><span className="text-muted-foreground">Name:</span> Alice Johnson</div>
              <div className="text-sm"><span className="text-muted-foreground">Role:</span> Student</div>
              <Button className="gap-2"><Key className="h-4 w-4" /> Reset Password</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
