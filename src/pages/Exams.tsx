import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Search, GraduationCap, Clock, CheckCircle, Timer } from "lucide-react";

const mockExams = [
  { id: "ex1", title: "AWS Solutions Architect — Mock Final", course: "AWS Cloud Practitioner", duration: "120 min", questions: 60, attempts: 18, avgScore: 76, status: "published", proctored: true },
  { id: "ex2", title: "Kubernetes Certified Admin — Practice Exam", course: "DevOps Bootcamp", duration: "90 min", questions: 50, attempts: 24, avgScore: 71, status: "published", proctored: true },
  { id: "ex3", title: "Python Fundamentals — Midterm", course: "Python for Data Science", duration: "60 min", questions: 40, attempts: 32, avgScore: 82, status: "published", proctored: false },
  { id: "ex4", title: "Linux Essentials — Final", course: "Linux Administration", duration: "75 min", questions: 45, attempts: 0, avgScore: 0, status: "draft", proctored: true },
];

export default function Exams() {
  const [q, setQ] = useState("");
  const filtered = mockExams.filter(
    (e) => e.title.toLowerCase().includes(q.toLowerCase()) || e.course.toLowerCase().includes(q.toLowerCase())
  );
  const published = mockExams.filter((e) => e.status === "published").length;
  const totalAttempts = mockExams.reduce((s, e) => s + e.attempts, 0);
  const avg = Math.round(
    mockExams.filter((e) => e.avgScore > 0).reduce((s, e) => s + e.avgScore, 0) /
      Math.max(1, mockExams.filter((e) => e.avgScore > 0).length)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        description="High-stakes, proctored assessments for certifications and course finals."
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Exam
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Exams" value={mockExams.length} icon={GraduationCap} />
        <StatCard title="Published" value={published} icon={CheckCircle} />
        <StatCard title="Attempts" value={totalAttempts} icon={Timer} />
        <StatCard title="Avg Score" value={`${avg}%`} icon={Clock} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search exams..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Proctored</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{e.course}</TableCell>
                  <TableCell className="text-sm">{e.duration}</TableCell>
                  <TableCell className="text-sm">{e.questions}</TableCell>
                  <TableCell className="text-sm">{e.attempts}</TableCell>
                  <TableCell className="text-sm">{e.avgScore > 0 ? `${e.avgScore}%` : "—"}</TableCell>
                  <TableCell className="text-sm">{e.proctored ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <StatusBadge status={e.status === "published" ? "success" : "neutral"} label={e.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
