import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Send,
  Users,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getStoredFreelanceGigs, 
  getStudentApplications, 
  submitStudentProposal,
  getStoredStudentOpportunities,
  saveStoredStudentOpportunity,
  applyToStudentOpportunity
} from "@/lib/dataStore";
import { useAuth } from "@/lib/AuthContext";

export default function Freelancing() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'gigs', 'student_teams'
  const [gigs, setGigs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [studentOpportunities, setStudentOpportunities] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [activeGigModal, setActiveGigModal] = useState(null);
  const [activeOppApplyModal, setActiveOppApplyModal] = useState(null);
  const [showPostTeamModal, setShowPostTeamModal] = useState(false);

  // Gig Proposal form state
  const [coverNote, setCoverNote] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [deliveryWeeks, setDeliveryWeeks] = useState("2 Weeks");
  const [gigApplySuccess, setGigApplySuccess] = useState(false);

  // Student Team Application state
  const [teamPitch, setTeamPitch] = useState("");
  const [teamSkills, setTeamSkills] = useState("React, TypeScript, UI/UX");
  const [teamHours, setTeamHours] = useState("10 hrs/week");
  const [oppApplySuccess, setOppApplySuccess] = useState(false);

  // "Post Opportunity: I want a team for my project" state
  const [newOpp, setNewOpp] = useState({
    title: "",
    rolesNeeded: "Frontend (React), AI/ML Engineer",
    projectScope: "",
    techStack: "React, TypeScript, Gemini SDK",
    compensation: "Equal Co-Founder Equity + Hackathon Prize Split",
    timeline: "3 weeks",
  });
  const [postSuccessMsg, setPostSuccessMsg] = useState("");

  const loadData = () => {
    setGigs(getStoredFreelanceGigs());
    setApplications(getStudentApplications());
    setStudentOpportunities(getStoredStudentOpportunities());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = (e) => {
      if (
        !e.detail || 
        e.detail.key === "skillsmap_freelance" || 
        e.detail.key === "skillsmap_freelance_applications" ||
        e.detail.key === "skillsmap_student_opportunities"
      ) {
        loadData();
      }
    };
    window.addEventListener("skillsmap_store_update", handleUpdate);
    return () => window.removeEventListener("skillsmap_store_update", handleUpdate);
  }, []);

  const categories = [
    "All",
    "Frontend Development",
    "Backend & Systems",
    "AI & Machine Learning",
    "UI/UX & Product Design",
    "Full-Stack Development",
    "Technical Writing & DevRel"
  ];

  const filteredGigs = gigs.filter((g) => {
    const matchesCat = selectedCategory === "All" || g.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q ||
      g.title?.toLowerCase().includes(q) ||
      g.client?.toLowerCase().includes(q) ||
      g.skillsRequired?.some(s => s.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const filteredOpportunities = studentOpportunities.filter((opp) => {
    const q = searchQuery.toLowerCase();
    return !q ||
      opp.title?.toLowerCase().includes(q) ||
      opp.creatorName?.toLowerCase().includes(q) ||
      opp.rolesNeeded?.some(r => r.toLowerCase().includes(q)) ||
      opp.techStack?.some(s => s.toLowerCase().includes(q));
  });

  // Handle Freelance Gig Proposal Submit
  const handleProposalSubmit = (e) => {
    e.preventDefault();
    if (!activeGigModal) return;

    submitStudentProposal(activeGigModal.id, {
      studentName: user?.full_name || "Alex Chen",
      studentEmail: user?.email || "alex.chen@university.edu",
      coverNote,
      portfolioLink: portfolioLink || "https://github.com/alexchen-dev",
      deliveryWeeks,
    });

    setGigApplySuccess(true);
    setApplications(getStudentApplications());
    setTimeout(() => {
      setGigApplySuccess(false);
      setActiveGigModal(null);
      setCoverNote("");
    }, 1800);
  };

  // Handle Apply to Student Opportunity ("after they can apply")
  const handleApplyToTeamOpportunity = (e) => {
    e.preventDefault();
    if (!activeOppApplyModal) return;

    applyToStudentOpportunity(activeOppApplyModal.id, {
      studentName: user?.full_name || "Alex Chen",
      studentEmail: user?.email || "alex.chen@university.edu",
      pitch: teamPitch,
      skills: teamSkills.split(",").map(s => s.trim()).filter(Boolean),
      hours: teamHours,
    });

    setOppApplySuccess(true);
    setStudentOpportunities(getStoredStudentOpportunities());
    setTimeout(() => {
      setOppApplySuccess(false);
      setActiveOppApplyModal(null);
      setTeamPitch("");
    }, 1800);
  };

  // Handle Posting Student Opportunity ("post there opportunity like i want a team for my project")
  const handleCreateTeamOpportunity = (e) => {
    e.preventDefault();
    if (!newOpp.title.trim() || !newOpp.projectScope.trim()) return;

    saveStoredStudentOpportunity({
      ...newOpp,
      creatorName: user?.full_name || "Alex Chen",
      creatorEmail: user?.email || "alex.chen@university.edu",
      creatorRole: "Project Lead",
      rolesNeeded: newOpp.rolesNeeded.split(",").map(r => r.trim()).filter(Boolean),
      techStack: newOpp.techStack.split(",").map(s => s.trim()).filter(Boolean),
    });

    setPostSuccessMsg("Your project opportunity has been published! Peers can now apply directly to join your team.");
    setShowPostTeamModal(false);
    setNewOpp({
      title: "",
      rolesNeeded: "Frontend (React), AI/ML Engineer",
      projectScope: "",
      techStack: "React, TypeScript, Gemini SDK",
      compensation: "Equal Co-Founder Equity + Hackathon Prize Split",
      timeline: "3 weeks",
    });
    setStudentOpportunities(getStoredStudentOpportunities());
    setTimeout(() => setPostSuccessMsg(""), 5000);
  };

  const hasAppliedGig = (gigId) => applications.some(a => a.gigId === gigId);
  const hasAppliedTeamOpp = (opp) => {
    const email = user?.email || "alex.chen@university.edu";
    return opp.applicants?.some(a => a.studentEmail === email);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-body">
      {/* Hero Banner with Post Opportunity Trigger */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Paid Gigs & Student Team Opportunities</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
              Freelancing & Project Team Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Earn client payouts on technical bounties, or post opportunities when you want a team for your own project so peers can apply.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPostTeamModal(true)}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Users className="h-4 w-4" />
              <span>Post Opportunity: I Want a Team</span>
            </button>

            <Link
              to="/idea-analyzer"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Analyze Idea & Match Peers</span>
            </Link>
          </div>
        </div>
      </div>

      {postSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{postSuccessMsg}</span>
        </div>
      )}

      {/* View Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === "all"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            All Opportunities ({gigs.length + studentOpportunities.length})
          </button>
          <button
            onClick={() => setActiveTab("student_teams")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeTab === "student_teams"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            <span>Student Teams ({studentOpportunities.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("gigs")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeTab === "gigs"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
            <span>Client Bounties ({gigs.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, skills, roles..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* SECTION: STUDENT PROJECT OPPORTUNITIES ("below there will be students opportunity and after they can apply") */}
      {(activeTab === "all" || activeTab === "student_teams") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-600 text-white">
                <Users className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Student Project Opportunities ("I Want a Team")
              </h2>
            </div>
            <span className="text-2xs font-semibold text-slate-400">
              {filteredOpportunities.length} Available Openings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOpportunities.map((opp) => {
              const applied = hasAppliedTeamOpp(opp);
              const applicantsCount = opp.applicants?.length || 0;

              return (
                <div
                  key={opp.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-xs flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-3xs font-black uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {opp.timeline || "Active Project"}
                      </span>
                      <span className="text-3xs text-slate-400">
                        {applicantsCount} applicant{applicantsCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-2xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Posted by <strong>{opp.creatorName}</strong> ({opp.creatorRole || "Founder"})
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {opp.projectScope}
                    </p>

                    <div>
                      <p className="text-3xs font-bold uppercase text-slate-400 mb-1">Roles Needed:</p>
                      <div className="flex flex-wrap gap-1">
                        {(opp.rolesNeeded || []).map((role, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-3xs font-semibold"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <p className="text-3xs font-bold uppercase text-slate-400 mb-1">Tech Stack:</p>
                      <div className="flex flex-wrap gap-1">
                        {(opp.techStack || []).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-3xs font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-2xs font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[170px]" title={opp.compensation}>
                      {opp.compensation || "Equity / Prize Split"}
                    </span>

                    <button
                      onClick={() => setActiveOppApplyModal(opp)}
                      disabled={applied}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all",
                        applied
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 cursor-default"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                      )}
                    >
                      {applied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Applied ✓</span>
                        </>
                      ) : (
                        <>
                          <span>Apply to Join Team</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION: CLIENT FREELANCE BOUNTIES */}
      {(activeTab === "all" || activeTab === "gigs") && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-600 text-white">
                <DollarSign className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Verified Client Technical Bounties & Gigs
              </h2>
            </div>
            <span className="text-2xs font-semibold text-slate-400">
              {filteredGigs.length} Active Bounties
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGigs.map((gig) => {
              const applied = hasAppliedGig(gig.id);
              return (
                <div
                  key={gig.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-3xs font-black uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {gig.category}
                      </span>
                      <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                        {gig.payout}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {gig.title}
                      </h3>
                      <p className="text-2xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Client: <strong>{gig.client}</strong> · {gig.rateType}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {gig.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {(gig.skillsRequired || []).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-3xs font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-2xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {gig.duration}
                    </span>

                    <button
                      onClick={() => setActiveGigModal(gig)}
                      disabled={applied}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all",
                        applied
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      )}
                    >
                      {applied ? "Proposal Sent ✓" : "Submit Pitch"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: POST OPPORTUNITY ("I want a team for my project") */}
      {showPostTeamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-indigo-600 text-white">
                  <Users className="h-4 w-4" />
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Post Opportunity: I Want a Team
                </h3>
              </div>
              <button
                onClick={() => setShowPostTeamModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamOpportunity} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newOpp.title}
                  onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                  placeholder="e.g. Next-Gen Autonomous PR Reviewer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Roles Needed (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={newOpp.rolesNeeded}
                  onChange={(e) => setNewOpp({ ...newOpp, rolesNeeded: e.target.value })}
                  placeholder="e.g. Frontend (React), AI/ML Engineer, UI/UX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Project Scope & Objectives *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newOpp.projectScope}
                  onChange={(e) => setNewOpp({ ...newOpp, projectScope: e.target.value })}
                  placeholder="What is this project about, what problem does it solve, and what will each teammate contribute?"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newOpp.techStack}
                    onChange={(e) => setNewOpp({ ...newOpp, techStack: e.target.value })}
                    placeholder="React, Node.js, Gemini API"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Timeline / Sprint
                  </label>
                  <input
                    type="text"
                    value={newOpp.timeline}
                    onChange={(e) => setNewOpp({ ...newOpp, timeline: e.target.value })}
                    placeholder="e.g. 3 Weeks (Hackathon Sprint)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Compensation / Equity / Incentives
                </label>
                <input
                  type="text"
                  value={newOpp.compensation}
                  onChange={(e) => setNewOpp({ ...newOpp, compensation: e.target.value })}
                  placeholder="e.g. Equal Equity + $500 Milestone Stipend + Prize Split"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostTeamModal(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                >
                  <Users className="h-3.5 w-3.5" /> Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: APPLY TO STUDENT TEAM OPPORTUNITY ("after they can apply") */}
      {activeOppApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-3xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  APPLY TO JOIN TEAM
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {activeOppApplyModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveOppApplyModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {oppApplySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Application Submitted!</h4>
                <p className="text-xs text-slate-500">Your application has been dispatched to {activeOppApplyModal.creatorName}. They can review your application and contact you directly.</p>
              </div>
            ) : (
              <form onSubmit={handleApplyToTeamOpportunity} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 space-y-1">
                  <p className="font-bold">Project Lead: {activeOppApplyModal.creatorName} ({activeOppApplyModal.creatorEmail})</p>
                  <p>Incentive: {activeOppApplyModal.compensation} · Timeline: {activeOppApplyModal.timeline}</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Pitch & Technical Contribution *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={teamPitch}
                    onChange={(e) => setTeamPitch(e.target.value)}
                    placeholder="Why are you passionate about this project, what skills do you bring, and what have you built previously?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Key Skills
                    </label>
                    <input
                      type="text"
                      value={teamSkills}
                      onChange={(e) => setTeamSkills(e.target.value)}
                      placeholder="React, TypeScript, Node.js"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hours / Week Available
                    </label>
                    <input
                      type="text"
                      value={teamHours}
                      onChange={(e) => setTeamHours(e.target.value)}
                      placeholder="e.g. 10 hrs/week"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveOppApplyModal(null)}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Team Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: GIG PROPOSAL MODAL */}
      {activeGigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-3xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  FREELANCE PROPOSAL
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {activeGigModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveGigModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {gigApplySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Proposal Submitted!</h4>
                <p className="text-xs text-slate-500">Your proposal has been forwarded directly to {activeGigModal.client}. They will review and contact you via your student email.</p>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 space-y-1">
                  <p className="font-bold">Payout: {activeGigModal.payout} ({activeGigModal.rateType})</p>
                  <p>Client: {activeGigModal.client} · Duration: {activeGigModal.duration}</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Applicant
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${user?.full_name || "Alex Chen"} (${user?.email || "alex.chen@university.edu"})`}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Pitch & Relevant Experience *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Describe how you'll approach this project, relevant coursework or previous code repositories..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      GitHub or Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Estimated Turnaround
                    </label>
                    <select
                      value={deliveryWeeks}
                      onChange={(e) => setDeliveryWeeks(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="1 Week">1 Week (Expedited)</option>
                      <option value="2 Weeks">2 Weeks</option>
                      <option value="3 Weeks">3 Weeks</option>
                      <option value="Flexible">Flexible / Part-time</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveGigModal(null)}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Pitch & Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
