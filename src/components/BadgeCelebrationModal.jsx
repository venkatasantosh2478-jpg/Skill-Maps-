import React, { useState, useEffect } from "react";
import { Sparkles, X, Zap } from "lucide-react";
import { BADGE_TIERS } from "@/lib/badgeSystem";

export default function BadgeCelebrationModal() {
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [currentBadge, setCurrentBadge] = useState(null);

  useEffect(() => {
    const handleBadgeUnlocked = (e) => {
      const newBadges = e.detail?.newBadges || [];
      if (newBadges.length > 0) {
        setUnlockedBadges((prev) => [...prev, ...newBadges]);
      }
    };
    window.addEventListener("skillsmap_badge_unlocked", handleBadgeUnlocked);
    return () => window.removeEventListener("skillsmap_badge_unlocked", handleBadgeUnlocked);
  }, []);

  useEffect(() => {
    if (!currentBadge && unlockedBadges.length > 0) {
      setCurrentBadge(unlockedBadges[0]);
      setUnlockedBadges((prev) => prev.slice(1));
    }
  }, [unlockedBadges, currentBadge]);

  if (!currentBadge) return null;

  const tierInfo = BADGE_TIERS[currentBadge.tier?.toUpperCase()] || BADGE_TIERS.BRONZE;

  const handleClose = () => {
    setCurrentBadge(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-400 dark:border-amber-500 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative inline-block mx-auto">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-amber-950 font-black flex items-center justify-center text-4xl shadow-xl ring-8 ring-amber-100 dark:ring-amber-950/60 animate-bounce">
            🏆
          </div>
          <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300">
            Milestone Accomplished!
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-2">
            {currentBadge.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {currentBadge.description}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 flex items-center justify-around text-xs">
          <div>
            <p className="text-3xs text-slate-400 uppercase font-bold">Medal Tier</p>
            <p className="font-bold text-amber-700 dark:text-amber-400 capitalize">{currentBadge.tier} Medal</p>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className="text-3xs text-slate-400 uppercase font-bold">XP Bonus</p>
            <p className="font-black text-amber-500 flex items-center gap-1 justify-center">
              <Zap className="h-3.5 w-3.5 fill-amber-500" /> +{currentBadge.xpAwarded || 150} XP
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
        >
          Claim Medal & Continue
        </button>
      </div>
    </div>
  );
}
