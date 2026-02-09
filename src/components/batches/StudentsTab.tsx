import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, UserPlus, MoreHorizontal, ExternalLink, Monitor, CalendarCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Batch } from "@/stores/batchStore";
import { useBatchStore } from "@/stores/batchStore";
import { cn } from "@/lib/utils";

interface StudentsTabProps {
  batch: Batch;
}

export function StudentsTab({ batch }: StudentsTabProps) {
  const { addStudent, removeStudent } = useBatchStore();
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentEmail.trim()) {
      toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
      return;
    }
    addStudent(batch.id, { name: newStudentName.trim(), email: newStudentEmail.trim() });
    toast({ title: "Success", description: "Student added successfully" });
    setNewStudentName(""); setNewStudentEmail(""); setAddStudentOpen(false);
  };

  const getVmStatusBadge = (status?: string) => {
    switch (status) {
      case "running": return <StatusBadge status="success" label="Running" />;
      case "stopped": return <StatusBadge status="warning" label="Stopped" />;
      case "error": return <StatusBadge status="error" label="Error" />;
      default: return <StatusBadge status="default" label="N/A" />;
    }
  };

  const getAttendanceColor = (present: number, total: number) => {
    if (total === 0) return "text-muted-foreground";
    const pct = (present / total) * 100;
    if (pct >= 80) return "text-green-600 dark:text-green-400";
    if (pct >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Students ({batch.students.length}/{batch.seatCount})</CardTitle>
          <CardDescription>Manage enrolled students — view progress, attendance, and VM access</CardDescription>
        </div>
        <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><UserPlus className="mr-2 h-4 w-4" />Add Students</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Student</DialogTitle>
              <DialogDescription>Add a new student to this batch.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Name</Label>
                <Input id="studentName" placeholder="Student name" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email</Label>
                <Input id="studentEmail" type="email" placeholder="student@example.com" value={newStudentEmail} onChange={(e) => setNewStudentEmail(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddStudentOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStudent}>Add Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-0">
        {batch.students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold">No students enrolled</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1.5">Add students to this batch to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-medium">Student</TableHead>
                <TableHead className="font-medium">Progress</TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center gap-1.5">
                    <CalendarCheck className="h-3.5 w-3.5" />
                    Attendance
                  </div>
                </TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center gap-1.5">
                    <Monitor className="h-3.5 w-3.5" />
                    VM Status
                  </div>
                </TableHead>
                <TableHead className="font-medium">Last Active</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batch.students.map((student) => (
                <TableRow key={student.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-primary/10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{student.name}</span>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-[120px]">
                      <ProgressBar
                        value={student.progress}
                        size="sm"
                        variant={student.progress >= 75 ? "success" : student.progress >= 50 ? "primary" : "warning"}
                        showValue
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("font-medium text-sm tabular-nums", getAttendanceColor(student.attendance.present, student.attendance.total))}>
                      {student.attendance.present}/{student.attendance.total}
                    </span>
                    {student.attendance.total > 0 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({Math.round((student.attendance.present / student.attendance.total) * 100)}%)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getVmStatusBadge(student.vmStatus)}
                      {student.vmIpAddress && student.vmStatus === "running" && (
                        <code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted hidden xl:inline">{student.vmIpAddress}</code>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{student.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {student.vmStatus === "running" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            toast({ title: "VM Console", description: `Opening ${student.name}'s VM console...` });
                            window.open(`https://console.cloudadda.com/vm/${batch.id}/${student.id}`, "_blank");
                          }}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Console
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem>Mark Attendance</DropdownMenuItem>
                          {student.vmStatus === "running" && (
                            <DropdownMenuItem onClick={() => {
                              toast({ title: "VM Console", description: `Accessing ${student.name}'s VM...` });
                            }}>
                              Access VM Console
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              removeStudent(batch.id, student.id);
                              toast({ title: "Removed", description: "Student removed" });
                            }}
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
