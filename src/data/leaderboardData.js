// Leaderboard Data Store & Ranking Engine with dynamic XP progression and user isolation
import { evaluateAndAwardBadges } from "@/lib/badgeSystem";

const STORAGE_KEY = "skillsmap_leaderboard";

export const INITIAL_PEERS = [
  {
    id: "user_priya_sharma",
    rank: 1,
    name: "Priya Sharma",
    avatar: "PS",
    track: "AI & Distributed Systems",
    xp: 3250,
    quizzesCompleted: 14,
    codeChallengesSolved: 18,
    modulesCompleted: 8,
    streakDays: 14,
    badge: "Grandmaster",
    tier: "Emerald Tier",
    isCurrentUser: false,
    university: "National Tech Institute"
  },
  {
    id: "user_marcus_vance",
    rank: 2,
    name: "Marcus Vance",
    avatar: "MV",
    track: "Full Stack Cloud Architecture",
    xp: 2890,
    quizzesCompleted: 12,
    codeChallengesSolved: 15,
    modulesCompleted: 7,
    streakDays: 11,
    badge: "Code Titan",
    tier: "Diamond Tier",
    isCurrentUser: false,
    university: "Tech State University"
  },
  {
    id: "user_maya_patel",
    rank: 3,
    name: "Maya Patel",
    avatar: "MP",
    track: "Data Science & Computer Vision",
    xp: 2420,
    quizzesCompleted: 11,
    codeChallengesSolved: 11,
    modulesCompleted: 5,
    streakDays: 8,
    badge: "ML Specialist",
    tier: "Gold Tier",
    isCurrentUser: false,
    university: "Tech State University"
  },
  {
    id: "user_liam_davis",
    rank: 4,
    name: "Liam Davis",
    avatar: "LD",
    track: "UI/UX & Design Systems",
    xp: 2190,
    quizzesCompleted: 9,
    codeChallengesSolved: 8,
    modulesCompleted: 5,
    streakDays: 6,
    badge: "Design Prodigy",
    tier: "Gold Tier",
    isCurrentUser: false,
    university: "Design Academy"
  },
  {
    id: "user_elena_rostova",
    rank: 5,
    name: "Elena Rostova",
    avatar: "ER",
    track: "Cybersecurity & Cryptography",
    xp: 1980,
    quizzesCompleted: 8,
    codeChallengesSolved: 9,
    modulesCompleted: 4,
    streakDays: 7,
    badge: "Security Defender",
    tier: "Silver Tier",
    isCurrentUser: false,
    university: "Cyber Institute"
  },
  {
    id: "user_david_kim",
    rank: 6,
    name: "David Kim",
    avatar: "DK",
    track: "Cloud & DevOps Engineering",
    xp: 1850,
    quizzesCompleted: 7,
    codeChallengesSolved: 7,
    modulesCompleted: 4,
    streakDays: 4,
    badge: "Infrastructure Pro",
    tier: "Silver Tier",
    isCurrentUser: false,
    university: "State Polytechnic"
  },
  {
    id: "user_jordan_lee",
    rank: 7,
    name: "Jordan Lee",
    avatar: "JL",
    track: "Mobile Application Dev",
    xp: 1720,
    quizzesCompleted: 6,
    codeChallengesSolved: 6,
    modulesCompleted: 3,
    streakDays: 3,
    badge: "App Architect",
    tier: "Bronze Tier",
    isCurrentUser: false,
    university: "Institute of Technology"
  }
];

function getActiveUser() {
  if (typeof window === "undefined") return null;
  try {
    const active = localStorage.getItem("skillsmap_active_user");
    if (active) return JSON.parse(active);
    const mock = localStorage.getItem("skillsmap_mock_user");
    if (mock) return JSON.parse(mock);
    const prof = localStorage.getItem("skillsmap_user_profile");
    if (prof) return JSON.parse(prof);
    return null;
  } catch {
    return null;
  }
}

export function getStoredLeaderboard() {
  const activeUser = getActiveUser();
  const userName = activeUser?.full_name || activeUser?.name || activeUser?.displayName || (activeUser?.email ? activeUser.email.split("@")[0] : "Student Candidate");
  const userXp = typeof activeUser?.xp === "number" ? activeUser.xp : (activeUser?.role === "admin" ? 4500 : 2150);
  const userTrack = activeUser?.careerGoal || "Full Stack Cloud & AI Architecture";
  const userStreak = activeUser?.streakDays ?? 5;
  const userQuizzes = activeUser?.quizzesCompleted ?? 8;
  const userCode = activeUser?.codeChallengesSolved ?? 9;
  const userModules = activeUser?.modulesCompleted ?? 4;

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";

  const userEntry = {
    id: activeUser?.uid || activeUser?.id || "current_active_user",
    name: userName,
    avatar: initials,
    track: userTrack,
    xp: userXp,
    quizzesCompleted: userQuizzes,
    codeChallengesSolved: userCode,
    modulesCompleted: userModules,
    streakDays: userStreak,
    badge: userXp >= 4000 ? "Grandmaster" : userXp >= 3000 ? "Code Titan" : userXp >= 2400 ? "Algorithm Ace" : "Code Apprentice",
    tier: userXp >= 4000 ? "Master Tier" : userXp >= 3000 ? "Emerald Tier" : userXp >= 2400 ? "Platinum Tier" : "Gold Tier",
    isCurrentUser: true,
    university: activeUser?.institution || "University Institute of Technology",
  };

  const combined = [userEntry, ...INITIAL_PEERS];
  const sorted = combined.sort((a, b) => b.xp - a.xp).map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return sorted;
}

export function awardCurrentUserXP(points, reason = "Challenge Solved") {
  const activeUser = getActiveUser() || {
    uid: "student_default",
    id: "student_default",
    full_name: "Student Candidate",
    xp: 2150,
    streakDays: 5,
    quizzesCompleted: 8,
    codeChallengesSolved: 9,
    modulesCompleted: 4,
    communityHelpCount: 3,
  };

  const isQuiz = reason.toLowerCase().includes("quiz");
  const isCode = reason.toLowerCase().includes("code");
  const isCommunity = reason.toLowerCase().includes("community") || reason.toLowerCase().includes("helpful");

  const updatedUser = {
    ...activeUser,
    xp: (activeUser.xp || 2150) + points,
    quizzesCompleted: isQuiz ? (activeUser.quizzesCompleted || 0) + 1 : (activeUser.quizzesCompleted || 0),
    codeChallengesSolved: isCode ? (activeUser.codeChallengesSolved || 0) + 1 : (activeUser.codeChallengesSolved || 0),
    communityHelpCount: isCommunity ? (activeUser.communityHelpCount || 0) + 1 : (activeUser.communityHelpCount || 0),
    streakDays: (activeUser.streakDays || 5) + 1,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem("skillsmap_active_user", JSON.stringify(updatedUser));
    localStorage.setItem("skillsmap_mock_user", JSON.stringify(updatedUser));
    localStorage.setItem("skillsmap_user_profile", JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent("skillsmap_leaderboard_update"));
    window.dispatchEvent(new CustomEvent("skillsmap_store_update", { detail: { key: "user" } }));
  }

  evaluateAndAwardBadges(updatedUser, updatedUser).catch(() => {});
  return getStoredLeaderboard();
}

export function completeStudentModule(moduleTitle = "Module") {
  const activeUser = getActiveUser() || {
    uid: "student_default",
    id: "student_default",
    full_name: "Student Candidate",
    xp: 2150,
    streakDays: 5,
    modulesCompleted: 4,
    quizzesCompleted: 8,
    codeChallengesSolved: 9,
  };

  const updatedUser = {
    ...activeUser,
    xp: (activeUser.xp || 2150) + 150,
    modulesCompleted: (activeUser.modulesCompleted || 4) + 1,
    streakDays: (activeUser.streakDays || 5) + 1,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem("skillsmap_active_user", JSON.stringify(updatedUser));
    localStorage.setItem("skillsmap_mock_user", JSON.stringify(updatedUser));
    localStorage.setItem("skillsmap_user_profile", JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent("skillsmap_leaderboard_update"));
    window.dispatchEvent(new CustomEvent("skillsmap_store_update", { detail: { key: "user" } }));
  }

  evaluateAndAwardBadges(updatedUser, updatedUser).catch(() => {});
  return getStoredLeaderboard();
}

export function getCurrentUserRank() {
  const list = getStoredLeaderboard();
  const me = list.find((s) => s.isCurrentUser) || list[0];
  return {
    ...me,
    totalStudents: 1248,
    percentile: `Top ${Math.max(0.1, (me.rank / 1248 * 100).toFixed(1))}%`,
    nextRankDiff: me.rank > 1 ? (list[me.rank - 2]?.xp || 0) - me.xp + 10 : 0,
  };
}

export const getStudentRank = getCurrentUserRank;
export const getLeaderboardData = getStoredLeaderboard;
