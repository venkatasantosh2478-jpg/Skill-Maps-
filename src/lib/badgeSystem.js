// Badges & Virtual Medals Module
import confetti from "canvas-confetti";
import { db, auth, handleFirestoreError, OperationType } from "./firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

export const BADGE_TIERS = {
  BRONZE: { label: "Bronze Medal", color: "from-amber-600 to-amber-800", text: "text-amber-700", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-300 dark:border-amber-800" },
  SILVER: { label: "Silver Medal", color: "from-slate-300 to-slate-500", text: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800/80", border: "border-slate-300 dark:border-slate-700" },
  GOLD: { label: "Gold Medal", color: "from-amber-400 to-yellow-500", text: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/50", border: "border-amber-400 dark:border-amber-600" },
  PLATINUM: { label: "Platinum Medal", color: "from-cyan-400 to-indigo-500", text: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/40", border: "border-cyan-300 dark:border-cyan-700" },
  DIAMOND: { label: "Diamond Medal", color: "from-violet-400 to-fuchsia-500", text: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/40", border: "border-violet-300 dark:border-violet-700" },
};

export const MASTER_BADGES_CATALOG = [
  {
    id: "course_starter",
    title: "Course Pioneer",
    description: "Completed your first official learning course or curriculum module.",
    category: "course",
    tier: "bronze",
    icon: "BookOpen",
    emoji: "🥉",
    xpAwarded: 150,
    requirementText: "Complete 1 full course module",
    isUnlocked: (stats) => (stats.modulesCompleted || 0) >= 1,
    progress: (stats) => Math.min(100, Math.round(((stats.modulesCompleted || 0) / 1) * 100))
  },
  {
    id: "course_master",
    title: "Curriculum Master",
    description: "Completed 3 or more advanced engineering curriculum courses.",
    category: "course",
    tier: "gold",
    icon: "GraduationCap",
    emoji: "🥇",
    xpAwarded: 350,
    requirementText: "Complete 3 course modules",
    isUnlocked: (stats) => (stats.modulesCompleted || 0) >= 3,
    progress: (stats) => Math.min(100, Math.round(((stats.modulesCompleted || 0) / 3) * 100))
  },
  {
    id: "streak_7days",
    title: "7-Day Streak Titan",
    description: "Maintained a continuous 7-day engineering learning streak.",
    category: "streak",
    tier: "silver",
    icon: "Flame",
    emoji: "🔥",
    xpAwarded: 250,
    requirementText: "Maintain an active 7-day streak",
    isUnlocked: (stats) => (stats.streakDays || 0) >= 7,
    progress: (stats) => Math.min(100, Math.round(((stats.streakDays || 0) / 7) * 100))
  },
  {
    id: "streak_14days",
    title: "Fortnight Legend",
    description: "Maintained an unbroken 14-day dedicated learning streak.",
    category: "streak",
    tier: "platinum",
    icon: "Zap",
    emoji: "⚡",
    xpAwarded: 500,
    requirementText: "Maintain an active 14-day streak",
    isUnlocked: (stats) => (stats.streakDays || 0) >= 14,
    progress: (stats) => Math.min(100, Math.round(((stats.streakDays || 0) / 14) * 100))
  },
  {
    id: "community_helper",
    title: "Community Guardian",
    description: "Helped fellow students in community chat by providing helpful solutions.",
    category: "community",
    tier: "gold",
    icon: "Users",
    emoji: "🤝",
    xpAwarded: 300,
    requirementText: "Earn 3 helpful marks in student community chat",
    isUnlocked: (stats) => (stats.communityHelpCount || 0) >= 3,
    progress: (stats) => Math.min(100, Math.round(((stats.communityHelpCount || 0) / 3) * 100))
  },
  {
    id: "competency_pioneer",
    title: "Competency Master",
    description: "Mastered practical real-world industry competency scopes.",
    category: "competency",
    tier: "silver",
    icon: "Compass",
    emoji: "🧭",
    xpAwarded: 200,
    requirementText: "Complete practical industry competencies",
    isUnlocked: (stats) => (stats.modulesCompleted || 0) >= 2,
    progress: (stats) => Math.min(100, Math.round(((stats.modulesCompleted || 0) / 2) * 100))
  },
  {
    id: "prompt_architect",
    title: "Prompt Architect",
    description: "Generated an AI Architecture Prompt directly via the Chat Studio.",
    category: "ai",
    tier: "diamond",
    icon: "Sparkles",
    emoji: "✨",
    xpAwarded: 350,
    requirementText: "Generate system architecture prompts in Chatbot",
    isUnlocked: (stats) => (stats.promptsGenerated || 0) >= 1,
    progress: (stats) => Math.min(100, Math.round(((stats.promptsGenerated || 0) / 1) * 100))
  },
  {
    id: "team_recruiter",
    title: "Squad Collaborator",
    description: "Formed or joined a hackathon/freelance project squad.",
    category: "team",
    tier: "bronze",
    icon: "Trophy",
    emoji: "🛡️",
    xpAwarded: 150,
    requirementText: "Participate in a project squad or team recruitment",
    isUnlocked: (stats) => (stats.teamSquadJoined || 0) >= 1,
    progress: (stats) => Math.min(100, Math.round(((stats.teamSquadJoined || 0) / 1) * 100))
  }
];

const LOCAL_STORAGE_BADGES_KEY = "skillsmap_user_badges";

export function getLocalEarnedBadges() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BADGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read local badges", err);
    return [];
  }
}

export function saveLocalEarnedBadges(badges) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_BADGES_KEY, JSON.stringify(badges));
  }
}

export function triggerConfettiCelebration() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch {
    // fallback
  }
}

// Check and award any newly achieved badges
export async function evaluateAndAwardBadges(userStats, currentUser = null) {
  if (!userStats) return [];

  const earnedList = getLocalEarnedBadges();
  const newlyAwarded = [];

  for (const badgeDef of MASTER_BADGES_CATALOG) {
    const alreadyEarned = earnedList.some((b) => b.id === badgeDef.id);
    if (!alreadyEarned && badgeDef.isUnlocked(userStats)) {
      const newBadge = {
        id: badgeDef.id,
        badgeKey: badgeDef.id,
        title: badgeDef.title,
        description: badgeDef.description,
        tier: badgeDef.tier,
        category: badgeDef.category,
        earnedAt: new Date().toISOString(),
        xpAwarded: badgeDef.xpAwarded,
      };
      earnedList.push(newBadge);
      newlyAwarded.push(newBadge);

      // Persist to Firestore if user is actively authenticated with Firebase
      if (auth.currentUser && currentUser?.uid && auth.currentUser.uid === currentUser.uid) {
        try {
          const badgeRef = doc(db, "users", currentUser.uid, "badges", badgeDef.id);
          await setDoc(badgeRef, {
            ...newBadge,
            userId: currentUser.uid
          });
        } catch (err) {
          console.warn("Firestore badge sync note:", err.message);
        }
      }
    }
  }

  if (newlyAwarded.length > 0) {
    saveLocalEarnedBadges(earnedList);
    triggerConfettiCelebration();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("skillsmap_badge_unlocked", {
          detail: { newBadges: newlyAwarded }
        })
      );
    }
  }

  return newlyAwarded;
}

// Fetch all earned badges for a user (from Firestore with fallback)
export async function fetchUserBadges(uid) {
  if (!uid || !auth.currentUser || auth.currentUser.uid !== uid) {
    return getLocalEarnedBadges();
  }

  try {
    const badgesCol = collection(db, "users", uid, "badges");
    const snapshot = await getDocs(badgesCol);
    const badges = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (badges.length > 0) {
      saveLocalEarnedBadges(badges);
      return badges;
    }
  } catch (err) {
    console.warn("Firestore fetch badges fallback:", err.message);
  }
  return getLocalEarnedBadges();
}
