import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  PlayCircle,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

const knowledgebaseArticles = [
  { id: 1, title: "Getting Started with Lab Templates", category: "Labs" },
  { id: 2, title: "How to Create a New Batch", category: "Batches" },
  { id: 3, title: "Managing Student Enrollments", category: "Students" },
  { id: 4, title: "Course Builder Best Practices", category: "Courses" },
  { id: 5, title: "Troubleshooting VM Issues", category: "Labs" },
  { id: 6, title: "Setting Up 2FA", category: "Security" },
];

const videoTutorials = [
  { id: 1, title: "Platform Overview", duration: "5:30" },
  { id: 2, title: "Creating Your First Lab", duration: "8:45" },
  { id: 3, title: "Managing Batches", duration: "6:20" },
  { id: 4, title: "Advanced Course Builder", duration: "12:15" },
];

export default function Support() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Center"
        description="Get help with the Trainer Portal"
        breadcrumbs={[{ label: "Support" }]}
      />

      {/* System Status */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
              <div>
                <p className="font-medium">All Systems Operational</p>
                <p className="text-sm text-muted-foreground">Last updated: 2 minutes ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Status Page
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Knowledgebase */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Knowledgebase
            </CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {knowledgebaseArticles.map((article) => (
                <button
                  key={article.id}
                  className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-sm">{article.title}</span>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
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
            <CardTitle className="text-base flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              Video Tutorials
            </CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {videoTutorials.map((video) => (
                <button
                  key={video.id}
                  className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <PlayCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{video.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Submit a Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="Brief description of your issue" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>Select a category</option>
                <option>Technical Issue</option>
                <option>Billing</option>
                <option>Feature Request</option>
                <option>General Inquiry</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe your issue in detail..." className="min-h-[100px]" />
            </div>
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Submit Ticket
            </Button>
          </CardContent>
        </Card>

        {/* Live Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Live Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Chat with Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is available Monday-Friday, 9AM-6PM EST
              </p>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { name: "Lab VMs", status: "operational" },
              { name: "Course Platform", status: "operational" },
              { name: "Authentication", status: "operational" },
              { name: "Video Streaming", status: "degraded" },
            ].map((service, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg border border-border p-3">
                {service.status === "operational" ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning" />
                )}
                <div>
                  <p className="font-medium text-sm">{service.name}</p>
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