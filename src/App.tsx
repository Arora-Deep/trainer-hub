import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import BatchDetails from "./pages/BatchDetails";
import CreateBatch from "./pages/CreateBatch";
import Labs from "./pages/Labs";
import LabDetails from "./pages/LabDetails";
import CreateLabTemplate from "./pages/CreateLabTemplate";
import CreateLab from "./pages/CreateLab";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import CourseBuilder from "./pages/CourseBuilder";
import CourseEditor from "./pages/CourseEditor";
import CreateCourse from "./pages/CreateCourse";
import Programs from "./pages/Programs";
import CreateProgram from "./pages/CreateProgram";
import Assignments from "./pages/Assignments";
import CreateAssignment from "./pages/CreateAssignment";
import Quizzes from "./pages/Quizzes";
import CreateQuiz from "./pages/CreateQuiz";
import Exercises from "./pages/Exercises";
import ExerciseDetails from "./pages/ExerciseDetails";
import CreateExercise from "./pages/CreateExercise";
import Certifications from "./pages/Certifications";
import CertificationDetails from "./pages/CertificationDetails";
import CreateCertification from "./pages/CreateCertification";
import EditCertification from "./pages/EditCertification";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminActivityFeed from "./pages/admin/ActivityFeed";
import AdminAlerts from "./pages/admin/Alerts";
import AdminCustomers from "./pages/admin/Customers";
import CreateCustomer from "./pages/admin/CreateCustomer";
import CustomerDetail from "./pages/admin/CustomerDetail";
import CustomerHealth from "./pages/admin/CustomerHealth";
import CustomerUsage from "./pages/admin/CustomerUsage";
import AllBatches from "./pages/admin/AllBatches";
import AdminCreateBatch from "./pages/admin/AdminCreateBatch";
import ModifyBatch from "./pages/admin/ModifyBatch";
import CompletedBatches from "./pages/admin/CompletedBatches";
import BatchRequests from "./pages/admin/BatchRequests";
import LabInstances from "./pages/admin/LabInstances";
import AssignVM from "./pages/admin/AssignVM";
import ReplaceVM from "./pages/admin/ReplaceVM";
import ResetLab from "./pages/admin/ResetLab";
import AdminTemplates from "./pages/admin/Templates";
import ISOLibrary from "./pages/admin/ISOLibrary";
import PlatformUsers from "./pages/admin/PlatformUsers";
import CustomerUsers from "./pages/admin/CustomerUsers";
import AdminStudents from "./pages/admin/Students";
import AdminRoles from "./pages/admin/Roles";
import ResetPassword from "./pages/admin/ResetPassword";
import AdminNodes from "./pages/admin/Nodes";
import ResourceUsage from "./pages/admin/ResourceUsage";
import CapacityPlanning from "./pages/admin/CapacityPlanning";
import MaintenanceMode from "./pages/admin/MaintenanceMode";
import AdminTickets from "./pages/admin/Tickets";
import SupportLogs from "./pages/admin/SupportLogs";
import AdminInvoices from "./pages/admin/Invoices";
import AdminPayments from "./pages/admin/Payments";
import AdminCredits from "./pages/admin/Credits";
import AdminUsageReports from "./pages/admin/UsageReports";
import AdminRevenueReports from "./pages/admin/RevenueReports";
import BatchReports from "./pages/admin/BatchReports";
import SystemLogs from "./pages/admin/SystemLogs";
import AdminAuditLogs from "./pages/admin/AuditLogs";
import AdminSettings from "./pages/admin/Settings";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentLabs from "./pages/student/Labs";
import StudentCourses from "./pages/student/Courses";
import StudentAssessments from "./pages/student/Assessments";
import StudentCertificates from "./pages/student/Certificates";
import StudentSchedule from "./pages/student/Schedule";
import StudentLiveClass from "./pages/student/LiveClass";
import StudentSupport from "./pages/student/Support";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Trainer routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/batches/create" element={<CreateBatch />} />
            <Route path="/batches/:id" element={<BatchDetails />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/labs/create" element={<CreateLab />} />
            <Route path="/labs/create-template" element={<CreateLabTemplate />} />
            <Route path="/labs/:id" element={<LabDetails />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/create" element={<CreateCourse />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/courses/:id/edit" element={<CourseEditor />} />
            <Route path="/courses/:id/builder" element={<CourseBuilder />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/create" element={<CreateProgram />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/assignments/create" element={<CreateAssignment />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/create" element={<CreateQuiz />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/create" element={<CreateExercise />} />
            <Route path="/exercises/:id" element={<ExerciseDetails />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/certifications/create" element={<CreateCertification />} />
            <Route path="/certifications/:id" element={<CertificationDetails />} />
            <Route path="/certifications/:id/edit" element={<EditCertification />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/activity-feed" element={<AdminActivityFeed />} />
            <Route path="/admin/alerts" element={<AdminAlerts />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/customers/create" element={<CreateCustomer />} />
            <Route path="/admin/customers/:id" element={<CustomerDetail />} />
            <Route path="/admin/customers/health" element={<CustomerHealth />} />
            <Route path="/admin/customers/usage" element={<CustomerUsage />} />
            <Route path="/admin/batches" element={<AllBatches />} />
            <Route path="/admin/batches/create" element={<AdminCreateBatch />} />
            <Route path="/admin/batches/modify" element={<ModifyBatch />} />
            <Route path="/admin/batches/completed" element={<CompletedBatches />} />
            <Route path="/admin/batches/requests" element={<BatchRequests />} />
            <Route path="/admin/labs/instances" element={<LabInstances />} />
            <Route path="/admin/labs/assign" element={<AssignVM />} />
            <Route path="/admin/labs/replace" element={<ReplaceVM />} />
            <Route path="/admin/labs/reset" element={<ResetLab />} />
            <Route path="/admin/labs/templates" element={<AdminTemplates />} />
            <Route path="/admin/labs/iso" element={<ISOLibrary />} />
            <Route path="/admin/users/platform" element={<PlatformUsers />} />
            <Route path="/admin/users/customer" element={<CustomerUsers />} />
            <Route path="/admin/users/students" element={<AdminStudents />} />
            <Route path="/admin/users/roles" element={<AdminRoles />} />
            <Route path="/admin/users/reset-password" element={<ResetPassword />} />
            <Route path="/admin/infra/nodes" element={<AdminNodes />} />
            <Route path="/admin/infra/resource-usage" element={<ResourceUsage />} />
            <Route path="/admin/infra/capacity" element={<CapacityPlanning />} />
            <Route path="/admin/infra/maintenance" element={<MaintenanceMode />} />
            <Route path="/admin/support/tickets" element={<AdminTickets />} />
            <Route path="/admin/support/logs" element={<SupportLogs />} />
            <Route path="/admin/billing/invoices" element={<AdminInvoices />} />
            <Route path="/admin/billing/payments" element={<AdminPayments />} />
            <Route path="/admin/billing/credits" element={<AdminCredits />} />
            <Route path="/admin/billing/usage" element={<AdminUsageReports />} />
            <Route path="/admin/reports/usage" element={<AdminUsageReports />} />
            <Route path="/admin/reports/revenue" element={<AdminRevenueReports />} />
            <Route path="/admin/reports/batches" element={<BatchReports />} />
            <Route path="/admin/system/logs" element={<SystemLogs />} />
            <Route path="/admin/system/audit" element={<AdminAuditLogs />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Student routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/labs" element={<StudentLabs />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/assessments" element={<StudentAssessments />} />
            <Route path="/student/certificates" element={<StudentCertificates />} />
            <Route path="/student/schedule" element={<StudentSchedule />} />
            <Route path="/student/live-class" element={<StudentLiveClass />} />
            <Route path="/student/support" element={<StudentSupport />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
