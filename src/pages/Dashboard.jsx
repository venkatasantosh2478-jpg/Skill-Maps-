import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, avgCompetency, generateNextAction, updateProfile, addActivity, bumpSkill } from "@/lib/skillMap";
import { skillsMap } from "@/api/skillsMapClient";
import CompetencyPieChart from "@/components/CompetencyPieChart";
import ActivityFeed from "@/components/ActivityFeed";
import SkillBadge from "@/components/SkillBadge";
import SkillGapChart from "@/components/SkillGapChart";
import BookingCalendar from "@/components/BookingCalendar";
import { 
  Loader2, 
  TrendingUp, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Award, 
  Zap, 
  BookOpen,
  Plus,
  Minus,
  Compass,
  Users,
  Trophy,
  DollarSign,
  FileText,
  Crown
} from "lucide-react";
import { getCurrentUserRank } from "@/data/leaderboardData";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  const load = async () => {
    const p = await getMyProfile();
    setProfile(p);
    setUserRank(getCurrentUserRank());
    setLoading(false);
    if (p) {
      setLoadingSuggestion(true);
      const s = await generateNextAction(p.competencyGraph, p.careerGoal || "Full Stack Software Engineer");
      setSuggestion(s);
      setLoadingSuggestion(false);
      try {
        const ss = await skillsMap.entities.GuidanceSession.list();
        setSessions(ss.filter((x) => x.status === "scheduled").sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (e) {}
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm animate-pulse">
          <Sparkles className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-500">Loading your competency profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">Welcome to Skills Map</h2>
        <p className="text-slate-500 text-sm mb-6">Let's set up your baseline skill competencies and career target.</p>
        <button 
          onClick={() => navigate("/onboarding")} 
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 hover:brightness-105 transition-all"
        >
          Begin Skill Onboarding
        </button>
      </div>
    );
  }

  const avg = Math.round(avgCompetency(profile.competencyGraph) * 100);
  const upcomingSessions = sessions.slice(0, 3);
  const skills = profile.competencyGraph || [];
  const expertCount = skills.filter((s) => (s.level || 0) >= 0.7).length;

  const markSkill = async (skill, delta) => {
    const newGraph = bumpSkill(profile.competencyGraph, skill, delta);
    const newLog = addActivity(profile.activityLog, `Updated ${skill} proficiency`, skill, delta);
    const updated = await updateProfile(profile.id, { competencyGraph: newGraph, activityLog: newLog });
    setProfile({ ...profile, ...updated });
  };

  const filteredSkills = skills.filter((s) => {
    if (activeFilter === "mastered") return s.level >= 0.7;
    if (activeFilter === "growth") return s.level < 0.7;
    return true;
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-body">
      {/* Modern Welcome Banner */}
      <div 
        className="animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-8 w-48 h-48 rounded-full bg-violet-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {profile.track || "Software"} Track
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300">
                <Target className="h-3.5 w-3.5 text-indigo-400" />
                Target: {profile.careerGoal || "Full Stack Engineer"}
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2 flex-wrap">
              <span>{(() => {
                const hour = new Date().getHours();
                if (hour >= 5 && hour < 12) return "Good morning";
                if (hour >= 12 && hour < 17) return "Good afternoon";
                if (hour >= 17 && hour < 22) return "Good evening";
                return "Welcome back";
              })()}, {profile.name?.split(" ")[0] || "Student"}</span> 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Your career readiness is currently tracking at <strong className="text-white font-semibold">{avg}% overall competency</strong>. 
              {expertCount > 0 ? ` You have achieved advanced mastery across ${expertCount} key domains.` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              onClick={() => navigate("/roadmap")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold backdrop-blur-sm border border-white/15 flex items-center gap-2 transition-colors"
            >
              <Zap className="h-4 w-4 text-amber-400" /> View Roadmap
            </button>
            <button 
              onClick={() => setBookingOpen(true)} 
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Calendar className="h-4 w-4" /> Book Mentor Session
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={TrendingUp} 
          label="Overall Competency" 
          value={`${avg}%`} 
          subtext="+4.5% this month"
          color="indigo" 
        />
        <StatCard 
          icon={Target} 
          label="Target Mastery Goal" 
          value={profile.careerGoal ? profile.careerGoal.split(" ")[0] : "SWE"} 
          subtext="High market demand"
          color="violet" 
        />
        <StatCard 
          icon={Award} 
          label="Skills Tracked" 
          value={skills.length} 
          subtext={`${expertCount} at advanced level`}
          color="emerald" 
        />
        <StatCard 
          icon={Calendar} 
          label="Mentorship Sessions" 
          value={sessions.length} 
          subtext={upcomingSessions.length ? `${upcomingSessions.length} upcoming` : "Ready to schedule"}
          color="amber" 
        />
      </div>

      {/* Institutional Leaderboard & Rank Standing Bar */}
      {userRank && (
        <div 
          onClick={() => navigate("/leaderboard")}
          className="bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-violet-500/15 dark:from-amber-950/40 dark:via-indigo-950/30 dark:to-violet-950/40 rounded-3xl p-5 border border-amber-300/60 dark:border-amber-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md group-hover:scale-105 transition-transform">
              <Crown className="h-6 w-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Institutional Rank Standing
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                  {userRank.tier}
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-slate-900 dark:text-white text-base">
                You are currently ranked <span className="text-amber-600 dark:text-amber-400 font-black">#{userRank.rank}</span> out of {userRank.totalStudents} students ({userRank.percentile})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-200 self-start sm:self-auto">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Zap className="h-4 w-4 fill-amber-500" /> {userRank.xp.toLocaleString()} XP
            </span>
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-amber-500 group-hover:text-white transition-colors flex items-center gap-1">
              <span>View Leaderboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Academic & Practical Tools Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate("/competencies")}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Compass className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Real Competencies</h4>
            <p className="text-[10px] text-slate-400 truncate">Industry scopes & tech</p>
          </div>
        </div>

        <div 
          onClick={() => navigate("/course-docs")}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-400 cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Full Course Docs</h4>
            <p className="text-[10px] text-slate-400 truncate">ELI5 + PDF handbook</p>
          </div>
        </div>

        <div 
          onClick={() => navigate("/resume-generator")}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-violet-400 cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Resume Generator</h4>
            <p className="text-[10px] text-slate-400 truncate">ATS-ready PDF export</p>
          </div>
        </div>

        <div 
          onClick={() => navigate("/timetable")}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-teal-400 cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Weekly Timetable</h4>
            <p className="text-[10px] text-slate-400 truncate">Spaced schedule & timer</p>
          </div>
        </div>
      </div>

      {/* Featured Portals & Hubs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
            Student Opportunity Portals & Hubs
          </h2>
          <span className="text-xs text-slate-400">Verified institutional network</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Portal 1: Hackathons & Events */}
          <div 
            onClick={() => navigate("/events")}
            className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-5 rounded-3xl border border-indigo-800/60 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
                  <Trophy className="h-5 w-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  $140K+ PRIZES
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors">
                Hackathons & Tech Events
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                Join global AI hackathons, cloud challenges, and system architecture sprints.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-300">
              <span>View Hackathons</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Portal 2: Student Freelancing Gigs */}
          <div 
            onClick={() => navigate("/freelance")}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 border border-sky-100 dark:border-sky-900 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">
                  PAID STIPENDS
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                Student Freelancing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Apply for React UI components, FastAPI pipelines, and AI engineering projects.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Browse Gigs</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Portal 3: Real World Competency Scope */}
          <div 
            onClick={() => navigate("/competencies")}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                  2025–2030 SCOPE
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                Real World Competency
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Explore CAGR trends, salary benchmarks, and core skills across 8 sectors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Explore Sectors</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Portal 4: 1:1 Industry Mentorship */}
          <div 
            onClick={() => navigate("/mentorship")}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-violet-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-violet-900 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900">
                  STAFF LEADERS
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                1:1 Industry Mentors
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Book mock technical interviews and portfolio critiques with verified mentors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-violet-600 dark:text-violet-400">
              <span>Book a Session</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Competency Distribution Pie Chart</h2>
              <p className="text-xs text-slate-400">Proportional evaluation across core engineering capabilities</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Live Profile
            </span>
          </div>
          <div className="pt-2">
            <CompetencyPieChart graph={profile.competencyGraph} height={340} />
          </div>
        </div>

        {/* AI Next Action Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white shadow-lg shadow-indigo-600/20 flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-white text-base">Next Learning Priority</h2>
                  <p className="text-[11px] text-indigo-200">Personalized Gemini AI Advice</p>
                </div>
              </div>
            </div>

            {loadingSuggestion ? (
              <div className="flex items-center gap-2 text-indigo-100 text-xs py-8">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Synthesizing your competency gaps...</span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 my-2">
                <p className="text-xs sm:text-sm text-indigo-50 leading-relaxed font-normal">
                  {suggestion}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 mt-auto">
            <button 
              onClick={() => navigate("/resources")} 
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-white text-indigo-900 hover:bg-indigo-50 py-3 rounded-xl transition-all shadow-md"
            >
              <BookOpen className="h-4 w-4" /> Explore Matched Resources <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Skill Gap Analysis Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <SkillGapChart competencyGraph={profile.competencyGraph} roadmap={profile.roadmap} />
        </div>

        {/* Upcoming Guidance Sessions */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900">Mentor Guidance</h2>
              <p className="text-xs text-slate-400">1-on-1 career counselling</p>
            </div>
            <button 
              onClick={() => setBookingOpen(true)} 
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              + Book
            </button>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="text-center py-8 my-auto border border-dashed border-slate-200 rounded-2xl p-4">
              <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-600 mb-1">No upcoming sessions</p>
              <p className="text-[11px] text-slate-400 mb-4">Get personalized feedback from industry mentors</p>
              <button 
                onClick={() => setBookingOpen(true)} 
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
              >
                Schedule First Session
              </button>
            </div>
          ) : (
            <div className="space-y-3 my-auto">
              {upcomingSessions.map((s) => (
                <div key={s.id} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{s.counselor}</p>
                    <p className="text-[11px] text-indigo-600 font-medium">
                      {new Date(s.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {s.timeSlot}
                    </p>
                    {s.topic && <p className="text-[11px] text-slate-500 mt-0.5 truncate">{s.topic}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Skill Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Interactive Skill Matrix</h2>
              <p className="text-xs text-slate-400">Click +/- to adjust and simulate skill advancement</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
              <button 
                onClick={() => setActiveFilter("all")} 
                className={`px-3 py-1 rounded-lg transition-colors ${activeFilter === "all" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "hover:text-slate-900"}`}
              >
                All ({skills.length})
              </button>
              <button 
                onClick={() => setActiveFilter("mastered")} 
                className={`px-3 py-1 rounded-lg transition-colors ${activeFilter === "mastered" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "hover:text-slate-900"}`}
              >
                Mastered ({expertCount})
              </button>
              <button 
                onClick={() => setActiveFilter("growth")} 
                className={`px-3 py-1 rounded-lg transition-colors ${activeFilter === "growth" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "hover:text-slate-900"}`}
              >
                Growth Gaps ({skills.length - expertCount})
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredSkills.map((s) => (
              <div key={s.skill} className="flex items-center justify-between gap-4 py-3 group">
                <div className="flex-1 min-w-0">
                  <SkillBadge skill={s.skill} level={s.level} />
                </div>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => markSkill(s.skill, -0.05)} 
                    title="Decrease 5%"
                    className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => markSkill(s.skill, 0.05)} 
                    title="Increase 5%"
                    className="h-7 w-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900">Activity Timeline</h2>
              <p className="text-xs text-slate-400">Logged milestone progress</p>
            </div>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <ActivityFeed log={profile.activityLog} />
        </div>
      </div>

      {bookingOpen && <BookingCalendar onClose={() => setBookingOpen(false)} onBooked={load} />}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtext, color }) {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50 text-indigo-600",
      pill: "text-indigo-600 bg-indigo-50/80",
    },
    violet: {
      bg: "bg-violet-50 text-violet-600",
      pill: "text-violet-600 bg-violet-50/80",
    },
    emerald: {
      bg: "bg-emerald-50 text-emerald-600",
      pill: "text-emerald-600 bg-emerald-50/80",
    },
    amber: {
      bg: "bg-amber-50 text-amber-600",
      pill: "text-amber-600 bg-amber-50/80",
    },
  };

  const style = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${style.bg} transition-transform group-hover:scale-105`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-1 truncate">{label}</p>
      {subtext && (
        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{subtext}</p>
      )}
    </div>
  );
}
