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
import QuizDetails from "./pages/QuizDetails";
import Exercises from "./pages/Exercises";
import ExerciseDetails from "./pages/ExerciseDetails";
import CreateExercise from "./pages/CreateExercise";
import Certifications from "./pages/Certifications";
import CertificationDetails from "./pages/CertificationDetails";
import CreateCertification from "./pages/CreateCertification";
import EditCertification from "./pages/EditCertification";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import LiveTraining from "./pages/LiveTraining";
import RequestLab from "./pages/RequestLab";
import LessonView from "./pages/LessonView";
import Exams from "./pages/Exams";
import InsightQuestions from "./pages/InsightQuestions";
import GameBasedLearning from "./pages/GameBasedLearning";
import Schedule from "./pages/Schedule";
import Trainers from "./pages/Trainers";
import TrainerDetail from "./pages/TrainerDetail";
import Meetings from "./pages/Meetings";
import MeetingDetail from "./pages/MeetingDetail";
import AssessmentLibrary from "./pages/AssessmentLibrary";
import Announcements from "./pages/Announcements";

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
import AdminBatchDetail from "./pages/admin/AdminBatchDetail";
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
import CourseModeration from "./pages/admin/CourseModeration";
import PlansAndPricing from "./pages/admin/PlansAndPricing";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentLabs from "./pages/student/Labs";
import StudentLabDetail from "./pages/student/LabDetail";
import StudentCourses from "./pages/student/Courses";
import StudentCourseDetail from "./pages/student/CourseDetail";
import CoursePlayer from "./pages/student/CoursePlayer";
import LabWorkspace from "./pages/student/LabWorkspace";
import CourseResources from "./pages/student/CourseResources";
import CourseDiscussion from "./pages/student/CourseDiscussion";
import StudentAssessments from "./pages/student/Assessments";
import AssessmentDetail from "./pages/student/AssessmentDetail";
import AssessmentAttempt from "./pages/student/AssessmentAttempt";
import AssessmentResult from "./pages/student/AssessmentResult";
import StudentCertificates from "./pages/student/Certificates";
import CertificateDetail from "./pages/student/CertificateDetail";
import CertificateVerify from "./pages/student/CertificateVerify";
import StudentSchedule from "./pages/student/Schedule";
import SessionDetail from "./pages/student/SessionDetail";
import StudentLiveClass from "./pages/student/LiveClass";
import StudentMeetingRoom from "./pages/student/MeetingRoom";
import StudentSupport from "./pages/student/Support";
import StudentProgress from "./pages/student/Progress";
import StudentPaths from "./pages/student/Paths";
import StudentPathDetail from "./pages/student/PathDetail";
import StudentChallenges from "./pages/student/Challenges";
import StudentLeaderboard from "./pages/student/Leaderboard";
import StudentPortfolio from "./pages/student/Portfolio";
import PortfolioPublic from "./pages/student/PortfolioPublic";
import { Navigate } from "react-router-dom";
import Engagement from "./pages/Engagement";

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
            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonView />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/create" element={<CreateProgram />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/assignments/create" element={<CreateAssignment />} />
           <Route path="/quizzes" element={<Quizzes />} />
           <Route path="/quizzes/create" element={<CreateQuiz />} />
           <Route path="/quizzes/:id" element={<QuizDetails />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/create" element={<CreateExercise />} />
            <Route path="/exercises/:id" element={<ExerciseDetails />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/insight-questions" element={<InsightQuestions />} />
            <Route path="/game-based-learning" element={<GameBasedLearning />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/certifications/create" element={<CreateCertification />} />
            <Route path="/certifications/:id" element={<CertificationDetails />} />
            <Route path="/certifications/:id/edit" element={<EditCertification />} />
            <Route path="/support" element={<Support />} />
            <Route path="/live-training" element={<LiveTraining />} />
            <Route path="/request-lab" element={<RequestLab />} />
            
            <Route path="/settings" element={<Settings />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/trainers/:id" element={<TrainerDetail />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/meetings/:id" element={<MeetingDetail />} />
            <Route path="/assessments" element={<AssessmentLibrary />} />
            <Route path="/announcements" element={<Announcements />} />

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
            <Route path="/admin/batches/:id" element={<AdminBatchDetail />} />
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
            <Route path="/admin/catalog/moderation" element={<CourseModeration />} />
            <Route path="/admin/billing/plans" element={<PlansAndPricing />} />

            {/* Student routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/labs" element={<StudentLabs />} />
            <Route path="/student/labs/:id" element={<StudentLabDetail />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/courses/:id" element={<StudentCourseDetail />} />
            <Route path="/student/courses/:id/learn/:lessonId" element={<CoursePlayer />} />
            <Route path="/student/courses/:id/labs/:lessonId/workspace" element={<LabWorkspace />} />
            <Route path="/student/courses/:id/resources" element={<CourseResources />} />
            <Route path="/student/courses/:id/discussion" element={<CourseDiscussion />} />
            <Route path="/student/assessments" element={<StudentAssessments />} />
            <Route path="/student/assessments/:id" element={<AssessmentDetail />} />
            <Route path="/student/assessments/:id/attempt" element={<AssessmentAttempt />} />
            <Route path="/student/assessments/:id/result" element={<AssessmentResult />} />
            <Route path="/student/certificates" element={<StudentCertificates />} />
            <Route path="/student/certificates/:id" element={<CertificateDetail />} />
            <Route path="/student/certificates/:id/verify" element={<CertificateVerify />} />
            <Route path="/student/schedule" element={<StudentSchedule />} />
            <Route path="/student/schedule/:id" element={<SessionDetail />} />
            <Route path="/student/live-class" element={<StudentLiveClass />} />
            <Route path="/student/meeting/:id" element={<StudentMeetingRoom />} />
            <Route path="/student/support" element={<StudentSupport />} />
            <Route path="/student/progress" element={<StudentProgress />} />
            <Route path="/student/paths" element={<StudentPaths />} />
            <Route path="/student/paths/:slug" element={<StudentPathDetail />} />
            <Route path="/student/challenges" element={<StudentChallenges />} />
            <Route path="/student/leaderboard" element={<StudentLeaderboard />} />
            <Route path="/student/portfolio" element={<StudentPortfolio />} />
            {/* Redirects from old routes */}
            <Route path="/student/profile" element={<Navigate to="/student/portfolio" replace />} />
            <Route path="/student/quests" element={<Navigate to="/student/challenges" replace />} />
            <Route path="/student/skill-tree" element={<Navigate to="/student/paths" replace />} />
            <Route path="/engagement" element={<Engagement />} />
          </Route>
          {/* Public portfolio (no auth, no layout) */}
          <Route path="/p/:handle" element={<PortfolioPublic />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
