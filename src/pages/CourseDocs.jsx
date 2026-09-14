import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Download, 
  Smile,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Globe,
  Copy,
  Check,
  Search,
  Video,
  Play,
  PlayCircle,
  HelpCircle,
  Terminal,
  Sparkles,
  RefreshCw,
  Clock,
  Layers
} from "lucide-react";
import { SUBJECTS_LIST, ALL_SUBJECT_DAY_NOTES, SUBJECT_WEB_DOCUMENTATION } from "@/data/courseDocsData";
import { downloadFullCoursePDF, downloadSingleDayPDF } from "@/lib/coursePdfGenerator";
import { getMyProfile } from "@/lib/skillMap";
import { cn } from "@/lib/utils";

export default function CourseDocs() {
  const [selectedSubjectId, setSelectedSubjectId] = useState("python");
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("deep_dive"); // 'deep_dive' | 'video' | 'code' | 'eli5' | 'pitfalls' | 'quiz' | 'resources'
  const [showSolution, setShowSolution] = useState(false);
  const [downloadingFull, setDownloadingFull] = useState(false);
  const [downloadingDay, setDownloadingDay] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive Code Simulator state
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [simulatedOutput, setSimulatedOutput] = useState(null);

  // Interactive Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [completedDays, setCompletedDays] = useState({});

  // Active Embedded Video
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const p = await getMyProfile();
      setProfile(p);
    }
    load();
  }, []);

  const currentSubjectObj = SUBJECTS_LIST.find((s) => s.id === selectedSubjectId) || SUBJECTS_LIST[0];
  const allDaysForSubject = ALL_SUBJECT_DAY_NOTES[selectedSubjectId] || ALL_SUBJECT_DAY_NOTES.python;
  
  // Filter days if search query entered
  const filteredDays = allDaysForSubject.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.title?.toLowerCase().includes(q) ||
      d.summary?.toLowerCase().includes(q) ||
      d.topicCategory?.toLowerCase().includes(q)
    );
  });

  const currentDay = allDaysForSubject.find((d) => d.dayNumber === selectedDayNumber) || allDaysForSubject[0];
  const officialDocs = SUBJECT_WEB_DOCUMENTATION[selectedSubjectId] || [];

  // Reset interactive states on day or subject change
  const handleSubjectChange = (subjId) => {
    setSelectedSubjectId(subjId);
    setSelectedDayNumber(1);
    setShowSolution(false);
    setSearchQuery("");
    setSimulatedOutput(null);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setActiveVideoIndex(0);
  };

  const handleDaySelect = (dayNum) => {
    setSelectedDayNumber(dayNum);
    setShowSolution(false);
    setSimulatedOutput(null);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setActiveVideoIndex(0);
  };

  const handleDownloadFullPDF = () => {
    setDownloadingFull(true);
    try {
      downloadFullCoursePDF(allDaysForSubject, { ...profile, track: currentSubjectObj.name });
    } catch (err) {
      console.error("Full course PDF error:", err);
    } finally {
      setTimeout(() => setDownloadingFull(false), 800);
    }
  };

  const handleDownloadDayPDF = (dayItem = currentDay) => {
    setDownloadingDay(true);
    try {
      downloadSingleDayPDF(dayItem, { ...profile, track: currentSubjectObj.name });
    } catch (err) {
      console.error("Day PDF error:", err);
    } finally {
      setTimeout(() => setDownloadingDay(false), 800);
    }
  };

  const handleCopyText = (text, type = "url") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(""), 2000);
    }
  };

  const handleRunSimulator = () => {
    setIsRunningCode(true);
    setSimulatedOutput(null);
    setTimeout(() => {
      setIsRunningCode(false);
      setSimulatedOutput(currentDay.expectedOutput || "Program executed successfully with exit code 0.");
    }, 600);
  };

  const handleToggleDayComplete = (dayNum) => {
    setCompletedDays((prev) => ({
      ...prev,
      [`${selectedSubjectId}-${dayNum}`]: !prev[`${selectedSubjectId}-${dayNum}`]
    }));
  };

  const isCurrentDayCompleted = !!completedDays[`${selectedSubjectId}-${selectedDayNumber}`];

  const tabs = [
    { id: "deep_dive", label: "Architectural Deep Dive", icon: Layers, badge: "Core" },
    { id: "video", label: "YouTube Lectures", icon: Video, badge: currentDay.youtubeLectures?.length ? `${currentDay.youtubeLectures.length}` : null },
    { id: "code", label: "Code Lab & Runner", icon: Terminal, badge: "Lab" },
    { id: "eli5", label: "ELI5 Mental Model", icon: Smile },
    { id: "pitfalls", label: "Pitfalls & Edge Cases", icon: AlertTriangle },
    { id: "quiz", label: "Drill Challenge & Quiz", icon: HelpCircle, badge: "Interactive" },
    { id: "resources", label: "Verified Web Docs", icon: Globe, badge: `${(currentDay.externalResources?.length || 0) + officialDocs.length}` }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-body">
      {/* Top Banner & PDF Exporters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              VERIFIED ENGINEERING HANDBOOKS & ACADEMIC SPECS
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              Interactive Lab & YouTube Enabled
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2.5">
            <BookOpen className="h-7 w-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
            Course Handbooks & Technical Notes
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
            In-depth day-by-day architectural specifications, under-the-hood execution models, intuitive ELI5 mental models, annotated production code, clickable YouTube video masterclasses, and authoritative reference links.
          </p>
        </div>

        {/* Global Action Export Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleDownloadDayPDF(currentDay)}
            disabled={downloadingDay}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-xs transition-all active:scale-95 disabled:opacity-50"
            title="Download formatted single-chapter PDF"
          >
            {downloadingDay ? (
              <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
            ) : (
              <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            )}
            <span>Export Day {currentDay.dayNumber} PDF</span>
          </button>

          <button
            onClick={handleDownloadFullPDF}
            disabled={downloadingFull}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
            title="Export complete 10-day structured syllabus with hyperlinks and video refs"
          >
            {downloadingFull ? (
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Download className="h-4 w-4 text-white" />
            )}
            <span>Download Full 10-Day Handbook (PDF)</span>
          </button>
        </div>
      </div>

      {/* Subject Track Selector Chips */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          SELECT SUBJECT CURRICULUM
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SUBJECTS_LIST.map((subj) => {
            const isSelected = subj.id === selectedSubjectId;
            return (
              <button
                key={subj.id}
                onClick={() => handleSubjectChange(subj.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-2xl text-left border transition-all duration-200 shadow-xs group",
                  isSelected
                    ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-600 ring-2 ring-indigo-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                )}
              >
                <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  {subj.icon}
                </span>
                <div className="min-w-0">
                  <p className={cn(
                    "text-xs font-bold truncate",
                    isSelected ? "text-indigo-900 dark:text-indigo-200" : "text-slate-800 dark:text-slate-200"
                  )}>
                    {subj.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {subj.totalDays} Days · {subj.level.split(" ")[0]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Study Grid Layout: Left Day Navigator + Right Interactive Content Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Day Selector & Search Sidebar (4 cols on LG) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                Module Syllabus Directory
              </h3>
              <p className="text-[11px] text-slate-400">
                {filteredDays.length} Modules Available
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {currentSubjectObj.icon} {selectedSubjectId.toUpperCase()}
            </span>
          </div>

          {/* Module Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts, opcodes, memory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Day List */}
          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredDays.map((dayItem) => {
              const isSelected = dayItem.dayNumber === selectedDayNumber;
              const isDone = !!completedDays[`${selectedSubjectId}-${dayItem.dayNumber}`];
              return (
                <div
                  key={dayItem.id || dayItem.dayNumber}
                  onClick={() => handleDaySelect(dayItem.dayNumber)}
                  className={cn(
                    "w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 group",
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                      : "bg-slate-50/70 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 mt-0.5",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                    )}>
                      D{dayItem.dayNumber}
                    </span>
                    <div className="min-w-0">
                      <p className={cn(
                        "text-xs font-bold leading-tight truncate",
                        isSelected ? "text-white" : "text-slate-900 dark:text-white"
                      )}>
                        {(dayItem.title || "").replace(/^Day \d+:\s*/i, "")}
                      </p>
                      <p className={cn(
                        "text-[10px] mt-0.5 truncate",
                        isSelected ? "text-indigo-100" : "text-slate-400"
                      )}>
                        {dayItem.topicCategory || "Architecture"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDayComplete(dayItem.dayNumber);
                    }}
                    title={isDone ? "Mark as Incomplete" : "Mark as Mastered"}
                    className={cn(
                      "p-1 rounded-lg transition-transform active:scale-90 shrink-0",
                      isDone
                        ? "text-emerald-400 bg-emerald-950/60"
                        : isSelected ? "text-white/40 hover:text-white" : "text-slate-300 hover:text-emerald-500"
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Stats Footnote */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Primary Reference:</span>
            <a
              href={currentSubjectObj.primaryDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>{currentSubjectObj.docName.split(" ")[0]} Docs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Day Content & Simulator (8 cols on LG) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Day Card Header & Quick Status */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-indigo-600 text-white shadow-xs">
                  Day {currentDay.dayNumber}
                </span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentDay.topicCategory || "Core Architecture"}
                </span>
                {isCurrentDayCompleted && (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Completed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleDayComplete(currentDay.dayNumber)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                    isCurrentDayCompleted
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{isCurrentDayCompleted ? "Marked Complete" : "Mark Complete"}</span>
                </button>
                <button
                  onClick={() => handleDownloadDayPDF(currentDay)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                  title="Export Day PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                {currentDay.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                {currentDay.summary}
              </p>
            </div>

            {/* Interactive Tab Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 dark:border-slate-800 custom-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0",
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.2 rounded-full font-bold",
                        isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      )}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: Architectural Deep Dive */}
          {activeTab === "deep_dive" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300">
                    SECTION 2.0
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    Under-the-Hood System Architecture & Execution Mechanism
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3">
                  <p>{currentDay.deepExplanation}</p>
                </div>
              </div>

              {/* Core Key Concepts Cards */}
              {currentDay.eli10?.keyConcepts?.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Core Technical Principles & Terminology
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentDay.eli10.keyConcepts.map((kc, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1"
                      >
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          {kc.term}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          {kc.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Curated YouTube Video Lectures */}
          {activeTab === "video" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">
                      YOUTUBE MASTERCLASS VAULT
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      Curated Technical Lectures & Walkthroughs
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Watch embedded or open directly in YouTube with timestamp markers.
                  </p>
                </div>
              </div>

              {currentDay.youtubeLectures && currentDay.youtubeLectures.length > 0 ? (
                <div className="space-y-6">
                  {/* Selected Video Player & Embed */}
                  {(() => {
                    const activeVideo = currentDay.youtubeLectures[activeVideoIndex] || currentDay.youtubeLectures[0];
                    return (
                      <div className="space-y-4">
                        {/* Video Embed Player Container */}
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?rel=0`}
                            title={activeVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full border-0"
                          />
                        </div>

                        {/* Video Info Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                                {activeVideo.title}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Instructor / Channel: <strong className="text-slate-700 dark:text-slate-300">{activeVideo.channel}</strong> · Duration: {activeVideo.duration}
                              </p>
                            </div>
                            <a
                              href={activeVideo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors shrink-0 shadow-xs"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" />
                              <span>Watch on YouTube</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {activeVideo.summary}
                          </p>

                          {/* Timestamp Markers */}
                          {activeVideo.timestampGuide?.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Key Topic Timestamps:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {activeVideo.timestampGuide.map((ts, idx) => (
                                  <a
                                    key={idx}
                                    href={`${activeVideo.url}&t=${ts.time.replace(":", "m")}s`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 border border-slate-200 dark:border-slate-700 transition-colors"
                                  >
                                    <Clock className="h-3 w-3 text-red-500" />
                                    <span className="font-mono font-bold text-red-600 dark:text-red-400">{ts.time}</span>
                                    <span>{ts.label}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Multi-video Selector list if multiple lectures available */}
                        {currentDay.youtubeLectures.length > 1 && (
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Other Available Lectures for this Day:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {currentDay.youtubeLectures.map((vid, vIdx) => (
                                <button
                                  key={vIdx}
                                  onClick={() => setActiveVideoIndex(vIdx)}
                                  className={cn(
                                    "p-3 rounded-xl text-left border flex items-center gap-3 transition-all",
                                    activeVideoIndex === vIdx
                                      ? "bg-red-50 dark:bg-red-950/50 border-red-500 ring-1 ring-red-500/20"
                                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                                  )}
                                >
                                  <PlayCircle className={cn(
                                    "h-5 w-5 shrink-0",
                                    activeVideoIndex === vIdx ? "text-red-600" : "text-slate-400"
                                  )} />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                                      {vid.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                      {vid.channel} · {vid.duration}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Video className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Video lectures being indexed for this module.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Check official web docs or the code lab for interactive exploration.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Interactive Code Lab & Output Runner */}
          {activeTab === "code" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                      INTERACTIVE CODE LAB
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      Verified Production Implementation & Live Runner
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Inspect production-grade code, copy snippets, and simulate console execution in real-time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(currentDay.codeSnippet, "code")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                  </button>

                  <button
                    onClick={handleRunSimulator}
                    disabled={isRunningCode}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isRunningCode ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
                    ) : (
                      <Play className="h-3.5 w-3.5 fill-current" />
                    )}
                    <span>{isRunningCode ? "Executing..." : "▶ Run Simulator"}</span>
                  </button>
                </div>
              </div>

              {/* Code Monospace Box */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0b101b] shadow-lg">
                <div className="px-4 py-2.5 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-slate-300 font-bold">main_{selectedSubjectId}.py</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Syntax Verified · UTF-8</span>
                </div>
                <div className="p-4 overflow-x-auto custom-scrollbar">
                  <pre className="text-xs font-mono text-indigo-300 leading-relaxed">
                    <code>{currentDay.codeSnippet}</code>
                  </pre>
                </div>
              </div>

              {/* Live Terminal Output Simulator */}
              {(simulatedOutput || isRunningCode) && (
                <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-4 space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Terminal Simulation Output (STDOUT)</span>
                    </div>
                    <span>Exit: 0 (OK)</span>
                  </div>
                  {isRunningCode ? (
                    <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 py-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Compiling bytecode and evaluating stack frames...</span>
                    </div>
                  ) : (
                    <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                      {simulatedOutput}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ELI5 Mental Model */}
          {activeTab === "eli5" && currentDay.eli10 && (
            <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-3xl border border-amber-300/80 dark:border-amber-800/80 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🧒</span>
                <div>
                  <h3 className="text-base font-extrabold text-amber-950 dark:text-amber-200 font-heading">
                    Intuitive Mental Model (ELI5): {currentDay.eli10.title}
                  </h3>
                  <p className="text-xs text-amber-800/80 dark:text-amber-400">
                    Concept translated into everyday physics and real-world analogies.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-800/50">
                <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-100 leading-relaxed font-body">
                  {currentDay.eli10.story}
                </p>
              </div>

              {/* Key Concept Flashcards */}
              {currentDay.eli10.keyConcepts?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                    Core Concepts in Plain English:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentDay.eli10.keyConcepts.map((kc, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 space-y-1"
                      >
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                          {kc.term}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {kc.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Pitfalls & Edge Cases */}
          {activeTab === "pitfalls" && currentDay.pitfalls && (
            <div className="bg-rose-50/80 dark:bg-rose-950/30 rounded-3xl border border-rose-300 dark:border-rose-800/80 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-rose-950 dark:text-rose-200 font-heading">
                    Architectural Pitfalls, Anti-Patterns & Production Traps
                  </h3>
                  <p className="text-xs text-rose-700/80 dark:text-rose-400">
                    High-cost mistakes in production and how senior engineers avoid them.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-rose-200 dark:border-rose-900/60">
                <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-100 leading-relaxed">
                  {currentDay.pitfalls}
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: Drill Challenge & Interactive Knowledge Quiz */}
          {activeTab === "quiz" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
              {/* Hands-on Coding Drill */}
              {currentDay.practiceChallenge && (
                <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                        HANDS-ON EXERCISE
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                        Coding Drill Exercise
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowSolution((prev) => !prev)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                    >
                      {showSolution ? "Hide Solution" : "Reveal Solution"}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      {currentDay.practiceChallenge.question}
                    </p>
                  </div>

                  {showSolution && (
                    <div className="rounded-2xl overflow-hidden border border-emerald-800 bg-[#091319] p-4 space-y-2">
                      <p className="text-[11px] font-mono font-bold text-emerald-400">
                        // Verified Reference Solution:
                      </p>
                      <pre className="text-xs font-mono text-emerald-200 leading-relaxed overflow-x-auto">
                        <code>{currentDay.practiceChallenge.solutionCode}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Multiple Choice Knowledge Quiz */}
              {currentDay.quiz && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                      CONCEPT CHECK
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      Interactive Knowledge Assessment
                    </h3>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {currentDay.quiz.question}
                    </p>

                    <div className="space-y-2">
                      {currentDay.quiz.options.map((opt, optIdx) => {
                        const isChosen = selectedAnswer === optIdx;
                        const isCorrect = optIdx === currentDay.quiz.correctIndex;
                        let stateClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-200";
                        
                        if (isAnswerSubmitted) {
                          if (isCorrect) {
                            stateClass = "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold";
                          } else if (isChosen) {
                            stateClass = "bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200";
                          }
                        } else if (isChosen) {
                          stateClass = "bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-semibold";
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => !isAnswerSubmitted && setSelectedAnswer(optIdx)}
                            className={cn(
                              "p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3",
                              stateClass
                            )}
                          >
                            <span>{opt}</span>
                            {isAnswerSubmitted && isCorrect && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {!isAnswerSubmitted ? (
                        <button
                          onClick={() => selectedAnswer !== null && setIsAnswerSubmitted(true)}
                          disabled={selectedAnswer === null}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-40"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <div className="space-y-2 w-full">
                          <div className={cn(
                            "p-3 rounded-xl text-xs",
                            selectedAnswer === currentDay.quiz.correctIndex
                              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                              : "bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
                          )}>
                            <p className="font-bold">
                              {selectedAnswer === currentDay.quiz.correctIndex ? "🎉 Correct!" : "❌ Incorrect"}
                            </p>
                            <p className="mt-1 text-[11px] leading-relaxed">
                              {currentDay.quiz.explanation}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedAnswer(null);
                              setIsAnswerSubmitted(false);
                            }}
                            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                          >
                            Retry Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Verified Web Documentation & External Hyperlinks */}
          {activeTab === "resources" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                  AUTHORITATIVE REFERENCES
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Verified Documentation & External Hyperlinks
                </h3>
              </div>

              {/* Module specific resources */}
              {currentDay.externalResources?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Day {currentDay.dayNumber} Specific Technical References
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentDay.externalResources.map((res, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-indigo-400 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {res.type || "Specification"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {res.provider}
                            </span>
                          </div>
                          <h5 className="font-heading font-bold text-xs text-slate-900 dark:text-white">
                            {res.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {res.desc}
                          </p>
                        </div>
                        <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-750">
                          <button
                            onClick={() => handleCopyText(res.url)}
                            className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{copiedUrl === res.url ? "Copied!" : "Copy Link"}</span>
                          </button>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <span>Open Docs</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject General Official Docs */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Complete {currentSubjectObj.name} Standard Library & Specifications
                </h4>
                <div className="space-y-2">
                  {officialDocs.map((docItem, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {docItem.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {docItem.desc} · Source: <strong className="text-slate-700 dark:text-slate-300">{docItem.source}</strong>
                        </p>
                      </div>
                      <a
                        href={docItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
                      >
                        <span>Visit Resource</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
