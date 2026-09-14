import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Crown, 
  Flame, 
  Code2, 
  BookOpen, 
  Zap,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStoredLeaderboard, getCurrentUserRank } from "@/data/leaderboardData";

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const loadData = () => {
    const list = getStoredLeaderboard();
    setStudents(list);
    setUserRank(getCurrentUserRank());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("skillsmap_leaderboard_update", handleUpdate);
    return () => window.removeEventListener("skillsmap_leaderboard_update", handleUpdate);
  }, []);

  const topThree = students.slice(0, 3);
  const restStudents = students.slice(3);

  const filteredList = students.filter((s) => {
    if (activeTab === "all") return true;
    if (activeTab === "swe") return s.track.toLowerCase().includes("software") || s.track.toLowerCase().includes("cloud");
    if (activeTab === "ai") return s.track.toLowerCase().includes("ai") || s.track.toLowerCase().includes("data");
    return true;
  });

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              UNIVERSITY & GLOBAL STANDINGS
            </span>
            <span className="text-xs text-slate-400">· Live XP Sync</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2.5">
            <Trophy className="h-8 w-8 text-amber-500 fill-amber-400" />
            Competitive Leaderboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Top engineering minds ranked by quizzes completed, in-browser code challenges solved, and active learning streaks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/code-quiz"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/25 transition-all"
          >
            <Code2 className="h-4 w-4" /> Solve Code Challenge (+100 XP)
          </Link>
          <Link
            to="/course-docs"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="h-4 w-4 text-indigo-600" /> Course Docs
          </Link>
        </div>
      </div>

      {/* User's Current Standing Floating Card */}
      {userRank && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-5 sm:p-6 shadow-lg shadow-indigo-950/20 border border-indigo-700/50">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-indigo-950 font-black flex items-center justify-center text-xl shadow-md">
                #{userRank.rank}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{userRank.name} (You)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
                    {userRank.badge}
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Ranked <strong className="text-white">#{userRank.rank}</strong> out of {userRank.totalStudents} students · {userRank.percentile}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <div className="text-left sm:text-right">
                <p className="text-[11px] text-indigo-300 font-medium">Total Experience</p>
                <p className="text-xl font-black text-amber-300 flex items-center gap-1">
                  <Zap className="h-4 w-4 fill-amber-300" /> {userRank.xp.toLocaleString()} XP
                </p>
              </div>
              <div className="h-8 w-px bg-indigo-700 hidden sm:block" />
              <div className="text-left sm:text-right">
                <p className="text-[11px] text-indigo-300 font-medium">Challenges Mastered</p>
                <p className="text-base font-bold text-white">
                  {userRank.codeChallengesSolved} Code · {userRank.quizzesCompleted} Quiz
                </p>
              </div>
              <div className="h-8 w-px bg-indigo-700 hidden sm:block" />
              <div className="text-left sm:text-right">
                <p className="text-[11px] text-indigo-300 font-medium">Active Streak</p>
                <p className="text-base font-bold text-amber-400 flex items-center gap-1">
                  <Flame className="h-4 w-4 fill-amber-400" /> {userRank.streakDays} Days
                </p>
              </div>
              <Link
                to="/profile"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-1 transition-colors"
              >
                <span>View Profile</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Podium for Top 3 Performers (Who tops is shown on top!) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
          <Crown className="h-4 w-4 text-amber-500" /> Top Performer Podium
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-4">
          {/* Rank #2 - Silver */}
          {topThree[1] && (
            <div className="order-2 md:order-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-slate-300 to-slate-400" />
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-sm mx-auto mb-3 border border-slate-200 dark:border-slate-700">
                🥈 #2
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-600 text-slate-800 dark:text-white font-extrabold flex items-center justify-center text-xl mx-auto mb-3 shadow-md">
                {topThree[1].avatar}
              </div>
              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base truncate">
                {topThree[1].name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-3">{topThree[1].track}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs mb-3">
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{topThree[1].xp.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
                <span>{topThree[1].codeChallengesSolved} Challenges</span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-amber-600">
                  <Flame className="h-3 w-3 fill-amber-500" /> {topThree[1].streakDays}d
                </span>
              </div>
            </div>
          )}

          {/* Rank #1 - GOLD CROWN (WHO TOPS IS PROMINENTLY SHOWN IN TOP!) */}
          {topThree[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl border-2 border-amber-400 dark:border-amber-500 p-7 text-center shadow-xl shadow-amber-500/10 relative overflow-hidden -mt-4 transform hover:scale-[1.02] transition-transform">
              <div className="absolute -top-1 inset-x-0 flex justify-center">
                <div className="px-4 py-1 rounded-b-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                  <Crown className="h-3.5 w-3.5 fill-white" /> Rank #1 Champion
                </div>
              </div>
              <div className="pt-4">
                <div className="relative inline-block mx-auto mb-3">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-400 text-amber-950 font-black flex items-center justify-center text-2xl shadow-lg ring-4 ring-amber-200 dark:ring-amber-900">
                    {topThree[0].avatar}
                  </div>
                  <div className="absolute -top-3 -right-2 h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                    <Crown className="h-4 w-4 fill-white" />
                  </div>
                </div>
                <h3 className="font-heading font-extrabold text-slate-900 dark:text-white text-lg truncate">
                  {topThree[0].name}
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold truncate mb-3">
                  {topThree[0].track}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-sm mb-4 shadow-sm">
                  <Zap className="h-4 w-4 fill-white" />
                  <span>{topThree[0].xp.toLocaleString()} XP</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] p-2.5 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700">
                  <div>
                    <p className="text-slate-400">Solved</p>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{topThree[0].codeChallengesSolved}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Quizzes</p>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{topThree[0].quizzesCompleted}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Streak</p>
                    <p className="font-bold text-amber-600 flex items-center justify-center gap-0.5">
                      <Flame className="h-3 w-3 fill-amber-500" /> {topThree[0].streakDays}d
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rank #3 - Bronze */}
          {topThree[2] && (
            <div className="order-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 to-amber-700" />
              <div className="h-10 w-10 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center text-sm mx-auto mb-3 border border-amber-200 dark:border-amber-800">
                🥉 #3
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-800 text-white font-extrabold flex items-center justify-center text-xl mx-auto mb-3 shadow-md">
                {topThree[2].avatar}
              </div>
              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base truncate">
                {topThree[2].name} {topThree[2].isCurrentUser && "(You)"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-3">{topThree[2].track}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-xs mb-3">
                <Zap className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
                <span>{topThree[2].xp.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
                <span>{topThree[2].codeChallengesSolved} Challenges</span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-amber-600">
                  <Flame className="h-3 w-3 fill-amber-500" /> {topThree[2].streakDays}d
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Table & Filtering */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Global University Rankings</h2>
            <p className="text-xs text-slate-400">Real-time standings updated after each quiz and code evaluation</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                activeTab === "all" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold" : "text-slate-500"
              )}
            >
              All Tracks
            </button>
            <button
              onClick={() => setActiveTab("swe")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                activeTab === "swe" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold" : "text-slate-500"
              )}
            >
              Software Engineering
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                activeTab === "ai" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold" : "text-slate-500"
              )}
            >
              AI & Data Science
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Focus Track</th>
                <th className="py-3 px-4">Challenges Mastered</th>
                <th className="py-3 px-4">Daily Streak</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredList.map((student) => {
                const isMe = student.isCurrentUser;
                return (
                  <tr
                    key={student.id}
                    className={cn(
                      "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors",
                      isMe ? "bg-indigo-50/60 dark:bg-indigo-950/40 font-semibold" : ""
                    )}
                  >
                    <td className="py-3.5 px-4 font-bold">
                      {student.rank === 1 ? (
                        <span className="inline-flex items-center gap-1 text-amber-500 font-black">
                          <Crown className="h-4 w-4 fill-amber-500" /> #1
                        </span>
                      ) : student.rank === 2 ? (
                        <span className="text-slate-500 font-black">🥈 #2</span>
                      ) : student.rank === 3 ? (
                        <span className="text-amber-700 font-black">🥉 #3</span>
                      ) : (
                        <span className="text-slate-400">#{student.rank}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs">
                          {student.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900 dark:text-white font-medium">
                              {student.name}
                            </span>
                            {isMe && (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[9px] font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">{student.university}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {student.track}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Code2 className="h-3 w-3 text-indigo-500" /> {student.codeChallengesSolved}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-violet-500" /> {student.quizzesCompleted}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Flame className="h-3.5 w-3.5 fill-amber-500" /> {student.streakDays}d
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white">
                      <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                        <Zap className="h-3.5 w-3.5 fill-indigo-600" />
                        {student.xp.toLocaleString()} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
