import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  X, 
  Compass, 
  Users, 
  GraduationCap, 
  Trophy, 
  Briefcase, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStoredSectors, getStoredMentors, getStoredEvents, getStoredFreelanceGigs } from "@/lib/dataStore";
import { SKILL_TRACKS } from "@/lib/quizBank";

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load dataset
  const sectors = useMemo(() => getStoredSectors(), [isOpen]);
  const mentors = useMemo(() => getStoredMentors(), [isOpen]);
  const events = useMemo(() => getStoredEvents(), [isOpen]);
  const gigs = useMemo(() => getStoredFreelanceGigs(), [isOpen]);

  // Extract all distinct learning modules/skills from SKILL_TRACKS
  const learningModules = useMemo(() => {
    const map = new Map();
    Object.entries(SKILL_TRACKS).forEach(([track, skills]) => {
      skills.forEach((skill) => {
        if (!map.has(skill)) {
          map.set(skill, { skill, track });
        }
      });
    });
    return Array.from(map.values());
  }, []);

  // Filter items based on query
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches = [];

    // 1. Sectors
    sectors.forEach((s) => {
      const nameMatch = s.name?.toLowerCase().includes(q);
      const tagMatch = s.tagline?.toLowerCase().includes(q);
      const compMatch = s.coreCompetencies?.some(c => c.name?.toLowerCase().includes(q));
      if (nameMatch || tagMatch || compMatch) {
        matches.push({
          id: `sec_${s.id}`,
          type: "Sector",
          icon: Compass,
          title: s.name,
          subtitle: s.tagline || s.category,
          badge: "Real World Scope",
          color: "indigo",
          action: () => {
            onClose();
            navigate(`/competencies?sector=${s.id}`);
          }
        });
      }
    });

    // 2. Mentors
    mentors.forEach((m) => {
      const nameMatch = m.name?.toLowerCase().includes(q);
      const roleMatch = m.role?.toLowerCase().includes(q);
      const companyMatch = m.company?.toLowerCase().includes(q);
      const specMatch = m.specialties?.some(sp => sp.toLowerCase().includes(q));
      if (nameMatch || roleMatch || companyMatch || specMatch) {
        matches.push({
          id: `men_${m.id}`,
          type: "Mentor",
          icon: Users,
          title: m.name,
          subtitle: `${m.role} at ${m.company}`,
          badge: "1:1 Booking",
          color: "violet",
          action: () => {
            onClose();
            navigate(`/mentorship?mentor=${m.id}`);
          }
        });
      }
    });

    // 3. Learning Modules / Skills
    learningModules.forEach((mod) => {
      if (mod.skill.toLowerCase().includes(q) || mod.track.toLowerCase().includes(q)) {
        matches.push({
          id: `mod_${mod.skill}`,
          type: "Learning Module",
          icon: GraduationCap,
          title: mod.skill,
          subtitle: `${mod.track} Curriculum & Roadmap Phase`,
          badge: "Curriculum",
          color: "emerald",
          action: () => {
            onClose();
            navigate(`/roadmap`);
          }
        });
      }
    });

    // 4. Events & Hackathons
    events.forEach((e) => {
      const titleMatch = e.title?.toLowerCase().includes(q);
      const typeMatch = e.type?.toLowerCase().includes(q);
      const tagMatch = e.tags?.some(t => t.toLowerCase().includes(q));
      if (titleMatch || typeMatch || tagMatch) {
        matches.push({
          id: `ev_${e.id}`,
          type: "Event",
          icon: Trophy,
          title: e.title,
          subtitle: `${e.type} · ${e.prizePool || e.mode}`,
          badge: e.type,
          color: "amber",
          action: () => {
            onClose();
            navigate(`/events?id=${e.id}`);
          }
        });
      }
    });

    // 5. Freelance Gigs
    gigs.forEach((g) => {
      const titleMatch = g.title?.toLowerCase().includes(q);
      const clientMatch = g.client?.toLowerCase().includes(q);
      const skillMatch = g.skillsRequired?.some(sk => sk.toLowerCase().includes(q));
      if (titleMatch || clientMatch || skillMatch) {
        matches.push({
          id: `gig_${g.id}`,
          type: "Freelance",
          icon: Briefcase,
          title: g.title,
          subtitle: `${g.client} · ${g.payout}`,
          badge: "Stipend Gig",
          color: "sky",
          action: () => {
            onClose();
            navigate(`/freelance?id=${g.id}`);
          }
        });
      }
    });

    // 6. Platform Tools & Engines
    const tools = [
      {
        id: "tool_leaderboard",
        title: "Competitive Leaderboard",
        subtitle: "Global & university student rankings, podium standings, and live XP",
        keywords: ["leaderboard", "rank", "ranking", "top", "xp", "podium", "standing"],
        route: "/leaderboard",
        badge: "Rankings",
        color: "amber"
      },
      {
        id: "tool_profile",
        title: "Student Profile & Career Roadmap",
        subtitle: "View institutional rank, mastery progress, and download roadmap PDF",
        keywords: ["profile", "roadmap", "download", "rank", "ranking", "progress"],
        route: "/profile",
        badge: "Profile",
        color: "indigo"
      },
      {
        id: "tool_code_quiz",
        title: "Code Quiz & In-Browser IDE",
        subtitle: "Solve algorithmic coding challenges with live execution and test suites",
        keywords: ["code", "ide", "quiz", "coding", "editor", "challenge", "test"],
        route: "/code-quiz",
        badge: "IDE",
        color: "emerald"
      },
      {
        id: "tool_course_docs",
        title: "Course Docs & Full Course PDF",
        subtitle: "Structured engineering curriculum with 'Explain Like I'm 10' analogies",
        keywords: ["doc", "docs", "pdf", "handbook", "full course", "course", "eli5", "10 year"],
        route: "/course-docs",
        badge: "Curriculum",
        color: "indigo"
      },
      {
        id: "tool_resume",
        title: "ATS Resume Generator",
        subtitle: "Build, preview, and download a customized technical resume PDF",
        keywords: ["resume", "cv", "resume generator", "ats", "generator"],
        route: "/resume-generator",
        badge: "Tool",
        color: "violet"
      },
      {
        id: "tool_timetable",
        title: "Weekly Timetable Generator",
        subtitle: "Personalized study schedule with spaced repetition and Pomodoro timer",
        keywords: ["timetable", "time table", "schedule", "calendar", "study plan", "pomodoro"],
        route: "/timetable",
        badge: "Planner",
        color: "teal"
      }
    ];

    tools.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.keywords.some(k => k.includes(q))) {
        matches.push({
          id: t.id,
          type: "Feature",
          icon: Sparkles,
          title: t.title,
          subtitle: t.subtitle,
          badge: t.badge,
          color: t.color,
          action: () => {
            onClose();
            navigate(t.route);
          }
        });
      }
    });

    return matches.slice(0, 12);
  }, [query, sectors, mentors, learningModules, events, gigs, navigate, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length ? (prev + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === "Enter") {
        if (results[selectedIndex]) {
          e.preventDefault();
          results[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  const quickPills = [
    { label: "Software Field", q: "Software" },
    { label: "AI Hackathons", q: "AI" },
    { label: "David Kim (Stripe)", q: "David Kim" },
    { label: "System Design", q: "System Design" },
    { label: "React Gigs", q: "React" },
    { label: "FinTech", q: "FinTech" },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 ml-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search sectors, mentors, learning modules, hackathons, or gigs..."
            className="w-full px-3.5 py-1.5 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results / Empty View */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {query.trim() === "" ? (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Quick Recommendations
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {quickPills.map((pill) => (
                  <button
                    key={pill.label}
                    onClick={() => {
                      setQuery(pill.q);
                      setSelectedIndex(0);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div 
                  onClick={() => { onClose(); navigate("/competencies"); }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors"
                >
                  <Compass className="h-5 w-5 text-indigo-600 mb-1.5" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Real World Sectors</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Software, MedTech, FinTech & Scope</p>
                </div>
                <div 
                  onClick={() => { onClose(); navigate("/mentorship"); }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors"
                >
                  <Users className="h-5 w-5 text-violet-600 mb-1.5" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">1:1 Mentorship</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Book sessions with Staff leaders</p>
                </div>
                <div 
                  onClick={() => { onClose(); navigate("/events"); }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors"
                >
                  <Trophy className="h-5 w-5 text-amber-500 mb-1.5" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Hackathons & Events</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Prize pools, summits & challenges</p>
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No matching items found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for a sector (e.g. "Software"), mentor name, or learning module.</p>
            </div>
          ) : (
            results.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all",
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 text-slate-900 dark:text-white"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                      item.type === "Sector" && "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300",
                      item.type === "Mentor" && "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300",
                      item.type === "Learning Module" && "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300",
                      item.type === "Event" && "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300",
                      item.type === "Freelance" && "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{item.title}</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400">
                      {item.badge}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigate with <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px]">↓</kbd></span>
            <span>Select with <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px]">↵</kbd></span>
          </div>
          <span>SkillsMap Unified Global Index</span>
        </div>
      </div>
    </div>
  );
}
