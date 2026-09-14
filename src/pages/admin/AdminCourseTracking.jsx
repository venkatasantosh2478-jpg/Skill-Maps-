import React, { useEffect, useState } from "react";
import { skillsMap } from "@/api/skillsMapClient";
import { 
  Loader2, 
  Award, 
  Flame, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Clock,
  GraduationCap
} from "lucide-react";

export default function AdminCourseTracking() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const all = await skillsMap.entities.StudentProfile.list();
      setStudents(all.filter((s) => s.courseMode?.active || s.courseMode?.dayIndex > 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter((s) => 
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.careerGoal?.toLowerCase().includes(search.toLowerCase()) ||
    s.track?.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = students.filter(s => s.courseMode?.certificateEarned || s.courseMode?.dayIndex >= 30).length;
  const avgStreak = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + (s.courseMode?.streak || 0), 0) / students.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f172a]">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit mb-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-amber-400" />
            30-DAY ACADEMIC SPRINT MONITOR
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Course Mode Progression Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time daily syllabus completion, study streaks, and certificate verification audits.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">{students.length}</p>
              <p className="text-xs text-slate-400">Enrolled in 30-Day Sprint</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">{avgStreak} Days</p>
              <p className="text-xs text-slate-400">Average Student Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">{completedCount}</p>
              <p className="text-xs text-slate-400">Certificates Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search students by name, curriculum track, or target career goal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none text-white text-xs placeholder:text-slate-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Student Learner</th>
                <th className="py-4 px-4">Career Goal & Track</th>
                <th className="py-4 px-4">Day Progress</th>
                <th className="py-4 px-4">Daily Streak</th>
                <th className="py-4 px-5 text-right">Certificate Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((s) => {
                const day = s.courseMode?.dayIndex || 1;
                const pct = Math.min(100, Math.round((day / 30) * 100));
                const earned = s.courseMode?.certificateEarned || day >= 30;

                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 font-bold flex items-center justify-center text-xs">
                          {s.name ? s.name[0]?.toUpperCase() : "S"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{s.name || "Student"}</p>
                          <p className="text-[11px] text-slate-400">{s.email || "No email listed"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-200">{s.careerGoal || "Software Engineering"}</p>
                      <p className="text-[10px] text-slate-400">{s.track || "Full-Stack"}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5 min-w-[130px]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-300">Day {day} / 30</span>
                          <span className="text-violet-400 font-bold">{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-linear-to-r from-violet-500 to-indigo-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-amber-400 text-sm">{s.courseMode?.streak || 0}</span>
                        <span className="text-[10px] text-slate-400">days</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      {earned ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Certificate Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                          <Clock className="h-3.5 w-3.5" /> In Progress
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No students currently active in Course Mode matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
