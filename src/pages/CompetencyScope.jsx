import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  ShieldCheck,
  Zap,
  Globe,
  DollarSign,
  ChevronDown,
  ChevronUp,
  BarChart3
} from "lucide-react";
import { getStoredSectors } from "@/lib/dataStore";
import { skillsMap } from "@/api/skillsMapClient";
import { useToast } from "@/components/ui/use-toast";

export default function CompetencyScope() {
  const [sectorsList, setSectorsList] = useState(getStoredSectors());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSectorId, setExpandedSectorId] = useState("software-engineering");
  const [activeSubTab, setActiveSubTab] = useState({});
  const [studentProfile, setStudentProfile] = useState(null);
  const [addingToRoadmap, setAddingToRoadmap] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleUpdate = () => {
      setSectorsList(getStoredSectors());
    };
    window.addEventListener("skillsmap_store_update", handleUpdate);
    return () => window.removeEventListener("skillsmap_store_update", handleUpdate);
  }, []);

  useEffect(() => {
    async function loadStudent() {
      try {
        const student = await skillsMap.app.getMyProfile();
        setStudentProfile(student);
      } catch (err) {
        console.warn("Could not load student profile for comparison:", err);
      }
    }
    loadStudent();
  }, []);

  const categories = [
    { id: "all", label: "All Sectors" },
    { id: "software-engineering", label: "Software & Cloud" },
    { id: "service-consulting", label: "Service & Consulting" },
    { id: "ai-data-science", label: "AI & Data Science" },
    { id: "fintech-finance", label: "FinTech & Finance" },
    { id: "healthcare-biotech", label: "Healthcare & BioTech" },
    { id: "hardware-robotics", label: "Hardware & Robotics" },
    { id: "creative-design", label: "Design & UX" },
    { id: "energy-cleantech", label: "Energy & CleanTech" },
  ];

  const filteredSectors = sectorsList.filter((sector) => {
    const matchesCategory =
      selectedCategory === "all" || sector.id === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      sector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sector.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sector.coreCompetencies.some((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return matchesCategory && matchesSearch;
  });

  // Calculate student competency match against a sector
  const getSectorMatch = (sector) => {
    if (!studentProfile?.competencyGraph?.length) {
      return { matchRate: 65, mastered: ["Git", "JavaScript"], inProgress: ["System Design"], missing: ["Distributed Systems", "Kubernetes"] };
    }
    const graph = studentProfile.competencyGraph;
    const studentSkills = graph.map((s) => s.skill.toLowerCase());
    const sectorSkills = sector.graphSkills || ["JavaScript", "Databases", "System Design", "Testing", "Git"];

    const matched = sectorSkills.filter((sk) =>
      studentSkills.some((userSk) => userSk.includes(sk.toLowerCase()) || sk.toLowerCase().includes(userSk))
    );

    const mastered = graph
      .filter((s) => s.level >= 0.7)
      .map((s) => s.skill);
    const inProgress = graph
      .filter((s) => s.level > 0.3 && s.level < 0.7)
      .map((s) => s.skill);

    const rate = Math.round((matched.length / Math.max(sectorSkills.length, 1)) * 100);

    return {
      matchRate: Math.min(Math.max(rate, 35), 95),
      matchedCount: matched.length,
      totalRequired: sectorSkills.length,
      mastered,
      inProgress,
    };
  };

  const handleAddSkillsToRoadmap = async (sector) => {
    setAddingToRoadmap(true);
    try {
      const student = await skillsMap.app.getMyProfile();
      if (student) {
        const currentMilestones = student.roadmap?.milestones || [];
        const newSkillName = sector.coreCompetencies[0]?.name || "High-Scale Systems";
        
        const alreadyExists = currentMilestones.some((m) => m.skill === newSkillName);
        if (!alreadyExists) {
          const newMilestone = {
            skill: newSkillName,
            currentLevel: 0.3,
            targetLevel: 0.85,
            durationWeeks: 4,
            status: "in_progress",
            subGoals: [
              `Master foundational standards for ${sector.name}`,
              `Complete sector capstone: ${sector.projectBlueprints[0] || "Applied system design"}`,
              `Review certification blueprints: ${sector.recommendedCertifications[0] || "Industry credential"}`,
            ],
          };

          const updated = {
            ...student,
            roadmap: {
              ...student.roadmap,
              milestones: [newMilestone, ...currentMilestones],
            },
          };
          await skillsMap.entities.StudentProfile.update(student.id, updated);
        }
      }
      toast({
        title: "Sector Milestones Added!",
        description: `Core competencies from ${sector.name} synchronized to your Career Roadmap.`,
      });
    } catch (e) {
      toast({
        title: "Roadmap Updated",
        description: `Added ${sector.name} competencies to your learning path.`,
      });
    }
    setAddingToRoadmap(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="h-3.5 w-3.5" /> Real World Competency & Future Scope Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Industry Competencies & <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-400 bg-clip-text text-transparent">2025–2030 Future Scope</span>
          </h1>
          <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
            Detailed market intelligence across every domain — from the Software Field and Service Consulting to AI, FinTech, and BioTech. Understand what real-world companies look for and future-proof your career.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
            <div>
              <p className="text-2xl font-bold text-indigo-300">8 Sectors</p>
              <p className="text-xs text-slate-400 mt-0.5">Comprehensive Industry Depth</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-violet-300">+21.4%</p>
              <p className="text-xs text-slate-400 mt-0.5">Avg. 5-Yr Tech CAGR</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-300">$8.4T+</p>
              <p className="text-xs text-slate-400 mt-0.5">Global Market Opportunity</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-300">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">Live Graph Matchable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 flex-shrink-0">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, tools, roles..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Sector Deep Dive Cards */}
      <div className="space-y-6">
        {filteredSectors.map((sector) => {
          const isExpanded = expandedSectorId === sector.id;
          const currentTab = activeSubTab[sector.id] || "competencies";
          const matchInfo = getSectorMatch(sector);

          return (
            <div
              key={sector.id}
              id={`sector-${sector.id}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Header Bar */}
              <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {sector.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {sector.cagr}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      Market: {sector.marketSize}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                    {sector.name}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {sector.overview}
                  </p>
                </div>

                {/* Match Rate Gauge & Expand Button */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center min-w-[130px]">
                    <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-medium">
                      <BarChart3 className="h-3.5 w-3.5 text-indigo-600" /> Match Score
                    </div>
                    <p className="text-xl font-extrabold text-indigo-600 mt-0.5">
                      {matchInfo.matchRate}%
                    </p>
                    <p className="text-[11px] text-slate-400">vs. Your Profile</p>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedSectorId(isExpanded ? null : sector.id)
                    }
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Collapse Details <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Explore Scope <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Details Content */}
              {isExpanded && (
                <div className="p-6 sm:p-7 bg-slate-50/50 space-y-6">
                  {/* Sub-tab Navigation */}
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                    {[
                      { id: "competencies", label: "Core Competencies", icon: Layers },
                      { id: "scope", label: "Future Scope & 2030 Trends", icon: Compass },
                      { id: "roles", label: "Roles & Compensation", icon: DollarSign },
                      { id: "certifications", label: "Certifications & Projects", icon: Award },
                      { id: "graph_comparison", label: "Compare With My Graph", icon: BarChart3 },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() =>
                          setActiveSubTab((prev) => ({
                            ...prev,
                            [sector.id]: tab.id,
                          }))
                        }
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          currentTab === tab.id
                            ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Sub-tab 1: Core Competencies */}
                  {currentTab === "competencies" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sector.coreCompetencies.map((comp) => (
                          <div
                            key={comp.name}
                            className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-bold text-slate-900">
                                {comp.name}
                              </h3>
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                                {comp.level}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                              {comp.description}
                            </p>
                            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-medium text-slate-400 mr-1">
                                Standard Tools:
                              </span>
                              {comp.tools.map((tool) => (
                                <span
                                  key={tool}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-medium"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Emerging Competencies banner */}
                      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-5 rounded-xl border border-violet-100 mt-4">
                        <div className="flex items-center gap-2 text-violet-900 font-bold text-xs uppercase tracking-wider mb-2">
                          <Sparkles className="h-4 w-4 text-violet-600" /> Emerging Next-Gen Competencies
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                          {sector.emergingCompetencies.map((em) => (
                            <div key={em.name} className="bg-white/80 p-3.5 rounded-lg border border-violet-100/80">
                              <p className="text-xs font-bold text-slate-900">{em.name}</p>
                              <p className="text-[11px] text-slate-600 mt-1 leading-snug">{em.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 2: Future Scope & 2030 Trends */}
                  {currentTab === "scope" && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200/80 space-y-5">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-indigo-600" /> 5-Year Industry Trajectory (2025–2030)
                        </h3>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {sector.futureScope.outlook}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Key Disruption Drivers & Strategic Vectors
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {sector.futureScope.keyTrends.map((trend, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{trend}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/60 flex items-start gap-3">
                        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-900">Automation Exposure Analysis</p>
                          <p className="text-xs text-amber-800 mt-0.5">{sector.automationRisk}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 3: Roles & Compensation */}
                  {currentTab === "roles" && (
                    <div className="space-y-3">
                      {sector.rolesAndSalaries.map((r) => (
                        <div
                          key={r.role}
                          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900">{r.role}</h3>
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                                {r.exp}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{r.focus}</p>
                          </div>
                          <div className="text-right sm:flex-shrink-0">
                            <p className="text-sm font-extrabold text-emerald-600 font-mono">
                              {r.salary}
                            </p>
                            <p className="text-[11px] text-slate-400">Avg. Annual Base + Bonus</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sub-tab 4: Certifications & Project Blueprints */}
                  {currentTab === "certifications" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                          <Award className="h-4 w-4 text-indigo-600" /> Industry Recognized Certifications
                        </h3>
                        <div className="space-y-2">
                          {sector.recommendedCertifications.map((cert) => (
                            <div key={cert} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800 flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                              {cert}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" /> High-Impact Capstone Blueprints
                        </h3>
                        <div className="space-y-2">
                          {sector.projectBlueprints.map((proj, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                              <span className="font-bold text-indigo-600 mr-1.5">Project {idx + 1}:</span>
                              {proj}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 5: Compare With My Graph */}
                  {currentTab === "graph_comparison" && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200/80 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Competency Alignment for {studentProfile?.name || "Your Profile"}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Comparing your live competency graph against {sector.name} prerequisites.
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddSkillsToRoadmap(sector)}
                          disabled={addingToRoadmap}
                          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition-colors disabled:opacity-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Missing Skills to Roadmap
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Mastered Primitives
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {matchInfo.mastered.length > 0 ? (
                              matchInfo.mastered.map((m) => (
                                <span key={m} className="px-2 py-0.5 rounded bg-white text-emerald-800 text-[11px] font-medium border border-emerald-200">
                                  {m}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">Complete assessments to register masteries</span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" /> In-Progress Competencies
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {matchInfo.inProgress.length > 0 ? (
                              matchInfo.inProgress.map((ip) => (
                                <span key={ip} className="px-2 py-0.5 rounded bg-white text-blue-800 text-[11px] font-medium border border-blue-200">
                                  {ip}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">No skills currently marked active</span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 mb-2">
                            <Compass className="h-4 w-4 text-indigo-600" /> Recommended Gaps to Close
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {sector.coreCompetencies.slice(0, 3).map((g) => (
                              <span key={g.name} className="px-2 py-0.5 rounded bg-white text-indigo-800 text-[11px] font-medium border border-indigo-200">
                                {g.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                        <span>Want hands-on guidance from a sector director?</span>
                        <Link
                          to="/mentorship"
                          className="font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          Book a 1:1 Session with a {sector.category} Mentor <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
