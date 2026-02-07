import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  PlayCircle,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  ArrowRight,
  Headphones,
} from "lucide-react";

const knowledgebaseArticles = [
  { id: 1, title: "Getting Started with Lab Templates", category: "Labs", popular: true },
  { id: 2, title: "How to Create a New Batch", category: "Batches", popular: true },
  { id: 3, title: "Managing Student Enrollments", category: "Students", popular: false },
  { id: 4, title: "Course Builder Best Practices", category: "Courses", popular: true },
  { id: 5, title: "Troubleshooting VM Issues", category: "Labs", popular: false },
  { id: 6, title: "Setting Up 2FA", category: "Security", popular: false },
];

const videoTutorials = [
  { id: 1, title: "Platform Overview", duration: "5:30", thumbnail: "🎬" },
  { id: 2, title: "Creating Your First Lab", duration: "8:45", thumbnail: "🧪" },
  { id: 3, title: "Managing Batches", duration: "6:20", thumbnail: "👥" },
  { id: 4, title: "Advanced Course Builder", duration: "12:15", thumbnail: "📚" },
];

const serviceStatus = [
  { name: "Lab VMs", status: "operational" },
  { name: "Course Platform", status: "operational" },
  { name: "Authentication", status: "operational" },
  { name: "Video Streaming", status: "degraded" },
];

export default function Support() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Center"
        description="Get help with the Trainer Portal"
        breadcrumbs={[{ label: "Support" }]}
      />

      {/* System Status Banner */}
      <div className="rounded-2xl p-5 border border-success/20 shimmer-overlay overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(var(--success) / 0.06) 0%, hsl(var(--success) / 0.02) 100%)" }}
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
            </div>
            <div>
              <p className="font-bold text-foreground">All Systems Operational</p>
              <p className="text-sm text-muted-foreground">Last checked: 2 minutes ago</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Status Page
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Knowledgebase */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2.5">
              <div className="icon-container-primary p-2.5">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold">Knowledgebase</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {knowledgebaseArticles.map((article) => (
                <button
                  key={article.id}
                  className="flex w-full items-center justify-between rounded-xl border border-border/40 p-3.5 text-left hover:bg-muted/30 hover:border-border/80 hover:shadow-sm transition-all duration-200 group"
                >
                  <span className="font-semibold text-sm group-hover:text-coral transition-colors">{article.title}</span>
                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-full">
                    {article.category}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Video Tutorials */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2.5">
              <div className="icon-container-coral p-2.5">
                <PlayCircle className="h-4 w-4 text-coral" />
              </div>
              <CardTitle className="text-base font-bold">Video Tutorials</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {videoTutorials.map((video) => (
                <button
                  key={video.id}
                  className="flex w-full items-center justify-between rounded-xl border border-border/40 p-3.5 text-left hover:bg-muted/30 hover:border-border/80 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-muted/60 h-11 w-11 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                      {video.thumbnail}
                    </div>
                    <span className="font-semibold text-sm group-hover:text-coral transition-colors">{video.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit a Ticket */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="icon-container-primary p-2.5">
                <Send className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold">Submit a Ticket</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Brief description of your issue" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger id="category" className="rounded-xl">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="general">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your issue in detail..." className="min-h-[100px] resize-none rounded-xl" />
            </div>
            <Button variant="coral" className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Submit Ticket
            </Button>
          </CardContent>
        </Card>

        {/* Live Chat */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="icon-container-coral p-2.5">
                <Headphones className="h-4 w-4 text-coral" />
              </div>
              <CardTitle className="text-base font-bold">Live Support</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center" style={{ background: "var(--gradient-surface)" }}>
              <div className="mx-auto w-fit rounded-2xl p-4 mb-4 icon-container-primary">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Chat with Support</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                Our support team is available Monday-Friday, 9AM-6PM EST
              </p>
              <Button variant="coral" size="lg">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {serviceStatus.map((service, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 rounded-xl border border-border/40 p-4 hover:bg-muted/30 hover:shadow-sm transition-all duration-200"
              >
                {service.status === "operational" ? (
                  <CheckCircle className="h-5 w-5 text-success shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{service.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{service.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
