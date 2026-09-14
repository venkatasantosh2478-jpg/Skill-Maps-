import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import StudentLayout from '@/components/StudentLayout';
import AdminLayout from '@/components/AdminLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy-loaded Application Routes for fast initial bundle & load time
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Roadmap = lazy(() => import('@/pages/Roadmap'));
const Resources = lazy(() => import('@/pages/Resources'));
const Assessment = lazy(() => import('@/pages/Assessment'));
const ResumeCheck = lazy(() => import('@/pages/ResumeCheck'));
const Opportunities = lazy(() => import('@/pages/Opportunities'));
const CourseMode = lazy(() => import('@/pages/CourseMode'));
const CompetencyScope = lazy(() => import('@/pages/CompetencyScope'));
const Mentorship = lazy(() => import('@/pages/Mentorship'));
const Community = lazy(() => import('@/pages/Community'));
const Events = lazy(() => import('@/pages/Events'));
const Freelancing = lazy(() => import('@/pages/Freelancing'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const ResumeGenerator = lazy(() => import('@/pages/ResumeGenerator'));
const TimetableGenerator = lazy(() => import('@/pages/TimetableGenerator'));
const CourseDocs = lazy(() => import('@/pages/CourseDocs'));
const StudentLectures = lazy(() => import('@/pages/StudentLectures'));
const SkillProfiling = lazy(() => import('@/pages/SkillProfiling'));
const DocumentationCenter = lazy(() => import('@/pages/DocumentationCenter'));
const IdeaAnalyzer = lazy(() => import('@/pages/IdeaAnalyzer'));

// Lazy-loaded Admin Routes
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'));
const AdminStudents = lazy(() => import('@/pages/admin/AdminStudents'));
const AdminResources = lazy(() => import('@/pages/admin/AdminResources'));
const AdminOpportunities = lazy(() => import('@/pages/admin/AdminOpportunities'));
const AdminCourseTracking = lazy(() => import('@/pages/admin/AdminCourseTracking'));
const AdminSectors = lazy(() => import('@/pages/admin/AdminSectors'));
const AdminMentors = lazy(() => import('@/pages/admin/AdminMentors'));
const AdminEvents = lazy(() => import('@/pages/admin/AdminEvents'));
const AdminFreelance = lazy(() => import('@/pages/admin/AdminFreelance'));
const AdminFooterSettings = lazy(() => import('@/pages/admin/AdminFooterSettings'));
const AdminLectures = lazy(() => import('@/pages/admin/AdminLectures'));

const PageLoader = () => (
  <div className="flex-1 w-full flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span className="text-xs font-medium text-slate-400">Loading module...</span>
    </div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      if (typeof navigateToLogin === 'function') navigateToLogin();
      return <Navigate to="/login" replace />;
    }
  }

  // Render the main app with Suspense lazy loading
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<StudentLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/resume-check" element={<ResumeCheck />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/course-mode" element={<CourseMode />} />
            <Route path="/competencies" element={<CompetencyScope />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/community" element={<Community />} />
            <Route path="/events" element={<Events />} />
            <Route path="/freelance" element={<Freelancing />} />
            <Route path="/idea-analyzer" element={<IdeaAnalyzer />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/certificates" element={<Navigate to="/profile?tab=certificates" replace />} />
            <Route path="/resume-generator" element={<ResumeGenerator />} />
            <Route path="/timetable" element={<TimetableGenerator />} />
            <Route path="/course-docs" element={<CourseDocs />} />
            <Route path="/student-lectures" element={<StudentLectures />} />
            <Route path="/skill-profiling" element={<SkillProfiling />} />
            <Route path="/system-docs" element={<DocumentationCenter />} />
            <Route path="/lectures" element={<Navigate to="/student-lectures" replace />} />
          </Route>
          <Route element={<ProtectedRoute requireAdmin={true} unauthenticatedElement={<Navigate to="/login" replace />} />}>
            <Route element={<AdminLayout />} >
              <Route path="/admin/overview" element={<AdminOverview />} />
              <Route path="/admin/lectures" element={<AdminLectures />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/sectors" element={<AdminSectors />} />
              <Route path="/admin/mentors" element={<AdminMentors />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/freelance" element={<AdminFreelance />} />
              <Route path="/admin/resources" element={<AdminResources />} />
              <Route path="/admin/opportunities" element={<AdminOpportunities />} />
              <Route path="/admin/course-tracking" element={<AdminCourseTracking />} />
              <Route path="/admin/footer-settings" element={<AdminFooterSettings />} />
            </Route>
            <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;