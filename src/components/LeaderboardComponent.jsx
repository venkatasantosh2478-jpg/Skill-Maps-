import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  BookOpen
} from "lucide-react";
import { getStoredLeaderboard, getCurrentUserRank } from "@/data/leaderboardData";
import { cn } from "@/lib/utils";

export default function LeaderboardComponent({ compact = false, showHeader = true, title = "Academic & Performance Leaderboard" }) {
  const [students, setStudents] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [filter, setFilter] = useState("xp"); // 'xp' | 'quizzes' | 'modules' | 'code'
  const [justEarned, setJustEarned] = useState(false);

  const refreshData = () => {
    const list = getStoredLeaderboard();
    setStudents(list);
    setMyRank(getCurrentUserRank());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener("skillsmap_leaderboard_update", handleUpdate);
    return () => window.removeEventListener("skillsmap_leaderboard_update", handleUpdate);
  }, []);

  const sortedStudents = [...students].sort((a, b) => {
    if (filter === "quizzes") return b.quizzesCompleted - a.quizzesCompleted;
    if (filter === "modules") return (b.modulesCompleted || 0) - (a.modulesCompleted || 0);
    if (filter === "code") return b.codeChallengesSolved - a.codeChallengesSolved;
    return b.xp - a.xp;
  });

  const topThree = sortedStudents.slice(0, 3);
  const displayList = compact ? sortedStudents.slice(0, 5) : sortedStudents;

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Trophy className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">{title}</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Live ranking computed from module completions, verified quizzes, and code assessments.
            </p>
          </div>

          {/* Metric Sort Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setFilter("xp")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all",
                filter === "xp"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
            >
              Overall XP
            </button>
            <button
              onClick={() => setFilter("modules")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all",
                filter === "modules"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
            >
              Modules
            </button>
            <button
              onClick={() => setFilter("quizzes")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all",
                filter === "quizzes"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
            >
              Quizzes
            </button>
            <button
              onClick={() => setFilter("code")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all",
                filter === "code"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
            >
              Code IDE
            </button>
          </div>
        </div>
      )}

      {/* Top 3 Podium (Who tops is shown in top) */}
      {!compact && topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Rank 2 */}
          <div className="order-2 md:order-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center relative shadow-xs">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-600">
              #2 Silver
            </div>
            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xl mt-2 border border-slate-200 dark:border-slate-700">
              {topThree[1]?.avatar || "2"}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">{topThree[1]?.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{topThree[1]?.university}</p>
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-lg">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{topThree[1]?.xp} XP · {topThree[1]?.modulesCompleted || 7} Mods</span>
            </div>
          </div>

          {/* Rank 1 (Supreme Top) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900 border-2 border-amber-400/50 dark:border-amber-500/30 rounded-2xl p-6 flex flex-col items-center text-center relative shadow-md">
            <div className="absolute -top-3.5 px-4 py-1 rounded-full bg-amber-500 text-white text-xs font-black tracking-wider flex items-center gap-1 shadow-sm">
              <Trophy className="h-3.5 w-3.5" /> TOP RANK #1
            </div>
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white font-extrabold flex items-center justify-center text-2xl mt-1 shadow-lg ring-4 ring-amber-100 dark:ring-amber-900/50">
              {topThree[0]?.avatar || "1"}
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white mt-3 text-base">{topThree[0]?.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{topThree[0]?.track}</p>
            <span className="text-2xs font-semibold px-2 py-0.5 mt-1 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
              {topThree[0]?.badge || "Grandmaster"}
            </span>
            <div className="mt-3 flex items-center gap-2 text-sm font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-4 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
              <Sparkles className="h-4 w-4" />
              <span>{topThree[0]?.xp} XP · {topThree[0]?.modulesCompleted || 8} Modules</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="order-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center relative shadow-xs">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-700/30">
              #3 Bronze
            </div>
            <div className="h-16 w-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-xl mt-2 border border-amber-200 dark:border-amber-800">
              {topThree[2]?.avatar || "3"}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">{topThree[2]?.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{topThree[2]?.university}</p>
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-lg">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{topThree[2]?.xp} XP · {topThree[2]?.modulesCompleted || 6} Mods</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table / Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-2xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Student & Track</th>
                <th className="py-3 px-4 text-center">Modules</th>
                <th className="py-3 px-4 text-center">Quizzes</th>
                <th className="py-3 px-4 text-center">Code Tests</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayList.map((student, idx) => {
                const isMe = student.isCurrentUser;
                const effectiveRank = idx + 1;

                return (
                  <tr 
                    key={student.id}
                    className={cn(
                      "transition-colors",
                      isMe 
                        ? "bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold"
                        : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    )}
                  >
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {effectiveRank === 1 ? (
                          <span className="h-6 w-6 rounded-full bg-amber-500 text-white font-bold text-2xs flex items-center justify-center shadow-xs">
                            1
                          </span>
                        ) : effectiveRank === 2 ? (
                          <span className="h-6 w-6 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white font-bold text-2xs flex items-center justify-center">
                            2
                          </span>
                        ) : effectiveRank === 3 ? (
                          <span className="h-6 w-6 rounded-full bg-amber-700/60 text-white font-bold text-2xs flex items-center justify-center">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold">#{effectiveRank}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs text-white",
                          isMe ? "bg-indigo-600" : "bg-slate-700"
                        )}>
                          {student.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              {student.name}
                            </span>
                            {isMe && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-3xs uppercase font-extrabold">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-3xs text-slate-500 dark:text-slate-400">
                            {student.track} · {student.university}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                      <div className="inline-flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-indigo-500" />
                        <span>{student.modulesCompleted || 5}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                      <div className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        <span>{student.quizzesCompleted}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                      <div className="inline-flex items-center gap-1">
                        <Code2 className="h-3 w-3 text-amber-500" />
                        <span>{student.codeChallengesSolved}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
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
