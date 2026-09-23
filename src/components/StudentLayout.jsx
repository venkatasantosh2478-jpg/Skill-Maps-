import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Map, 
  BookOpen, 
  ClipboardCheck, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  LogOut, 
  Sparkles,
  Shield,
  ChevronRight,
  Menu,
  X,
  Compass,
  Users,
  MessageSquare,
  Search,
  Trophy,
  DollarSign,
  Command,
  Calendar, 
  Video, 
  PanelLeftClose,
  PanelLeftOpen,
  Brain,
  Layers,
  Home,
  Award
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Chatbot from "@/components/Chatbot";
import ThemeToggle from "@/components/ThemeToggle";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const navSections = [
  {
    title: "CORE HUB",
    items: [
      { to: "/dashboard", label: "Overview Dashboard", icon: LayoutDashboard },
      { to: "/roadmap", label: "Career Roadmap", icon: Map, badge: "AI" },
      { to: "/leaderboard", label: "Leaderboard & Ranks", icon: Trophy, badge: "Top" },
    ]
  },
  {
    title: "ACADEMIC & LEARNING VAULT",
    items: [
      { to: "/course-docs", label: "Course Docs & PDF Notes", icon: BookOpen, badge: "Deep" },
      { to: "/student-lectures", label: "Video Lecture Vault", icon: Video, badge: "HD" },
      { to: "/timetable", label: "Adaptive Study Timetable", icon: Calendar, badge: "AI" },
      { to: "/skill-profiling", label: "Skill Profiling & Quizzes", icon: Brain, badge: "Test" },
      { to: "/system-docs", label: "Documentation & Reports", icon: Layers, badge: "PDF" },
    ]
  },
  {
    title: "CAREER & OPPORTUNITIES",
    items: [
      { to: "/resume-generator", label: "ATS Resume Builder", icon: FileText, badge: "PDF" },
      { to: "/idea-analyzer", label: "Idea Analyzer & Teams", icon: Sparkles, badge: "AI" },
      { to: "/events", label: "Hackathons & Events", icon: Trophy, badge: "Prizes" },
      { to: "/freelance", label: "Freelancing & Client Gigs", icon: DollarSign, badge: "Active" },
      { to: "/opportunities", label: "Jobs & Internships", icon: Briefcase },
    ]
  },
  {
    title: "COMMUNITY & ADVISORS",
    items: [
      { to: "/competencies", label: "Real-World Competencies", icon: Compass, badge: "Scope" },
      { to: "/mentorship", label: "1:1 Expert Mentorship", icon: Users, badge: "1:1" },
      { to: "/community", label: "Student Hub & Chat", icon: MessageSquare, badge: "Live" },
    ]
  },
  {
    title: "ASSESSMENTS & SYNC",
    items: [
      { to: "/profile?tab=certificates", label: "My Certificates", icon: Award, badge: "Verified" },
      { to: "/assessment", label: "Skill & Code Quiz Assessment", icon: ClipboardCheck, badge: "Adaptive" },
      { to: "/resume-check", label: "Resume Intelligence Score", icon: FileText, badge: "ATS" },
      { to: "/course-mode", label: "Curriculum Sprint Tracker", icon: GraduationCap },
      { to: "/resources", label: "Curated Resource Library", icon: BookOpen },
    ]
  }
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("skillsmap_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("skillsmap_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  // Close mobile drawer on route change & prevent background scroll when open
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Global hotkeys: Cmd+K for search, Cmd+B for sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 flex flex-col font-body text-slate-800 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute -top-[15%] -left-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-indigo-300/30 to-violet-300/20 blur-3xl dark:from-indigo-900/30 dark:to-violet-900/20" />
        <div className="absolute top-[45%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-bl from-sky-300/30 to-indigo-200/20 blur-3xl dark:from-sky-900/30 dark:to-indigo-950/20" />
      </div>

      {/* Middle Container: Sidebar + Main Content Row (ends at Footer start) */}
      <div className="flex-1 flex w-full relative min-w-0 z-10">
        {/* Mobile Backdrop */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
            onClick={() => setMobileOpen(false)} 
          />
        )}

        {/* Sidebar with Desktop Collapse capability */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/90 flex flex-col shrink-0 transition-all duration-300 shadow-sm self-start h-screen lg:h-auto lg:self-stretch",
            mobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
            sidebarCollapsed ? "lg:w-20" : "lg:w-72"
          )}
        >
        {/* Brand Header */}
        <div className={cn(
          "border-b border-slate-100 dark:border-slate-800 flex items-center transition-all",
          sidebarCollapsed ? "px-2 py-3.5 flex-col gap-2 justify-center" : "px-4 py-4 justify-between"
        )}>
          <Link 
            to="/dashboard" 
            className={cn(
              "flex items-center group overflow-hidden",
              sidebarCollapsed ? "justify-center" : "gap-3"
            )}
            title="SkillsMap Dashboard"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="transition-opacity duration-200 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-slate-900 dark:text-white tracking-tight text-lg truncate">SkillsMap</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">Career & Academic Platform</p>
              </div>
            )}
          </Link>
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleSidebar}
              className={cn(
                "hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                sidebarCollapsed && "mt-1"
              )}
              title={sidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <div className={cn(
          "flex-1 py-4 overflow-y-auto space-y-5 custom-scrollbar",
          sidebarCollapsed ? "px-2" : "px-3"
        )}>
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const currentFull = `${location.pathname}${location.search}`;
                  const active = item.to.includes("?")
                    ? currentFull === item.to
                    : location.pathname === item.to && !location.search;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center justify-between rounded-xl text-xs font-medium transition-all duration-150",
                        sidebarCollapsed ? "p-2.5 justify-center" : "px-3.5 py-2.5",
                        active
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800/80"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn(
                          "h-4 w-4 transition-colors shrink-0",
                          active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                        )} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && item.badge && (
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0",
                          active 
                            ? "bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      {active && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Admin Navigation Button */}
          {isAdmin && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-1">
                  FACULTY & ADMIN
                </p>
              )}
              <Link
                to="/admin/overview"
                onClick={() => setMobileOpen(false)}
                title={sidebarCollapsed ? "Admin Console" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-xl text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/50 border border-violet-200 dark:border-violet-800 transition-colors",
                  sidebarCollapsed ? "p-2.5 justify-center" : "px-3.5 py-2.5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                  {!sidebarCollapsed && <span>Admin Console</span>}
                </div>
                {!sidebarCollapsed && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
              </Link>
            </div>
          )}
        </div>

        {/* User Card & Logout */}
        <div className={cn(
          "border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70",
          sidebarCollapsed ? "p-2" : "p-3"
        )}>
          <Link
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "block rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs mb-2 group transition-all",
              sidebarCollapsed ? "p-2 text-center" : "p-2.5"
            )}
            title="Open Student Profile"
          >
            <div className={cn("flex items-center", sidebarCollapsed ? "justify-center" : "gap-2.5")}>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-xs group-hover:scale-105 transition-transform shrink-0">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "S"}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {user?.full_name || "Student Scholar"}
                    </p>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      {user?.role === "admin" ? "Admin Mode" : "Enrolled Scholar"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Link>
          <button
            onClick={() => logout()}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors",
              sidebarCollapsed ? "p-2" : "px-3 py-2"
            )}
            title={sidebarCollapsed ? "Sign out" : undefined}
          >
            <LogOut className="h-3.5 w-3.5" />
            {!sidebarCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300 ease-in-out">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4 transition-colors shrink-0">
          {/* Mobile hamburger & brand (compact, visible on < lg) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button 
              onClick={() => setMobileOpen(true)} 
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-xs">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-heading font-bold text-slate-900 dark:text-white text-base">SkillsMap</span>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl min-w-0">
            <button
              onClick={() => setSearchModalOpen(true)}
              type="button"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/70 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-400 transition-all shadow-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
                <span className="truncate text-left">Search course notes, sectors, mentors, hackathons...</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-400 shrink-0 ml-2">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Top Quick Action Links & User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/course-docs"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-xs font-semibold hover:bg-indigo-100 transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Course Docs & PDF</span>
            </Link>

            <Link
              to="/student-lectures"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900 text-xs font-semibold hover:bg-violet-100 transition-colors"
            >
              <Video className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              <span>Lectures</span>
            </Link>

            <ThemeToggle />

            <Link
              to="/profile"
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 transition-all group shadow-xs"
              title="View Profile"
            >
              <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "S"}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {user?.full_name?.split(" ")[0] || "Profile"}
              </span>
            </Link>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 w-full pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>

      {/* Footer: 100% Full Viewport Width across the absolute bottom of the screen */}
      <Footer className="w-full relative z-20 mt-auto shrink-0" />

      {/* Mobile Bottom Navigation Bar (Fast Thumb Access) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-lg">
        <Link
          to="/dashboard"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors",
            location.pathname === "/dashboard" 
              ? "text-indigo-600 dark:text-indigo-400 font-bold" 
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          )}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link
          to="/course-docs"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors",
            location.pathname === "/course-docs" 
              ? "text-indigo-600 dark:text-indigo-400 font-bold" 
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          )}
        >
          <BookOpen className="h-4 w-4" />
          <span>Docs & PDF</span>
        </Link>
        <Link
          to="/student-lectures"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors",
            location.pathname === "/student-lectures" 
              ? "text-indigo-600 dark:text-indigo-400 font-bold" 
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          )}
        >
          <Video className="h-4 w-4" />
          <span>Lectures</span>
        </Link>
        <Link
          to="/timetable"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors",
            location.pathname === "/timetable" 
              ? "text-indigo-600 dark:text-indigo-400 font-bold" 
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          )}
        >
          <Calendar className="h-4 w-4" />
          <span>Timetable</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <Menu className="h-4 w-4" />
          <span>More</span>
        </button>
      </nav>

      <Chatbot />
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </div>
  );
}
