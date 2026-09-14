import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { getMyProfile } from "@/lib/skillMap";
import {
  Sparkles, Upload, Map, Radar, BookOpen, ClipboardCheck,
  FileSearch, Briefcase, ArrowRight, Check, Compass, Users, MessageSquare,
  LayoutDashboard, UserCheck
} from "lucide-react";

const FEATURES = [
  { icon: Compass, title: "Real World Competency & Scope", desc: "Explore market benchmarks, 2025–2030 future trends, and salaries across Software, Service, AI, FinTech, and 8 sectors." },
  { icon: Users, title: "1:1 Industry Mentorship", desc: "Book direct sessions with Principal Architects and Consulting Directors for mock interviews, code reviews, and strategy." },
  { icon: MessageSquare, title: "Community & Peer Chat", desc: "Active general student chat channels and direct peer contact directory for pair programming and study collabs." },
  { icon: Radar, title: "Skill Profiling", desc: "AI builds a competency graph from your resume & a quick diagnostic." },
  { icon: Map, title: "Roadmap Generator", desc: "Get a personalized, milestone-based learning path to your career goal." },
  { icon: FileSearch, title: "Resume Intelligence", desc: "Compare your resume to any job description and close skill gaps." },
  { icon: Briefcase, title: "Opportunity Recommendation", desc: "Projects, internships & roles ranked by your missing skills." },
  { icon: ClipboardCheck, title: "Adaptive Assessment", desc: "Quizzes that adjust difficulty as you prove your mastery." },
  { icon: BookOpen, title: "Resource Recommendation", desc: "Curated courses & articles matched to your current skill level." },
];

const STEPS = [
  { icon: Upload, title: "Upload & Profile", desc: "Upload your resume or pick a track to generate your live competency radar." },
  { icon: Compass, title: "Explore Sector Scope", desc: "Review real-world competencies and 2030 outlook across every industry sector." },
  { icon: Map, title: "Follow AI Roadmap", desc: "Receive an adaptive, milestone-based learning roadmap to close gaps." },
  { icon: Users, title: "1:1 Mentorship & Community", desc: "Connect with verified senior leaders and peers to accelerate your career." },
];

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Welcome back";
};

export default function Landing() {
  const { user, isAuthenticated, logout } = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getMyProfile().then((prof) => {
        if (prof) setStudentProfile(prof);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const rawName = studentProfile?.name || user?.displayName || user?.full_name || user?.name || user?.email?.split("@")[0] || "";
  const firstName = rawName ? rawName.trim().split(" ")[0] : "";
  const timeGreeting = getTimeGreeting();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav Header */}
      <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 animate-in fade-in slide-in-from-top-3 duration-500">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 font-heading tracking-tight">SkillMap</span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Hi, {firstName || "Student"}</span>
                </Link>
                <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                  <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20 flex items-center gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
                <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                  <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20 block">
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none animate-pulse duration-1000" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl pointer-events-none animate-pulse duration-1000" />

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both">
            {isAuthenticated && firstName ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 text-indigo-700 text-xs sm:text-sm font-semibold mb-6 border border-indigo-200/80 shadow-xs backdrop-blur-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{timeGreeting}, <strong className="text-indigo-900 font-bold">{firstName}</strong>! 👋</span>
                <span className="hidden sm:inline text-indigo-300">|</span>
                <span className="hidden sm:inline text-indigo-600/90 font-normal">Ready to continue mapping your skills?</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-100/90 text-indigo-700 text-xs font-semibold mb-6 border border-indigo-200/60 shadow-xs backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" /> AI-Powered Learning, Real World Competency & Mentorship
              </div>
            )}
          </div>

          <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-600 delay-100 fill-mode-both text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {isAuthenticated && firstName ? (
              <>
                Welcome back, <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">{firstName}</span> 👋<br />
                <span className="text-2xl sm:text-3xl lg:text-4xl text-slate-700 font-bold block mt-2">
                  Your AI Academic & Career Roadmap Awaits
                </span>
              </>
            ) : (
              <>
                Your AI Academic Companion<br />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  & Career Mentor
                </span>
              </>
            )}
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-5 duration-600 delay-200 fill-mode-both mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {isAuthenticated && firstName ? (
              <>
                Great to see you again! Your <strong className="text-slate-900 font-semibold">{studentProfile?.track || "Competency"} track</strong> is active. Jump straight back into your competency radar, review milestone tasks, or connect with a mentor.
              </>
            ) : (
              <>
                Personalized learning paths, real-world sector competencies, and 1:1 mentorship built on your <span className="text-slate-900 font-semibold">actual skills</span>. SkillMap maps what you know, what industry demands, and connects you with leaders to get you there.
              </>
            )}
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-600 delay-300 fill-mode-both mt-9 flex items-center justify-center gap-3 flex-wrap">
            {isAuthenticated ? (
              <>
                <div className="transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                  <Link to="/dashboard" className="px-6 py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Go to My Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                  <Link to="/roadmap" className="px-6 py-3.5 rounded-xl border border-indigo-200 bg-indigo-50/60 text-indigo-700 text-sm font-semibold hover:bg-indigo-100/80 transition-all flex items-center gap-1.5 shadow-2xs">
                    <Map className="h-4 w-4 text-indigo-600" /> My Learning Roadmap
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                  <Link to="/dashboard" className="px-6 py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                  <Link to="/competencies" className="px-6 py-3.5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-xs text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs">
                    <Compass className="h-4 w-4 text-indigo-600" /> Sector Scope Portal
                  </Link>
                </div>
              </>
            )}
          </div>

          {isAuthenticated ? (
            <p className="animate-in fade-in duration-600 delay-400 fill-mode-both mt-4 text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              Authenticated as <strong className="text-slate-700">{user?.email || firstName}</strong> · Live Competency Synchronized
            </p>
          ) : (
            <p className="animate-in fade-in duration-600 delay-400 fill-mode-both mt-4 text-xs text-slate-400 font-medium">
              Direct access to your Competency Dashboard · No waitlist
            </p>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
          <p className="text-slate-500 mt-2">Four steps from where you are to where you want to be.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div 
              key={s.title}
              className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-300">STEP {i + 1}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 text-slate-200">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to grow</h2>
            <p className="text-slate-500 mt-2">Seven modules, one unified competency graph.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div 
                key={f.title}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It's Different */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div 
          className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-10 sm:p-14 text-center text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why SkillMap is different</h2>
            <p className="text-indigo-50 text-lg leading-relaxed max-w-2xl mx-auto">
              Unlike generic platforms, SkillMap builds a <span className="font-semibold text-white">live competency graph</span> from your real skills and updates it as you learn — so every recommendation, assessment, and career suggestion is grounded in who you actually are today.
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
              {["Live competency graph", "Adaptive to your progress", "AI career guidance"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-sm text-indigo-50">
                  <Check className="h-4 w-4" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to map your skills?</h2>
        <p className="text-slate-500 mb-6">Start with a 2-minute skill profile and get your personalized roadmap.</p>
        <div className="inline-block transition-transform duration-200 hover:scale-105 active:scale-95">
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Dynamic Institutional Footer */}
      <Footer />
    </div>
  );
}