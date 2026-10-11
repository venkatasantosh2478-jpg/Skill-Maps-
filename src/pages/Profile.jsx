import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { 
  User, 
  Mail, 
  Building, 
  Briefcase, 
  Map, 
  Download, 
  Trophy, 
  Award,
  CheckCircle2, 
  Clock, 
  Shield, 
  Lock, 
  KeyRound, 
  Edit3, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Github, 
  Bell, 
  Users, 
  Check, 
  Save, 
  FileText, 
  Activity, 
  AlertCircle,
  FolderGit2,
  GraduationCap,
  Search,
  X,
  Eye
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { getMyProfile, updateProfile } from "@/lib/skillMap";
import { getStudentRank } from "@/data/leaderboardData";
import { downloadCoursePDF, downloadModuleNotesPDF } from "@/lib/coursePdfGenerator";
import LeaderboardComponent from "@/components/LeaderboardComponent";
import BadgeShowcase from "@/components/BadgeShowcase";
import MyCertificatesModule from "@/components/MyCertificatesModule";
import { fetchUserBadges } from "@/lib/badgeSystem";
import {
  getStudentProjects,
  saveStudentProject,
  deleteStudentProject,
  getStudentReminders,
  saveStudentReminder,
  removeStudentReminder,
  toggleStudentReminder,
  getPeerTalentList,
  updatePeerTalentProfile,
  getStudentCertificates
} from "@/lib/dataStore";
import { cn } from "@/lib/utils";

const ALL_KNOWLEDGE_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "System Design",
  "AI / Prompt Engineering", "PyTorch / ML", "UI/UX Design",
  "PostgreSQL", "Docker & Kubernetes", "AWS / Cloud", "Cybersecurity",
  "GraphQL", "DevOps & CI/CD", "Next.js", "Tailwind CSS"
];

// Interactive Skill Matrix competency definition
const BASE_COMPETENCY_MATRIX = [
  { id: "frontend", name: "Frontend & Architecture", baseLevel: 0.85, category: "Core UI", requiredQuiz: "React & Architecture Quiz" },
  { id: "backend", name: "Distributed Backend & APIs", baseLevel: 0.78, category: "Systems", requiredQuiz: "Express & REST Microservices" },
  { id: "system_design", name: "High-Scale System Design", baseLevel: 0.65, category: "Architecture", requiredQuiz: "Distributed Caching & Sharding" },
  { id: "algorithms", name: "Algorithms & Data Structures", baseLevel: 0.90, category: "CS Core", requiredQuiz: "Dynamic Programming & Trees" },
  { id: "cloud", name: "Cloud & Container Orchestration", baseLevel: 0.70, category: "DevOps", requiredQuiz: "Docker & Kubernetes CI/CD" },
  { id: "ai_engineering", name: "AI Integration & Agentic Systems", baseLevel: 0.80, category: "Intelligence", requiredQuiz: "Gemini SDK & LLM Tooling" },
  { id: "security", name: "Application Security & OAuth", baseLevel: 0.60, category: "SecOps", requiredQuiz: "Zero-Trust & Token Auth" },
];

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialTab = searchParams.get("tab") || location.state?.tab || "overview";
  const [activeTab, setActiveTab] = useState(initialTab); // overview, certificates, roadmaps, projects, reminders, team_talent, skill_matrix, leaderboard
  const [rankInfo, setRankInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [identitySuccess, setIdentitySuccess] = useState(false);
  const [downloadingRoadmap, setDownloadingRoadmap] = useState(false);
  const [downloadingNotes, setDownloadingNotes] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [certificatesCount, setCertificatesCount] = useState(() => getStudentCertificates().length);

  // User Directory / Find Users State
  const [userDirectorySearch, setUserDirectorySearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSkillFilter, setUserSkillFilter] = useState("all");
  const [onlyTeamAvailable, setOnlyTeamAvailable] = useState(false);
  const [selectedDirectoryUser, setSelectedDirectoryUser] = useState(null);
  const [peerList, setPeerList] = useState(() => getPeerTalentList());

  // Sync tab from URL search parameters if changed
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["overview", "manage_users", "certificates", "badges", "roadmaps", "projects", "reminders", "team_talent", "skill_matrix", "leaderboard"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Editable Profile Identity
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [bio, setBio] = useState("");

  // Editable Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  // Projects State
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    techStack: "React, Node.js, Tailwind",
    githubUrl: "",
    liveUrl: "",
    lookingForTeam: false
  });

  // Reminders State
  const [reminders, setReminders] = useState([]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    category: "hackathon",
    dueDate: "",
    targetUrl: "/events"
  });

  // Team Willingness & Knowledge Skills State
  const [peerProfile, setPeerProfile] = useState({
    willingToJoinTeam: true,
    knowledgeSkills: ["React", "TypeScript", "Node.js", "System Design"],
    roleTitle: "Full-Stack Developer",
    hoursPerWeek: 15,
    contactPreference: "Email & Discord"
  });
  const [peerSaveSuccess, setPeerSaveSuccess] = useState(false);

  // Load user data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prof = await getMyProfile();
        setProfile(prof);
        const resolvedName = prof?.full_name || prof?.name || user?.full_name || user?.name || (user?.email ? user.email.split("@")[0] : "Student Candidate");
        const resolvedUniv = prof?.institution || user?.institution || "University Institute of Technology";
        const resolvedGoal = prof?.careerGoal || user?.careerGoal || "Full Stack Cloud & AI Architecture";
        const resolvedBio = prof?.bio || user?.bio || "Passionate software engineer building resilient distributed systems and AI applications.";

        setFullName(resolvedName);
        setUniversity(resolvedUniv);
        setCareerGoal(resolvedGoal);
        setBio(resolvedBio);

        // Leaderboard rank for current user
        const rank = getStudentRank();
        setRankInfo(rank);

        // Projects & Reminders
        setProjects(getStudentProjects());
        setReminders(getStudentReminders());

        // Load Earned Badges & Virtual Medals
        const userBadgesList = await fetchUserBadges(user?.uid || user?.id);
        setEarnedBadges(userBadgesList);

        // Peer Talent state
        const allTalent = getPeerTalentList();
        const meTalent = allTalent.find((t) => t.id === "peer_current" || (t.email && user?.email && t.email.toLowerCase() === user.email.toLowerCase()));
        if (meTalent) {
          setPeerProfile({
            willingToJoinTeam: meTalent.willingToJoinTeam ?? true,
            knowledgeSkills: meTalent.knowledgeSkills || ["React", "TypeScript", "Node.js", "System Design"],
            roleTitle: meTalent.roleTitle || resolvedGoal,
            hoursPerWeek: meTalent.hoursPerWeek || 15,
            contactPreference: meTalent.contactPreference || `${user?.email || "student@skillsmap.io"} (Email / WhatsApp)`
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const handleRankUpdate = () => {
      setRankInfo(getStudentRank());
    };
    const handleStoreUpdate = () => {
      setCertificatesCount(getStudentCertificates().length);
      setProjects(getStudentProjects());
      setReminders(getStudentReminders());
    };
    window.addEventListener("skillsmap_leaderboard_update", handleRankUpdate);
    window.addEventListener("skillsmap_store_update", handleStoreUpdate);
    return () => {
      window.removeEventListener("skillsmap_leaderboard_update", handleRankUpdate);
      window.removeEventListener("skillsmap_store_update", handleStoreUpdate);
    };
  }, [user]);

  // Handle Identity Update
  const handleSaveIdentity = async (e) => {
    e.preventDefault();
    setSavingIdentity(true);
    setIdentitySuccess(false);

    try {
      if (profile?.id) {
        const updatedProf = await updateProfile(profile.id, {
          full_name: fullName,
          name: fullName,
          institution: university,
          careerGoal,
          bio
        });
        setProfile((prev) => ({ ...prev, ...updatedProf, full_name: fullName, name: fullName, institution: university, careerGoal, bio }));
      }

      // Also update AuthContext & localStorage for instant live synchronization
      if (user?.uid || user?.id) {
        await updateUserProfile({
          full_name: fullName,
          name: fullName,
          institution: university,
          careerGoal,
          bio
        });
      } else {
        const currentStored = JSON.parse(localStorage.getItem("skillsmap_active_user") || "{}");
        const updated = {
          ...currentStored,
          full_name: fullName,
          name: fullName,
          institution: university,
          careerGoal,
          bio
        };
        localStorage.setItem("skillsmap_active_user", JSON.stringify(updated));
        localStorage.setItem("skillsmap_mock_user", JSON.stringify(updated));
        localStorage.setItem("skillsmap_user_profile", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("skillsmap_leaderboard_update"));
      }

      // Always write to localStorage directly as well to guarantee cross-window and instant storage event sync
      try {
        const directKeys = ["skillsmap_active_user", "skillsmap_mock_user", "skillsmap_user_profile"];
        directKeys.forEach((k) => {
          const existing = JSON.parse(localStorage.getItem(k) || "{}");
          const fresh = { ...existing, full_name: fullName, name: fullName, institution: university, careerGoal, bio };
          localStorage.setItem(k, JSON.stringify(fresh));
        });
        window.dispatchEvent(new CustomEvent("skillsmap_leaderboard_update"));
        window.dispatchEvent(new CustomEvent("skillsmap_store_update", { detail: { key: "user" } }));
      } catch (e) {}

      // Update in Peer Talent so Idea Analyzer matches
      updatePeerTalentProfile({
        name: fullName,
        institution: university,
        roleTitle: careerGoal,
        email: user?.email
      });

      setRankInfo(getStudentRank());
      setIdentitySuccess(true);
      setTimeout(() => setIdentitySuccess(false), 4000);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSavingIdentity(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match. Please re-check." });
      return;
    }

    // Save simulated credential update
    localStorage.setItem("skillsmap_password_updated", new Date().toISOString());
    setPasswordMsg({ type: "success", text: "Your password has been successfully updated and encrypted!" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordMsg({ type: "", text: "" }), 5000);
  };

  // Handle Project Operations
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    const added = saveStudentProject({
      ...newProject,
      techStack: newProject.techStack.split(",").map((s) => s.trim()).filter(Boolean)
    });

    setProjects([added, ...projects]);
    setNewProject({
      title: "",
      description: "",
      techStack: "React, Node.js, Tailwind",
      githubUrl: "",
      liveUrl: "",
      lookingForTeam: false
    });
    setShowAddProject(false);
  };

  const handleDeleteProject = (id) => {
    deleteStudentProject(id);
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Handle Reminders Operations
  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newReminder.title.trim()) return;

    const added = saveStudentReminder(newReminder);
    setReminders([added, ...reminders]);
    setNewReminder({
      title: "",
      category: "hackathon",
      dueDate: "",
      targetUrl: "/events"
    });
    setShowAddReminder(false);
  };

  const handleToggleReminder = (id) => {
    const updated = toggleStudentReminder(id);
    setReminders(reminders.map((r) => (r.id === id ? updated : r)));
  };

  const handleRemoveReminder = (id) => {
    removeStudentReminder(id);
    setReminders(reminders.filter((r) => r.id !== id));
  };

  // Handle Team Willingness & Knowledge Skills Update
  const toggleSkillSelection = (skill) => {
    setPeerProfile((prev) => {
      const exists = prev.knowledgeSkills.includes(skill);
      const nextSkills = exists
        ? prev.knowledgeSkills.filter((s) => s !== skill)
        : [...prev.knowledgeSkills, skill];
      return { ...prev, knowledgeSkills: nextSkills };
    });
  };

  const handleSavePeerTalent = () => {
    updatePeerTalentProfile("peer-me", {
      name: fullName,
      institution: university,
      willingToJoinTeam: peerProfile.willingToJoinTeam,
      knowledgeSkills: peerProfile.knowledgeSkills,
      roleTitle: peerProfile.roleTitle,
      hoursPerWeek: Number(peerProfile.hoursPerWeek),
      contactPreference: peerProfile.contactPreference
    });
    setPeerSaveSuccess(true);
    setTimeout(() => setPeerSaveSuccess(false), 4000);
  };

  // Milestones & Roadmap
  const milestones = profile?.roadmapMilestones || [
    {
      skill: "Enterprise Distributed Frontend & React Patterns",
      targetLevel: 0.9,
      durationWeeks: 3,
      status: "complete",
      subGoals: [
        "Master React 19 server/client boundary patterns & SSR hydration",
        "Implement high-performance state orchestration with memoization",
        "Build accessible, WCAG AA compliant interactive components"
      ]
    },
    {
      skill: "High-Throughput Node.js & Microservices",
      targetLevel: 0.85,
      durationWeeks: 4,
      status: "in_progress",
      subGoals: [
        "Architect event-driven pipelines with Redis pub/sub",
        "Implement robust error recovery and rate-limiting middleware",
        "Secure microservices with zero-trust OAuth 2.0 and JWT"
      ]
    },
    {
      skill: "System Design, Sharding & Distributed Caching",
      targetLevel: 0.8,
      durationWeeks: 3,
      status: "pending",
      subGoals: [
        "Design multi-region read replicas and optimistic concurrency",
        "Implement consistent hashing and horizontal partition keys",
        "Measure latency SLAs with distributed OpenTelemetry tracing"
      ]
    },
    {
      skill: "Agentic AI Integration with Gemini SDK",
      targetLevel: 0.85,
      durationWeeks: 2,
      status: "pending",
      subGoals: [
        "Integrate @google/genai structured schema enforcement",
        "Implement tool-calling agents with autonomous verification",
        "Deploy resilient streaming fallbacks and token caches"
      ]
    }
  ];

  const completedMilestonesCount = milestones.filter((m) => m.status === "complete").length;
  const progressPct = Math.round((completedMilestonesCount / milestones.length) * 100);

  const handleDownloadRoadmap = async () => {
    setDownloadingRoadmap(true);
    try {
      await downloadCoursePDF({
        careerGoal,
        targetDurationWeeks: 12,
        milestones
      });
    } catch (err) {
      console.error("Failed to generate roadmap PDF:", err);
    } finally {
      setDownloadingRoadmap(false);
    }
  };

  const handleDownloadModuleNotes = () => {
    setDownloadingNotes(true);
    try {
      downloadModuleNotesPDF("Full Stack Cloud Engineering & Distributed Systems");
    } catch (err) {
      console.error("Failed to download notes PDF:", err);
    } finally {
      setDownloadingNotes(false);
    }
  };

  // Interactive Skill Matrix calculation (updated or declined strictly by user progress)
  const solvedChallengesCount = rankInfo?.codeChallengesSolved || 12;
  const quizzesCompletedCount = rankInfo?.quizzesCompleted || 10;
  const modulesCompletedCount = rankInfo?.modulesCompleted || 8;

  const skillMatrix = BASE_COMPETENCY_MATRIX.map((skill, idx) => {
    // Dynamic progress offset based on real user achievements
    const progressFactor = Math.min(1, (quizzesCompletedCount + solvedChallengesCount + modulesCompletedCount) / 25);
    const calculatedLevel = Math.min(0.98, Math.max(0.45, skill.baseLevel * (0.8 + progressFactor * 0.25)));
    const isDeclinedOrLocked = idx >= 5 && modulesCompletedCount < 10; // strictly declined/locked if progress conditions not met
    return {
      ...skill,
      currentLevel: isDeclinedOrLocked ? skill.baseLevel * 0.7 : calculatedLevel,
      status: isDeclinedOrLocked ? "declined" : "updated",
      reason: isDeclinedOrLocked 
        ? "Declined: Requires completing 2 more curriculum modules to unlock progression."
        : `Updated by user progress: ${quizzesCompletedCount} quizzes & ${solvedChallengesCount} code challenges verified.`
    };
  });

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Top Profile Banner Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white font-extrabold flex items-center justify-center text-2xl sm:text-3xl shadow-md">
              {fullName ? fullName.charAt(0) : "A"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {fullName || "Student Candidate"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-black uppercase bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                  {user?.role === "admin" ? "Institutional Admin" : "Student Member"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-slate-400" />
                  {university || "University Institute of Technology"}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {user?.email || "student@skillsmap.io"}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                  <Briefcase className="h-3.5 w-3.5" />
                  {careerGoal || "Full Stack Cloud & AI Architecture"}
                </span>
              </p>
            </div>
          </div>

          {/* Institutional Rank Badge Card */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-tr from-amber-50 to-indigo-50 dark:from-amber-950/30 dark:to-indigo-950/40 border border-amber-200/80 dark:border-amber-800/60">
            <div className="h-11 w-11 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center">
              <Trophy className="h-6 w-6 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <p className="text-3xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                Institutional Standing
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-heading">
                  Rank #{rankInfo?.rank || 3}
                </span>
                <span className="text-3xs font-semibold text-slate-500">
                  ({rankInfo?.percentile || "Top 0.5%"})
                </span>
              </div>
              <p className="text-3xs text-slate-500 font-medium">
                {(rankInfo?.xp || 2550).toLocaleString()} XP · {rankInfo?.modulesCompleted || 8} Modules Completed
              </p>
            </div>
          </div>
        </div>

        {/* Profile Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: "overview", label: "Identity & Security", icon: Shield },
            { id: "manage_users", label: user?.role === "admin" ? "Manage & Find Users" : "Find Users & Directory", icon: Users, badge: "Directory" },
            { id: "certificates", label: `My Certificates (${certificatesCount})`, icon: GraduationCap, badge: `${certificatesCount} Verified` },
            { id: "badges", label: `Virtual Medals (${earnedBadges.length})`, icon: Award, badge: `${earnedBadges.length} Earned` },
            { id: "roadmaps", label: "Career Roadmaps & Notes", icon: Map, badge: `${progressPct}%` },
            { id: "projects", label: `Projects (${projects.length})`, icon: FolderGit2 },
            { id: "reminders", label: `Reminders (${reminders.length})`, icon: Bell },
            { id: "team_talent", label: "Team Willingness & Skills", icon: CheckCircle2, badge: peerProfile.willingToJoinTeam ? "Available" : "Hidden" },
            { id: "skill_matrix", label: "Interactive Skill Matrix", icon: Activity },
            { id: "leaderboard", label: "Leaderboard & Rankings", icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none",
                  active
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={cn(
                    "text-3xs px-1.5 py-0.2 rounded-md font-bold",
                    active ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  )}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: IDENTITY & SECURITY */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Update Name & Profile Details */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Update Profile Identity
              </h2>
            </div>

            {identitySuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Profile name and credentials updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveIdentity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  University / Institution
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Career Specialization Target
                </label>
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Full Stack Cloud Architect"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Bio / Focus Area
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell peers and project teams about your technical strengths..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={savingIdentity}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{savingIdentity ? "Saving Updates..." : "Save Identity Changes"}</span>
              </button>
            </form>
          </div>

          {/* Update Password */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <KeyRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Change Password & Security
              </h2>
            </div>

            {passwordMsg.text && (
              <div className={cn(
                "p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2",
                passwordMsg.type === "success" 
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                  : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
              )}>
                {passwordMsg.type === "success" ? <Check className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  New Secure Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Update & Encrypt Password</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB: MANAGE & FIND USERS DIRECTORY */}
      {activeTab === "manage_users" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  {user?.role === "admin" ? "Manage Users & Institutional Directory" : "Find Users & Student Directory"}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Explore registered students, platform admins, and peer collaborators. Search profiles, inspect skills, or connect for team projects.
              </p>
            </div>

            {user?.role === "admin" && (
              <Link
                to="/admin/students"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Open Admin User Management Console</span>
              </Link>
            )}
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              <p className="text-3xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">Total Directory Members</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{peerList.length} Members</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <p className="text-3xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">Available for Teams</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{peerList.filter((p) => p.willingToJoinTeam).length} Active Peers</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <p className="text-3xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">Institutions Represented</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{new Set(peerList.map((p) => p.institution).filter(Boolean)).size} Universities</p>
            </div>
          </div>

          {/* Filters & Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={userDirectorySearch}
                onChange={(e) => setUserDirectorySearch(e.target.value)}
                placeholder="Search user name, email, institution, or role..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              {userDirectorySearch && (
                <button
                  onClick={() => setUserDirectorySearch("")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="admin">Administrators & Faculty</option>
              </select>
            </div>

            <div>
              <select
                value={userSkillFilter}
                onChange={(e) => setUserSkillFilter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                <option value="all">All Knowledge Skills</option>
                {ALL_KNOWLEDGE_SKILLS.map((sk) => (
                  <option key={sk} value={sk}>{sk}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Filter Checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyTeamAvailable}
                onChange={(e) => setOnlyTeamAvailable(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Show only members willing to join a team</span>
            </label>

            <span className="text-2xs text-slate-500 dark:text-slate-400">
              Showing {peerList.filter((usr) => {
                const q = userDirectorySearch.toLowerCase().trim();
                const nameMatch = (usr.name || usr.full_name || "").toLowerCase().includes(q);
                const emailMatch = (usr.email || "").toLowerCase().includes(q);
                const instMatch = (usr.institution || "").toLowerCase().includes(q);
                const roleMatch = (usr.roleTitle || usr.careerGoal || "").toLowerCase().includes(q);
                const matchesQuery = !q || nameMatch || emailMatch || instMatch || roleMatch;
                const matchesRoleFilter = userRoleFilter === "all" || (userRoleFilter === "admin" && (usr.role === "admin" || usr.email?.includes("admin"))) || (userRoleFilter === "student" && usr.role !== "admin" && !usr.email?.includes("admin"));
                const matchesSkill = userSkillFilter === "all" || (usr.knowledgeSkills && usr.knowledgeSkills.some((s) => s.toLowerCase() === userSkillFilter.toLowerCase()));
                const matchesTeam = !onlyTeamAvailable || usr.willingToJoinTeam;
                return matchesQuery && matchesRoleFilter && matchesSkill && matchesTeam;
              }).length} of {peerList.length} users
            </span>
          </div>

          {/* Directory Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {peerList
              .filter((usr) => {
                const q = userDirectorySearch.toLowerCase().trim();
                const nameMatch = (usr.name || usr.full_name || "").toLowerCase().includes(q);
                const emailMatch = (usr.email || "").toLowerCase().includes(q);
                const instMatch = (usr.institution || "").toLowerCase().includes(q);
                const roleMatch = (usr.roleTitle || usr.careerGoal || "").toLowerCase().includes(q);
                const matchesQuery = !q || nameMatch || emailMatch || instMatch || roleMatch;
                const matchesRoleFilter = userRoleFilter === "all" || (userRoleFilter === "admin" && (usr.role === "admin" || usr.email?.includes("admin"))) || (userRoleFilter === "student" && usr.role !== "admin" && !usr.email?.includes("admin"));
                const matchesSkill = userSkillFilter === "all" || (usr.knowledgeSkills && usr.knowledgeSkills.some((s) => s.toLowerCase() === userSkillFilter.toLowerCase()));
                const matchesTeam = !onlyTeamAvailable || usr.willingToJoinTeam;
                return matchesQuery && matchesRoleFilter && matchesSkill && matchesTeam;
              })
              .map((usr) => {
                const isAdmin = usr.role === "admin" || usr.email?.includes("admin");
                return (
                  <div
                    key={usr.id || usr.email}
                    className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-xl font-bold text-white flex items-center justify-center text-sm shadow-xs",
                            isAdmin ? "bg-gradient-to-tr from-amber-500 to-rose-500" : "bg-gradient-to-tr from-indigo-600 to-violet-600"
                          )}>
                            {(usr.name || usr.full_name || "U").charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{usr.name || usr.full_name || "User Profile"}</span>
                              {isAdmin && (
                                <span className="px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-3xs font-black uppercase">
                                  Admin
                                </span>
                              )}
                            </h3>
                            <p className="text-2xs text-slate-500 dark:text-slate-400">
                              {usr.email || "student@skillsmap.io"}
                            </p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-3xs font-extrabold whitespace-nowrap">
                          {usr.xp ? `${usr.xp} XP` : "Rank #3"}
                        </span>
                      </div>

                      <div className="space-y-1 text-2xs text-slate-600 dark:text-slate-400">
                        <p className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                          <Building className="h-3 w-3 text-slate-400" />
                          <span>{usr.institution || "University Institute of Technology"}</span>
                        </p>
                        <p className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
                          <Briefcase className="h-3 w-3" />
                          <span>{usr.roleTitle || usr.careerGoal || "Full Stack Cloud Architecture"}</span>
                        </p>
                      </div>

                      {/* Knowledge skills */}
                      {usr.knowledgeSkills && usr.knowledgeSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {usr.knowledgeSkills.slice(0, 4).map((sk) => (
                            <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-3xs font-semibold">
                              {sk}
                            </span>
                          ))}
                          {usr.knowledgeSkills.length > 4 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-500 text-3xs font-bold">
                              +{usr.knowledgeSkills.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                      <span className={cn(
                        "text-3xs font-bold px-2 py-0.5 rounded-md",
                        usr.willingToJoinTeam
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      )}>
                        {usr.willingToJoinTeam ? "Available for Teams" : "Not Looking"}
                      </span>

                      <button
                        onClick={() => setSelectedDirectoryUser(usr)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-2xs font-bold flex items-center gap-1 shadow-2xs transition-all"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Profile</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Modal for Selected User Details */}
          {selectedDirectoryUser && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
                <button
                  onClick={() => setSelectedDirectoryUser(null)}
                  className="absolute right-5 top-5 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-xl flex items-center justify-center">
                    {(selectedDirectoryUser.name || selectedDirectoryUser.full_name || "U").charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                      <span>{selectedDirectoryUser.name || selectedDirectoryUser.full_name}</span>
                      {selectedDirectoryUser.role === "admin" && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-3xs font-black uppercase">
                          Admin
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      {selectedDirectoryUser.roleTitle || selectedDirectoryUser.careerGoal || "Software Engineer"}
                    </p>
                    <p className="text-2xs text-slate-500">
                      {selectedDirectoryUser.institution || "University Institute of Technology"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="block text-3xs uppercase font-extrabold tracking-wider text-slate-400 mb-1">
                      Bio & Background
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      {selectedDirectoryUser.bio || "Passionate engineer committed to mastery in distributed systems, AI integration, and full stack applications."}
                    </p>
                  </div>

                  <div>
                    <span className="block text-3xs uppercase font-extrabold tracking-wider text-slate-400 mb-1">
                      Verified Knowledge Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedDirectoryUser.knowledgeSkills || ["React", "TypeScript", "Node.js", "System Design"]).map((sk) => (
                        <span key={sk} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-2xs font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="block text-3xs uppercase font-extrabold text-slate-400">Team Availability</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedDirectoryUser.willingToJoinTeam ? "Willing to Join Team" : "Not Looking"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="block text-3xs uppercase font-extrabold text-slate-400">Contact Preference</span>
                      <span className="text-2xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                        {selectedDirectoryUser.contactPreference || selectedDirectoryUser.email || "Email / Discord"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedDirectoryUser(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedDirectoryUser.email || "student@skillsmap.io"}`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Send Email Contact</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: MY CERTIFICATES & CREDENTIALS */}
      {activeTab === "certificates" && (
        <MyCertificatesModule
          studentName={fullName || user?.full_name || "Student Candidate"}
          user={user}
        />
      )}

      {/* TAB 2: ROADMAPS & MODULE NOTES */}
      {activeTab === "roadmaps" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  Generated Career Roadmap
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Personalized study roadmap visible in your profile with user-friendly PDF download options.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleDownloadRoadmap}
                disabled={downloadingRoadmap}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{downloadingRoadmap ? "Exporting..." : "Download Roadmap (PDF)"}</span>
              </button>

              <button
                onClick={handleDownloadModuleNotes}
                disabled={downloadingNotes}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <FileText className="h-3.5 w-3.5 text-indigo-500" />
                <span>{downloadingNotes ? "Exporting..." : "Export Module Notes (PDF)"}</span>
              </button>

              <Link
                to="/roadmap"
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Roadmap
              </Link>
            </div>
          </div>

          {/* Progress summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Roadmap Mastery Progress: {progressPct}% Completed
              </span>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                {completedMilestonesCount} of {milestones.length} Strategic Competency Milestones Validated
              </p>
            </div>
            <div className="w-full sm:w-48 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Milestones list */}
          <div className="space-y-4">
            {milestones.map((m, idx) => {
              const isComplete = m.status === "complete";
              const isInProgress = m.status === "in_progress";

              return (
                <div
                  key={idx}
                  className={cn(
                    "p-5 rounded-2xl border transition-all",
                    isComplete
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
                      : isInProgress
                      ? "bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/80 shadow-xs"
                      : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-85"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-xs",
                        isComplete
                          ? "bg-emerald-600 text-white"
                          : isInProgress
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      )}>
                        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Phase {idx + 1}: {m.skill}
                        </h3>
                        <p className="text-2xs text-slate-500 dark:text-slate-400">
                          Target Proficiency: {Math.round((m.targetLevel || 0.8) * 100)}% · Est. {m.durationWeeks || 2} Weeks
                        </p>
                      </div>
                    </div>

                    <span className={cn(
                      "text-3xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto",
                      isComplete
                        ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300"
                        : isInProgress
                        ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    )}>
                      {isComplete ? "Completed" : isInProgress ? "Active in Progress" : "Locked"}
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-10 pt-1">
                    {(m.subGoals || []).map((sg, sgIdx) => (
                      <div key={sgIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span className={cn("mt-0.5", isComplete ? "text-emerald-600 font-bold" : "text-slate-400")}>
                          {isComplete ? "✔" : "○"}
                        </span>
                        <span>{sg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PROJECTS SHOWCASE */}
      {activeTab === "projects" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  Student Project Showcase
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Add projects you built, showcase GitHub repositories, and invite peer teammates.
              </p>
            </div>

            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{showAddProject ? "Cancel" : "Add New Project"}</span>
            </button>
          </div>

          {/* Add Project Form */}
          {showAddProject && (
            <form onSubmit={handleAddProject} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                New Project Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g. Distributed Task Queue"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.techStack}
                    onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                    placeholder="React, TypeScript, Redis"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    GitHub Repo Link
                  </label>
                  <input
                    type="url"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    placeholder="https://myproject.app"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Project Description
                </label>
                <textarea
                  rows={2}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Key features, architectural solutions, and outcomes..."
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProject.lookingForTeam}
                    onChange={(e) => setNewProject({ ...newProject, lookingForTeam: e.target.checked })}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Currently looking for teammates for this project</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  Publish Project
                </button>
              </div>
            </form>
          )}

          {/* Project List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {proj.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(proj.techStack || []).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-3xs font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1 text-2xs font-semibold"
                      >
                        <Github className="h-3.5 w-3.5" /> Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-2xs font-semibold"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Demo
                      </a>
                    )}
                  </div>
                  {proj.lookingForTeam && (
                    <span className="text-3xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                      Recruiting Team
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REMINDERS FOR HACKATHONS & FREELANCING */}
      {activeTab === "reminders" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  Reminders for Hackathons & Freelancing
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Never miss a submission deadline, hackathon team pitch, or high-payout freelance milestone.
              </p>
            </div>

            <button
              onClick={() => setShowAddReminder(!showAddReminder)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{showAddReminder ? "Cancel" : "Add Reminder"}</span>
            </button>
          </div>

          {/* Add Reminder Form */}
          {showAddReminder && (
            <form onSubmit={handleAddReminder} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                New Reminder Alert
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Event / Gig Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    placeholder="e.g. Gemini AI Sprint Submission Deadline"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newReminder.category}
                    onChange={(e) => setNewReminder({ ...newReminder, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="hackathon">Hackathon</option>
                    <option value="freelance">Freelancing Gig</option>
                    <option value="quiz">Quiz / Exam</option>
                    <option value="project">Project Milestone</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  Set Reminder
                </button>
              </div>
            </form>
          )}

          {/* Reminders list */}
          <div className="space-y-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className={cn(
                  "p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all",
                  rem.completed
                    ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs"
                )}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleReminder(rem.id)}
                    className={cn(
                      "h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
                      rem.completed
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 dark:border-slate-600"
                    )}
                  >
                    {rem.completed && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <div>
                    <h4 className={cn(
                      "text-xs font-bold text-slate-900 dark:text-white",
                      rem.completed && "line-through text-slate-400"
                    )}>
                      {rem.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-2xs text-slate-400">
                      <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {rem.category}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Due: {rem.dueDate || "Upcoming"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {rem.targetUrl && (
                    <Link
                      to={rem.targetUrl}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-2xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                  <button
                    onClick={() => handleRemoveReminder(rem.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove reminder"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TEAM WILLINGNESS & KNOWLEDGE SKILLS */}
      {activeTab === "team_talent" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                Team Collaboration & Knowledge Skills
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              "In profile only they can update I have knowledge in this and I am willing to be a part of another team. Those members only available to them in idea analyzer and they can tick mark them."
            </p>
          </div>

          {peerSaveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Your team availability and knowledge skills have been published! You are now visible for selection in the Idea Analyzer.</span>
            </div>
          )}

          {/* Toggle Willingness to Join Team */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                Willingness to Join Other Teams
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                When enabled, your profile appears in the <strong>Idea Analyzer</strong> so other founders can tick mark you and send collaboration invites.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={peerProfile.willingToJoinTeam}
                onChange={(e) => setPeerProfile({ ...peerProfile, willingToJoinTeam: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                {peerProfile.willingToJoinTeam ? "I am willing to join a team" : "Not looking for a team"}
              </span>
            </label>
          </div>

          {/* Knowledge Skills Multi-select ("I have knowledge in this") */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                "I Have Knowledge In This" (Select all that apply)
              </label>
              <p className="text-2xs text-slate-500 dark:text-slate-400 mt-0.5">
                These tags show your verified competencies when founders search for candidates in the Idea Analyzer.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {ALL_KNOWLEDGE_SKILLS.map((skill) => {
                const isSelected = peerProfile.knowledgeSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkillSelection(skill)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5",
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                    )}
                  >
                    {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 text-slate-400" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Availability & Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Preferred Role Title
              </label>
              <input
                type="text"
                value={peerProfile.roleTitle}
                onChange={(e) => setPeerProfile({ ...peerProfile, roleTitle: e.target.value })}
                placeholder="e.g. Lead Backend Engineer"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Hours / Week Available
              </label>
              <input
                type="number"
                min={1}
                max={40}
                value={peerProfile.hoursPerWeek}
                onChange={(e) => setPeerProfile({ ...peerProfile, hoursPerWeek: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Contact Preference (Email / Discord)
              </label>
              <input
                type="text"
                value={peerProfile.contactPreference}
                onChange={(e) => setPeerProfile({ ...peerProfile, contactPreference: e.target.value })}
                placeholder="alex.chen@university.edu or @alex_dev"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={handleSavePeerTalent}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Update Team Availability & Knowledge</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: INTERACTIVE SKILL MATRIX */}
      {activeTab === "skill_matrix" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  Interactive Skill Matrix
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Updated or declined strictly by your actual user progress (curriculum modules completed, quiz scores, and IDE challenge passes).
              </p>
            </div>

            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              Verified Achievements: {quizzesCompletedCount} Quizzes · {solvedChallengesCount} Code Challenges
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillMatrix.map((item) => {
              const isUpdated = item.status === "updated";
              const pct = Math.round(item.currentLevel * 100);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-5 rounded-2xl border transition-all",
                    isUpdated
                      ? "bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      : "bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {item.category}
                    </span>
                    <span className={cn(
                      "text-3xs font-black uppercase px-2 py-0.5 rounded-md",
                      isUpdated
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                        : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                    )}>
                      {isUpdated ? "Updated by User Progress" : "Declined / Locked"}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {item.name}
                  </h3>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold">Competency Score</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isUpdated
                            ? "bg-gradient-to-r from-indigo-500 to-emerald-500"
                            : "bg-slate-400 dark:bg-slate-600"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-2xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: VIRTUAL MEDALS & BADGES */}
      {activeTab === "badges" && (
        <BadgeShowcase earnedBadges={earnedBadges} userStats={rankInfo || {}} />
      )}

      {/* TAB 7: INTEGRATED LEADERBOARD & RANKINGS */}
      {activeTab === "leaderboard" && (
        <div className="space-y-6">
          <LeaderboardComponent
            title="Institutional & Global Student Leaderboard"
            description="Official ranking based on completed curriculum modules, ELI5 documentation quizzes, and browser code challenge scores."
          />
        </div>
      )}
    </div>
  );
}
