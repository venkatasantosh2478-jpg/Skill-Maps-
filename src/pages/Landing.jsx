import React from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import {
  Sparkles, Upload, Map, Radar, BookOpen, ClipboardCheck,
  FileSearch, Briefcase, ArrowRight, Check, Compass, Users, MessageSquare
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

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">SkillMap</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Login</Link>
            <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Learning, Real World Competency & Mentorship
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
            Your AI Academic Companion<br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">& Career Mentor</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Personalized learning paths, real-world sector competencies, and 1:1 mentorship built on your <span className="text-slate-700 font-medium">actual skills</span>. SkillMap maps what you know, what industry demands, and connects you with leaders to get you there.
          </p>
          <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
            <Link to="/dashboard" className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25 flex items-center gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/competencies" className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-indigo-600" /> Sector Scope Portal
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">Direct access to your Competency Dashboard · No waitlist</p>
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
            <div key={s.title} className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
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
              <div key={f.title} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
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
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-10 sm:p-14 text-center text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
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
        <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25">
          Get Started Free <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Dynamic Institutional Footer */}
      <Footer />
    </div>
  );
}