import React, { useState } from "react";
import { 
  Trophy, 
  Award, 
  Flame, 
  GraduationCap, 
  Users, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Zap, 
  BookOpen 
} from "lucide-react";
import { MASTER_BADGES_CATALOG, BADGE_TIERS } from "@/lib/badgeSystem";
import { cn } from "@/lib/utils";

const ICONS_MAP = {
  BookOpen,
  GraduationCap,
  Flame,
  Zap,
  Users,
  Code2,
  Sparkles,
  Trophy,
};

export default function BadgeShowcase({ earnedBadges = [], userStats = {} }) {
  const [filter, setFilter] = useState("all");

  const earnedIds = new Set(earnedBadges.map((b) => b.id || b.badgeKey));

  const filteredBadges = MASTER_BADGES_CATALOG.filter((b) => {
    if (filter === "all") return true;
    if (filter === "earned") return earnedIds.has(b.id);
    if (filter === "in_progress") return !earnedIds.has(b.id);
    return b.category === filter;
  });

  const totalBadges = MASTER_BADGES_CATALOG.length;
  const earnedCount = MASTER_BADGES_CATALOG.filter((b) => earnedIds.has(b.id)).length;
  const totalXpFromBadges = earnedBadges.reduce((acc, b) => acc + (b.xpAwarded || 150), 0);

  return (
    <div className="space-y-6">
      {/* Header Summary Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-violet-500/10 dark:from-amber-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 border border-amber-200/80 dark:border-amber-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                Virtual Medals & Milestone Badges
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                {earnedCount} / {totalBadges} Unlocked
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Virtual medals awarded for completing courses, maintaining 7-day streaks, helping in community chat, and solving code challenges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs self-start md:self-auto">
          <div className="text-right">
            <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Total Medal XP</p>
            <p className="text-base font-black text-amber-500 flex items-center gap-1 justify-end">
              <Zap className="h-4 w-4 fill-amber-500" /> +{totalXpFromBadges.toLocaleString()} XP
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: "all", label: `All Medals (${totalBadges})` },
          { id: "earned", label: `Unlocked (${earnedCount})` },
          { id: "in_progress", label: `In Progress (${totalBadges - earnedCount})` },
          { id: "course", label: "Courses" },
          { id: "streak", label: "Streaks" },
          { id: "community", label: "Community Chat" },
          { id: "code", label: "Code & AI" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
              filter === t.id
                ? "bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          const isEarned = earnedIds.has(badge.id);
          const earnedData = earnedBadges.find((b) => (b.id || b.badgeKey) === badge.id);
          const progress = badge.progress(userStats);
          const tierInfo = BADGE_TIERS[badge.tier.toUpperCase()] || BADGE_TIERS.BRONZE;
          const IconComp = ICONS_MAP[badge.icon] || Award;

          return (
            <div
              key={badge.id}
              className={cn(
                "relative rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between overflow-hidden group",
                isEarned
                  ? "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700"
                  : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80 hover:opacity-100"
              )}
            >
              {/* Top Medal Sheen Ribbon */}
              <div
                className={cn(
                  "absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r",
                  isEarned ? tierInfo.color : "from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800"
                )}
              />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  {/* Medal Icon Badge */}
                  <div className="relative">
                    <div
                      className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shadow-md transition-transform group-hover:scale-105",
                        isEarned
                          ? `bg-gradient-to-tr ${tierInfo.color} text-white ring-2 ring-white dark:ring-slate-800`
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                      )}
                    >
                      {isEarned ? (
                        <span>{badge.emoji}</span>
                      ) : (
                        <Lock className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    {isEarned && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={cn(
                        "text-3xs uppercase font-extrabold px-2.5 py-0.5 rounded-full border",
                        isEarned ? `${tierInfo.bg} ${tierInfo.text} ${tierInfo.border}` : "bg-slate-200 dark:bg-slate-800 text-slate-500 border-transparent"
                      )}
                    >
                      {tierInfo.label}
                    </span>
                    <span className="text-3xs font-black text-amber-500 flex items-center gap-0.5">
                      <Zap className="h-3 w-3 fill-amber-500" /> +{badge.xpAwarded} XP
                    </span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress or Unlock Status */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                {isEarned ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Medal Unlocked
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {earnedData?.earnedAt ? new Date(earnedData.earnedAt).toLocaleDateString() : "Mastered"}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-2xs text-slate-500">
                      <span className="font-medium truncate pr-2">{badge.requirementText}</span>
                      <span className="font-bold">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
