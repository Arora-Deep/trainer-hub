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
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;