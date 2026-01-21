import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import BatchDetails from "./pages/BatchDetails";
import Labs from "./pages/Labs";
import LabDetails from "./pages/LabDetails";
import CreateLabTemplate from "./pages/CreateLabTemplate";
import CreateLab from "./pages/CreateLab";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import CreateCourse from "./pages/CreateCourse";
import Programs from "./pages/Programs";
import Certifications from "./pages/Certifications";
import Quizzes from "./pages/Quizzes";
import Assignments from "./pages/Assignments";
import Exercises from "./pages/Exercises";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/batches/:id" element={<BatchDetails />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/labs/create" element={<CreateLab />} />
            <Route path="/labs/create-template" element={<CreateLabTemplate />} />
            <Route path="/labs/:id" element={<LabDetails />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/create" element={<CreateCourse />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:id" element={<Programs />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;