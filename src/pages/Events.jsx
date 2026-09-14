import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  ArrowRight,
  UserPlus,
  Phone,
  Trash2,
  Check,
  X,
  AlertCircle,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getStoredEvents, 
  getEventRegistrations, 
  registerForEvent,
  getStoredEventTeams,
  saveStoredEventTeam,
  cancelEventTeamRequest,
  applyToEventTeam,
  cancelEventTeamApplication,
  approveEventTeamApplicant,
  rejectEventTeamApplicant,
  approveAllEventTeamApplicants
} from "@/lib/dataStore";
import { useAuth } from "@/lib/AuthContext";

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [eventTeams, setEventTeams] = useState([]);
  
  // Navigation tabs: "events" or "teams"
  const [activeTab, setActiveTab] = useState("events"); // 'events' | 'teams'
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Event Registration Modal
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [regTeamName, setRegTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("Solo");
  const [regSuccess, setRegSuccess] = useState(false);

  // Post Team Request Modal
  const [showPostTeamModal, setShowPostTeamModal] = useState(false);
  const [selectedEventForPost, setSelectedEventForPost] = useState("");
  const [squadName, setSquadName] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("+1 (555) 019-2834");
  const [rolesNeededInput, setRolesNeededInput] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [projectVision, setProjectVision] = useState("");
  const [targetMembersCount, setTargetMembersCount] = useState(4);

  // Apply to Squad Modal
  const [activeSquadForApply, setActiveSquadForApply] = useState(null);
  const [applicantRole, setApplicantRole] = useState("Frontend Engineer");
  const [applicantPhone, setApplicantPhone] = useState("+1 (555) 019-2834");
  const [applicantPitch, setApplicantPitch] = useState("");
  const [applicantSkills, setApplicantSkills] = useState("React, Tailwind CSS, TypeScript");

  // Success alert
  const [alertMessage, setAlertMessage] = useState("");

  const loadData = () => {
    setEvents(getStoredEvents());
    setRegistrations(getEventRegistrations());
    setEventTeams(getStoredEventTeams());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = (e) => {
      if (!e.detail || e.detail.key?.startsWith("skillsmap_event")) {
        loadData();
      }
    };
    window.addEventListener("skillsmap_store_update", handleUpdate);
    return () => window.removeEventListener("skillsmap_store_update", handleUpdate);
  }, []);

  const categories = ["All", "Hackathon", "Conference", "Competition", "Workshop"];

  const filteredEvents = events.filter((e) => {
    const matchesCat = selectedCategory === "All" || e.type?.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || 
      e.title?.toLowerCase().includes(q) ||
      e.organizer?.toLowerCase().includes(q) ||
      e.tags?.some(t => t.toLowerCase().includes(q)) ||
      e.category?.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const filteredTeams = eventTeams.filter((t) => {
    const q = searchQuery.toLowerCase();
    return !q || 
      t.squadName?.toLowerCase().includes(q) ||
      t.eventTitle?.toLowerCase().includes(q) ||
      t.projectVision?.toLowerCase().includes(q) ||
      t.rolesNeeded?.some(r => r.toLowerCase().includes(q)) ||
      t.techStack?.some(s => s.toLowerCase().includes(q));
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!activeModalEvent) return;

    registerForEvent(activeModalEvent.id, {
      studentName: user?.full_name || "Alex Chen",
      studentEmail: user?.email || "alex.chen@university.edu",
      teamName: regTeamName || "Solo Participant",
      teamSize,
    });

    setRegSuccess(true);
    setRegistrations(getEventRegistrations());
    setTimeout(() => {
      setRegSuccess(false);
      setActiveModalEvent(null);
      setRegTeamName("");
    }, 1800);
  };

  const handleCreateSquad = (e) => {
    e.preventDefault();
    const evt = events.find(ev => ev.id === selectedEventForPost) || events[0];
    if (!squadName.trim() || !projectVision.trim()) return;

    const newTeam = {
      eventId: evt.id,
      eventTitle: evt.title,
      squadName: squadName.trim(),
      leaderName: user?.full_name || "Alex Chen",
      leaderEmail: user?.email || "alex.chen@university.edu",
      leaderPhone: leaderPhone || "+1 (555) 019-2834",
      targetMembersCount: Number(targetMembersCount) || 4,
      currentCount: 1,
      projectVision: projectVision.trim(),
      rolesNeeded: rolesNeededInput.split(",").map(r => r.trim()).filter(Boolean),
      techStack: techStackInput.split(",").map(s => s.trim()).filter(Boolean),
      applicants: [],
      status: "Recruiting Teammates"
    };

    saveStoredEventTeam(newTeam);
    setEventTeams(getStoredEventTeams());
    setShowPostTeamModal(false);
    setSquadName("");
    setProjectVision("");
    setRolesNeededInput("");
    setTechStackInput("");
    setAlertMessage(`Team "${newTeam.squadName}" posted! Other participants can now request to join.`);
    setTimeout(() => setAlertMessage(""), 5000);
  };

  const handleApplyToSquad = (e) => {
    e.preventDefault();
    if (!activeSquadForApply) return;

    applyToEventTeam(activeSquadForApply.id, {
      studentName: user?.full_name || "Alex Chen",
      studentEmail: user?.email || "alex.chen@university.edu",
      studentPhone: applicantPhone || "+1 (555) 019-2834",
      role: applicantRole,
      pitch: applicantPitch.trim() || "Excited to join the squad and build an awesome project!",
      skills: applicantSkills.split(",").map(s => s.trim()).filter(Boolean)
    });

    setEventTeams(getStoredEventTeams());
    setActiveSquadForApply(null);
    setApplicantPitch("");
    setAlertMessage(`Application sent to ${activeSquadForApply.leaderName}! Contact info dispatched to their direct number.`);
    setTimeout(() => setAlertMessage(""), 5000);
  };

  const handleCancelTeam = (teamId, squadTitle) => {
    if (window.confirm(`Are you sure you want to cancel the team request for "${squadTitle}"?`)) {
      cancelEventTeamRequest(teamId);
      setEventTeams(getStoredEventTeams());
      setAlertMessage(`Team request "${squadTitle}" has been cancelled.`);
      setTimeout(() => setAlertMessage(""), 4000);
    }
  };

  const handleCancelApplication = (teamId) => {
    const currentEmail = user?.email || "alex.chen@university.edu";
    cancelEventTeamApplication(teamId, currentEmail);
    setEventTeams(getStoredEventTeams());
    setAlertMessage("Your application has been withdrawn.");
    setTimeout(() => setAlertMessage(""), 4000);
  };

  const handleApproveApplicant = (teamId, appId, studentName) => {
    approveEventTeamApplicant(teamId, appId);
    setEventTeams(getStoredEventTeams());
    setAlertMessage(`Approved ${studentName}! They are now on your squad roster.`);
    setTimeout(() => setAlertMessage(""), 4000);
  };

  const handleRejectApplicant = (teamId, appId) => {
    rejectEventTeamApplicant(teamId, appId);
    setEventTeams(getStoredEventTeams());
  };

  const handleApproveAll = (teamId, squadTitle) => {
    approveAllEventTeamApplicants(teamId);
    setEventTeams(getStoredEventTeams());
    setAlertMessage(`All pending teammates approved for "${squadTitle}"! Your squad is locked and ready to register.`);
    setTimeout(() => setAlertMessage(""), 5000);
  };

  const isRegistered = (eventId) => registrations.some(r => r.eventId === eventId);
  const userEmail = user?.email || "alex.chen@university.edu";

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-body">
      {/* Alert banner */}
      {alertMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            <Trophy className="h-3.5 w-3.5" />
            Hackathons, Competitions & Squad Matching
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            Compete, Build & Win Together
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Join top collegiate hackathons, find talented co-builders, recruit peer squads, and fast-track your team registration.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>$140,000+ Total Prize Pool</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Users className="h-4 w-4 text-indigo-400" />
              <span>{eventTeams.length} Active Hackathon Squads Recruiting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("events")}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              activeTab === "events"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            <Trophy className="h-4 w-4" />
            <span>Hackathons & Events ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative",
              activeTab === "teams"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            <Users className="h-4 w-4" />
            <span>Squad Recruitment ({eventTeams.length})</span>
            {eventTeams.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-indigo-500 absolute -top-0.5 -right-0.5 animate-pulse" />
            )}
          </button>
        </div>

        <button
          onClick={() => {
            setSelectedEventForPost(events[0]?.id || "");
            setShowPostTeamModal(true);
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Post Team Request for Hackathon</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {activeTab === "events" ? (
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"
                )}
              >
                {cat === "All" ? "All Events" : `${cat}s`}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-medium">
            Connect directly with student founders, approve squad members, and lock your hackathon team.
          </p>
        )}

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === "events" ? "Search events or tags..." : "Search squads or skills..."}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* TAB 1: EVENTS GRID */}
      {activeTab === "events" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const registered = isRegistered(evt.id);
            const squadsForEvt = eventTeams.filter(t => t.eventId === evt.id);
            return (
              <div
                key={evt.id}
                className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Banner Header */}
                  <div className={cn("p-5 text-white bg-gradient-to-r relative", evt.bannerGradient || "from-slate-900 to-indigo-950")}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white">
                        {evt.type}
                      </span>
                      {registered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                          <CheckCircle2 className="h-3 w-3" /> Registered
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5" />
                          {evt.prizePool}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-2">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">{evt.organizer}</p>
                  </div>

                  {/* Details Body */}
                  <div className="p-5 space-y-3.5">
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-700/70">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{evt.dateRange}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                        <span className="truncate">{evt.mode}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Squad recruitment alert */}
                    {squadsForEvt.length > 0 && (
                      <div 
                        onClick={() => {
                          setActiveTab("teams");
                          setSearchQuery(evt.title);
                        }}
                        className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between text-xs text-indigo-800 dark:text-indigo-200 cursor-pointer hover:bg-indigo-100/70 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 font-bold">
                          <Users className="h-3.5 w-3.5 text-indigo-600" />
                          {squadsForEvt.length} Squad(s) Recruiting
                        </span>
                        <span className="text-[10px] underline font-semibold">View Squads →</span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {evt.tags?.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => setActiveModalEvent(evt)}
                    className={cn(
                      "w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs",
                      registered
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                    )}
                  >
                    {registered ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>View My Registration</span>
                      </>
                    ) : (
                      <>
                        <span>Register for Event</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEventForPost(evt.id);
                      setShowPostTeamModal(true);
                    }}
                    className="w-full py-2 rounded-xl text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Find Teammates for this Event</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SQUAD RECRUITMENT BOARD */}
      {activeTab === "teams" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeams.map((squad) => {
              const isLead = squad.leaderEmail === userEmail;
              const hasApplied = squad.applicants?.some(a => a.studentEmail === userEmail);
              const pendingApplicants = (squad.applicants || []).filter(a => a.status === "pending");
              const approvedApplicants = (squad.applicants || []).filter(a => a.status === "approved");

              return (
                <div
                  key={squad.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60">
                          {squad.eventTitle}
                        </span>
                        <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mt-1">
                          {squad.squadName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Led by <strong className="text-slate-700 dark:text-slate-200">{squad.leaderName}</strong></span>
                          <span>•</span>
                          <a 
                            href={`tel:${squad.leaderPhone}`}
                            className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Phone className="h-3 w-3" />
                            {squad.leaderPhone}
                          </a>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                          squad.status === "Squad Locked"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                        )}>
                          {squad.status}
                        </span>
                        <p className="text-[11px] font-bold text-slate-500 mt-1">
                          {1 + approvedApplicants.length} / {squad.targetMembersCount} Members
                        </p>
                      </div>
                    </div>

                    {/* Vision */}
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Project Concept & Vision
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {squad.projectVision}
                      </p>
                    </div>

                    {/* Roles needed & Tech Stack */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-indigo-500" />
                          Roles Recruiting
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {squad.rolesNeeded?.map((role) => (
                            <span
                              key={role}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          Tech Stack
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {squad.techStack?.map((stk) => (
                            <span
                              key={stk}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              {stk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Approved Roster */}
                    {approvedApplicants.length > 0 && (
                      <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 space-y-1.5 text-xs">
                        <p className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Approved Teammates Roster
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                            <span>👑 {squad.leaderName} (Team Lead)</span>
                            <span className="font-mono text-[10px]">{squad.leaderPhone}</span>
                          </div>
                          {approvedApplicants.map((app) => (
                            <div key={app.id} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                              <span>⚡ {app.studentName} ({app.role})</span>
                              <div className="flex items-center gap-2">
                                <a 
                                  href={`tel:${app.studentPhone}`}
                                  className="text-emerald-700 dark:text-emerald-300 hover:underline font-mono text-[10px] flex items-center gap-0.5"
                                >
                                  <Phone className="h-2.5 w-2.5" /> {app.studentPhone}
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pending Applicants (visible to Team Lead) */}
                    {isLead && pendingApplicants.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <span>{pendingApplicants.length} Pending Join Request(s)</span>
                          </div>
                          <button
                            onClick={() => handleApproveAll(squad.id, squad.squadName)}
                            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-xs"
                          >
                            Approve All
                          </button>
                        </div>

                        <div className="space-y-2">
                          {pendingApplicants.map((app) => (
                            <div
                              key={app.id}
                              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200/80 dark:border-slate-700 space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-white">
                                    {app.studentName} <span className="font-normal text-slate-500">({app.role})</span>
                                  </p>
                                  <a 
                                    href={`tel:${app.studentPhone}`}
                                    className="text-indigo-600 hover:underline font-mono text-[10px] flex items-center gap-1"
                                  >
                                    <Phone className="h-2.5 w-2.5" /> {app.studentPhone}
                                  </a>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleApproveApplicant(squad.id, app.id, app.studentName)}
                                    className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                    title="Approve Applicant"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectApplicant(squad.id, app.id)}
                                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-rose-100 hover:text-rose-600"
                                    title="Decline"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                                "{app.pitch}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
                    {isLead ? (
                      <div className="w-full flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleCancelTeam(squad.id, squad.squadName)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Cancel Squad Request</span>
                        </button>

                        <button
                          onClick={() => {
                            const evt = events.find(e => e.id === squad.eventId);
                            if (evt) setActiveModalEvent(evt);
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                        >
                          Register Locked Squad
                        </button>
                      </div>
                    ) : hasApplied ? (
                      <div className="w-full flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Application Sent (Pending Review)
                        </span>
                        <button
                          onClick={() => handleCancelApplication(squad.id)}
                          className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          Withdraw Request
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveSquadForApply(squad)}
                        disabled={squad.status === "Squad Locked"}
                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Request to Join Squad</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: POST TEAM REQUEST FOR HACKATHON */}
      {showPostTeamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  RECRUIT HACKATHON SQUAD
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Post Team Request for Event
                </h3>
              </div>
              <button
                onClick={() => setShowPostTeamModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Hackathon / Event</label>
                <select
                  value={selectedEventForPost}
                  onChange={(e) => setSelectedEventForPost(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title} ({ev.prizePool})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Squad Name</label>
                <input
                  type="text"
                  required
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  placeholder="e.g. Autonomous Agents Squad, Neural Health Core"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Team Leader Phone</label>
                  <input
                    type="text"
                    required
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Squad Size</label>
                  <select
                    value={targetMembersCount}
                    onChange={(e) => setTargetMembersCount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value={2}>2 Members</option>
                    <option value={3}>3 Members</option>
                    <option value={4}>4 Members (Standard)</option>
                    <option value={5}>5 Members</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Roles Needed (comma separated)</label>
                <input
                  type="text"
                  value={rolesNeededInput}
                  onChange={(e) => setRolesNeededInput(e.target.value)}
                  placeholder="e.g. Frontend (React), AI/ML Engineer, UI/UX Designer"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="e.g. React, Python, Gemini 3, FastAPI, Docker"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Concept & Vision</label>
                <textarea
                  rows={3}
                  required
                  value={projectVision}
                  onChange={(e) => setProjectVision(e.target.value)}
                  placeholder="Briefly describe what your squad plans to build and what you are looking for in co-builders..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
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
                  className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Publish Team Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APPLY TO SQUAD */}
      {activeSquadForApply && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  JOIN SQUAD
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Apply to {activeSquadForApply.squadName}
                </h3>
                <p className="text-xs text-slate-500">Leader: {activeSquadForApply.leaderName}</p>
              </div>
              <button
                onClick={() => setActiveSquadForApply(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyToSquad} className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 space-y-0.5">
                <p className="font-bold">Event: {activeSquadForApply.eventTitle}</p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300">Roles needed: {activeSquadForApply.rolesNeeded?.join(", ")}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Role / Specialty</label>
                <input
                  type="text"
                  required
                  value={applicantRole}
                  onChange={(e) => setApplicantRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, UI/UX Designer, ML Specialist"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Direct Contact Phone Number</label>
                <input
                  type="text"
                  required
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">This number will be sent to the team leader for direct WhatsApp/SMS coordination.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Key Skills (comma separated)</label>
                <input
                  type="text"
                  value={applicantSkills}
                  onChange={(e) => setApplicantSkills(e.target.value)}
                  placeholder="e.g. React, Tailwind CSS, Python, Docker"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Pitch / Availability</label>
                <textarea
                  rows={3}
                  required
                  value={applicantPitch}
                  onChange={(e) => setApplicantPitch(e.target.value)}
                  placeholder="Explain why you'd be a great fit for this project and your availability during the hackathon weekend..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSquadForApply(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Send Application to Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EVENT OFFICIAL REGISTRATION */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  {activeModalEvent.type} REGISTRATION
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {activeModalEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {regSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Registration Confirmed!</h4>
                <p className="text-xs text-slate-500">Your student entry has been successfully logged. Event instructions sent to your email.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 space-y-1">
                  <p className="font-bold">Prize Pool: {activeModalEvent.prizePool}</p>
                  <p>Eligibility: {activeModalEvent.eligibility}</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Student / Team Lead</label>
                  <input
                    type="text"
                    disabled
                    value={`${user?.full_name || "Alex Chen"} (${user?.email || "alex.chen@university.edu"})`}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Team Name (Optional)</label>
                  <input
                    type="text"
                    value={regTeamName}
                    onChange={(e) => setRegTeamName(e.target.value)}
                    placeholder="e.g. Neural Builders, Autonomous 4"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Participation Format</label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Solo">Solo Participant</option>
                    <option value="Team of 2">Team of 2</option>
                    <option value="Team of 3">Team of 3</option>
                    <option value="Team of 4">Full Team (4 Members)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalEvent(null)}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                  >
                    Confirm Student Registration
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
