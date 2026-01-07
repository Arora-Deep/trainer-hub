import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BookOpen,
  Calendar,
  Clock,
  Globe,
  Edit,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";

// Mock data
const courseDetails = {
  id: 1,
  name: "ERPNext Certification with Prerecorded Course",
  subtitle: "Recorded Course, Assignments and Live QnA!",
  instructor: "Dharmesh Chitroda",
  price: "₹15,000",
  seatsLeft: 4,
  courses: 1,
  date: "13 Feb 2025",
  time: "2:00 PM - 3:00 PM",
  timezone: "IST (GMT+5:30)",
  description: `By enrolling in this batch, you will have the opportunity to be evaluated and certified as an ERPNext Certified Consultant. You'll gain access to a comprehensive set of prerecorded video lessons and an optional live Q&A session with one of our ERPNext experts. A Q&A session will be optional but can help you clear all the doubts you encounter while going through the prerecorded videos.

*Note that this batch does not include live training sessions; instead, it includes a mandatory course (linked below) that you must complete.*`,
  syllabus: `Our prerecorded certification course covers almost everything from the basics to advanced concepts of ERPNext, with module-wise content in each video to guide you through each step.`,
  modules: [
    {
      title: "Getting Started with ERPNext",
      description: "Begin with an introduction to ERP and ERPNext, where you'll learn about:",
      items: ["Creating a trial site", "Setting up masters", "Understanding the basic transaction flow"],
    },
    {
      title: "Accounting Fundamentals",
      description: "Next, dive into the essentials of accounting including:",
      items: [],
    },
  ],
};

export default function CourseDetails() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title={courseDetails.name}
        description={courseDetails.subtitle}
        breadcrumbs={[
          { label: "Batches", href: "/batches" },
          { label: courseDetails.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meta info */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{courseDetails.courses} Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{courseDetails.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{courseDetails.time}</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                DC
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{courseDetails.instructor}</span>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>{courseDetails.description.split('\n\n')[0]}</p>
              <p className="italic text-foreground">{courseDetails.description.split('\n\n')[1]}</p>
            </div>
          </div>

          {/* Syllabus */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Syllabus</h2>
            <p className="text-sm text-muted-foreground">{courseDetails.syllabus}</p>

            {courseDetails.modules.map((module, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold">{module.title}</h3>
                <p className="text-sm text-muted-foreground">{module.description}</p>
                {module.items.length > 0 && (
                  <ul className="ml-6 space-y-1">
                    {module.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-muted-foreground list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-lg border border-border bg-card p-6 space-y-4">
            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">{courseDetails.price}</span>
              <StatusBadge status="success" label={`${courseDetails.seatsLeft} Seats Left`} />
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{courseDetails.courses} Courses</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{courseDetails.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{courseDetails.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{courseDetails.timezone}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button className="w-full">Manage Batch</Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/course-builder/${id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
