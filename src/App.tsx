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
import AdminCustomers from "./pages/admin/Customers";
import CreateCustomer from "./pages/admin/CreateCustomer";
import CustomerDetail from "./pages/admin/CustomerDetail";
import AdminTenantHealth from "./pages/admin/TenantHealth";
import AdminTenantRequests from "./pages/admin/TenantRequests";
import AdminGoldenImages from "./pages/admin/GoldenImages";
import AdminLabBlueprints from "./pages/admin/LabBlueprints";
import AdminValidationRuns from "./pages/admin/ValidationRuns";
import AdminProvisioningQueue from "./pages/admin/ProvisioningQueue";
import AdminBatchProvisioning from "./pages/admin/BatchProvisioning";
import AdminLifecyclePolicies from "./pages/admin/LifecyclePolicies";
import AdminJobHistory from "./pages/admin/JobHistory";
import AdminRegionsClusters from "./pages/admin/RegionsClusters";
import AdminHostsNodes from "./pages/admin/HostsNodes";
import AdminResourcePools from "./pages/admin/ResourcePools";
import AdminStoragePools from "./pages/admin/StoragePools";
import AdminGPUPools from "./pages/admin/GPUPools";
import AdminIPPools from "./pages/admin/IPPools";
import AdminFirewallPolicies from "./pages/admin/FirewallPolicies";
import AdminInternetPolicies from "./pages/admin/InternetPolicies";
import AdminSessionAccessLogs from "./pages/admin/SessionAccessLogs";
import AdminPlatformHealth from "./pages/admin/PlatformHealth";
import AdminAlertsRules from "./pages/admin/AlertsRules";
import AdminIncidents from "./pages/admin/Incidents";
import AdminMaintenanceWindows from "./pages/admin/MaintenanceWindows";
import AdminTicketInbox from "./pages/admin/TicketInbox";
import AdminRunbooks from "./pages/admin/Runbooks";
import AdminMacros from "./pages/admin/Macros";
import AdminPlansAndPricing from "./pages/admin/PlansAndPricing";
import AdminInvoices from "./pages/admin/Invoices";
import AdminPayments from "./pages/admin/Payments";
import AdminCredits from "./pages/admin/Credits";
import AdminCostMargin from "./pages/admin/CostMargin";
import AdminStaffRBAC from "./pages/admin/StaffRBAC";
import AdminAuditLogs from "./pages/admin/AuditLogs";
import AdminSSOSettings from "./pages/admin/SSOSettings";
import AdminDataRetention from "./pages/admin/DataRetention";
import AdminDailyOpsReport from "./pages/admin/DailyOpsReport";
import AdminUsageReports from "./pages/admin/UsageReports";
import AdminRevenueReports from "./pages/admin/RevenueReports";
import AdminExportCenter from "./pages/admin/ExportCenter";
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

            {/* CloudAdda Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/customers/create" element={<CreateCustomer />} />
            <Route path="/admin/customers/:id" element={<CustomerDetail />} />
            <Route path="/admin/customers/health" element={<AdminTenantHealth />} />
            <Route path="/admin/customers/requests" element={<AdminTenantRequests />} />
            <Route path="/admin/catalog/images" element={<AdminGoldenImages />} />
            <Route path="/admin/catalog/blueprints" element={<AdminLabBlueprints />} />
            <Route path="/admin/catalog/validations" element={<AdminValidationRuns />} />
            <Route path="/admin/provisioning/queue" element={<AdminProvisioningQueue />} />
            <Route path="/admin/provisioning/batch" element={<AdminBatchProvisioning />} />
            <Route path="/admin/provisioning/lifecycle" element={<AdminLifecyclePolicies />} />
            <Route path="/admin/provisioning/history" element={<AdminJobHistory />} />
            <Route path="/admin/infra/regions" element={<AdminRegionsClusters />} />
            <Route path="/admin/infra/hosts" element={<AdminHostsNodes />} />
            <Route path="/admin/infra/resources" element={<AdminResourcePools />} />
            <Route path="/admin/infra/storage" element={<AdminStoragePools />} />
            <Route path="/admin/infra/gpu" element={<AdminGPUPools />} />
            <Route path="/admin/network/ip-pools" element={<AdminIPPools />} />
            <Route path="/admin/network/firewall" element={<AdminFirewallPolicies />} />
            <Route path="/admin/network/internet" element={<AdminInternetPolicies />} />
            <Route path="/admin/network/sessions" element={<AdminSessionAccessLogs />} />
            <Route path="/admin/monitoring/health" element={<AdminPlatformHealth />} />
            <Route path="/admin/monitoring/alerts" element={<AdminAlertsRules />} />
            <Route path="/admin/monitoring/incidents" element={<AdminIncidents />} />
            <Route path="/admin/monitoring/maintenance" element={<AdminMaintenanceWindows />} />
            <Route path="/admin/support/tickets" element={<AdminTicketInbox />} />
            <Route path="/admin/support/runbooks" element={<AdminRunbooks />} />
            <Route path="/admin/support/macros" element={<AdminMacros />} />
            <Route path="/admin/billing/plans" element={<AdminPlansAndPricing />} />
            <Route path="/admin/billing/invoices" element={<AdminInvoices />} />
            <Route path="/admin/billing/payments" element={<AdminPayments />} />
            <Route path="/admin/billing/credits" element={<AdminCredits />} />
            <Route path="/admin/billing/cost" element={<AdminCostMargin />} />
            <Route path="/admin/security/rbac" element={<AdminStaffRBAC />} />
            <Route path="/admin/security/audit" element={<AdminAuditLogs />} />
            <Route path="/admin/security/sso" element={<AdminSSOSettings />} />
            <Route path="/admin/security/retention" element={<AdminDataRetention />} />
            <Route path="/admin/reports/daily" element={<AdminDailyOpsReport />} />
            <Route path="/admin/reports/usage" element={<AdminUsageReports />} />
            <Route path="/admin/reports/revenue" element={<AdminRevenueReports />} />
            <Route path="/admin/reports/exports" element={<AdminExportCenter />} />
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
