import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  LogOut, 
  Sparkles, 
  ArrowLeft, 
  Compass,
  Trophy,
  DollarSign,
  UserCheck,
  PhoneCall,
  Video,
  X,
  Menu
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import AdminAccessDenied from "@/components/AdminAccessDenied";

const navSections = [
  {
    heading: "PORTAL & CONTENT CMS",
    items: [
      { to: "/admin/lectures", label: "Video Lectures", icon: Video, badge: "Manage" },
      { to: "/admin/sectors", label: "Industry Sectors", icon: Compass, badge: "New" },
      { to: "/admin/mentors", label: "1:1 Mentors", icon: UserCheck, badge: "New" },
      { to: "/admin/events", label: "Hackathons & Events", icon: Trophy, badge: "New" },
      { to: "/admin/freelance", label: "Freelancing Gigs", icon: DollarSign, badge: "New" },
    ]
  },
  {
    heading: "INSTITUTIONAL METRICS & USERS",
    items: [
      { to: "/admin/overview", label: "Cohort Overview", icon: BarChart3 },
      { to: "/admin/students", label: "Users & Download Reports", icon: Users, badge: "Export" },
      { to: "/admin/footer-settings", label: "Footer & Contact Details", icon: PhoneCall, badge: "Live" },
      { to: "/admin/course-tracking", label: "Syllabus Progress", icon: GraduationCap },
      { to: "/admin/resources", label: "Curriculum Resources", icon: BookOpen },
      { to: "/admin/opportunities", label: "HR & Employer Match", icon: Briefcase },
    ]
  }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll on mobile drawer
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

  // Strict student access restriction: Students CANNOT access the admin panel
  if (!user || user.role !== "admin") {
    return <AdminAccessDenied />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex font-body antialiased">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 h-screen z-50 w-72 bg-[#090d16] border-r border-slate-800/80 flex flex-col transition-transform duration-300 shadow-xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/admin/overview" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-violet-600/30 shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-heading font-extrabold text-white tracking-tight text-lg truncate">SkillsMap</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 shrink-0">ADMIN</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">Faculty & CMS Management</p>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-5 overflow-y-auto custom-scrollbar">
          {navSections.map((section) => (
            <div key={section.heading} className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
                {section.heading}
              </p>
              {section.items.map((item) => {
                const active = location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150",
                      active
                        ? "bg-violet-600/20 text-violet-300 font-semibold border border-violet-500/30 shadow-inner"
                        : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-violet-400" : "text-slate-400")} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-500/30 text-violet-200 shrink-0">
                        {item.badge}
                      </span>
                    )}
                    {active && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-violet-500 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/70 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 text-slate-400" />
              <span>Back to Student App</span>
            </div>
            <span className="text-[10px] bg-slate-700/60 px-1.5 py-0.5 rounded text-slate-300">View</span>
          </Link>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden transition-opacity" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0b1120]">
        <header className="lg:hidden sticky top-0 z-20 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setMobileOpen(true)} 
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading font-bold text-white text-base">SkillsMap Admin</span>
          </div>
          <Link 
            to="/dashboard" 
            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold"
          >
            Student View
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
