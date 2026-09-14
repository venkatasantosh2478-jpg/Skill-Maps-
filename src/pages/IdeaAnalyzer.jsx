import React, { useState, useEffect } from "react";
import { 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Globe, 
  UserCheck, 
  Send, 
  Check, 
  X, 
  Download,
  Copy,
  FileCode,
  Phone,
  MessageCircle,
  Trash2,
  CheckCheck
} from "lucide-react";
import { 
  getPeerTalentList, 
  getTeamInvitations, 
  sendTeamInvitations, 
  respondToTeamInvitation,
  cancelTeamInvitation,
  approveAllTeamInvitations,
  saveStoredIdeaAnalysis
} from "@/lib/dataStore";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

const PRESET_IDEAS = [
  {
    name: "Agentic Code Health & Anti-Pattern Sentinel",
    sector: "Developer Tools & AI",
    website: "https://code-sentinel-ai.dev",
    description: "An automated autonomous agent that analyzes GitHub pull requests in real time, detecting architectural anti-patterns, memory leaks, and recommending refactors with synthetic test harnesses before merging."
  },
  {
    name: "OmniHealth Decentralized Patient Records",
    sector: "HealthTech & Privacy",
    website: "https://omnihealth-vault.io",
    description: "Zero-knowledge encrypted health vault empowering patients to selectively grant hospitals and specialists temporary cryptographic access to radiology scans and lab records."
  },
  {
    name: "EcoFleet Dynamic EV Fleet Routing",
    sector: "ClimateTech & Logistics",
    website: "https://ecofleet-routes.co",
    description: "Smart logistics dispatch system optimizing multi-stop commercial electric van fleets using real-time dynamic grid electricity spot rates and battery degradation curves."
  }
];

export default function IdeaAnalyzer() {
  const [ideaName, setIdeaName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sector, setSector] = useState("Developer Tools & AI");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("Engineers, Startup Founders, and DevOps Teams");
  
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [promptCopied, setPromptCopied] = useState(false);
  
  // Peer talent available for team assembly
  const [availablePeers, setAvailablePeers] = useState([]);
  const [selectedPeerIds, setSelectedPeerIds] = useState([]);
  const [invitationNote, setInvitationNote] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState("");

  useEffect(() => {
    loadPeersAndInvites();
  }, []);

  const loadPeersAndInvites = () => {
    // Only members who marked "willingToJoinTeam: true" are available in idea analyzer!
    const allTalent = getPeerTalentList();
    const willingOnly = allTalent.filter((p) => p.willingToJoinTeam);
    setAvailablePeers(willingOnly);
    setInvitations(getTeamInvitations());
  };

  const handleApplyPreset = (preset) => {
    setIdeaName(preset.name);
    setWebsiteUrl(preset.website);
    setSector(preset.sector);
    setDescription(preset.description);
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!ideaName.trim() || !description.trim()) return;

    setAnalyzing(true);
    setAnalysis(null);
    setInviteSuccessMsg("");

    try {
      const res = await fetch("/api/ai/analyze-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaName,
          websiteUrl,
          sector,
          description,
          targetAudience,
        }),
      });

      const data = await res.json();
      setAnalysis(data);
      saveStoredIdeaAnalysis({
        ideaName,
        websiteUrl,
        sector,
        description,
        analysis: data
      });
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const togglePeerSelection = (peerId) => {
    setSelectedPeerIds((prev) =>
      prev.includes(peerId) ? prev.filter((id) => id !== peerId) : [...prev, peerId]
    );
  };

  const handleSendTeamInvites = () => {
    if (selectedPeerIds.length === 0) return;

    sendTeamInvitations({
      ideaTitle: ideaName || "Project Collaboration",
      senderName: "Alex Chen",
      senderEmail: "alex.chen@university.edu",
      candidateIds: selectedPeerIds,
      note: invitationNote || `We analyzed our idea "${ideaName}" and found your skills to be a great match for our team!`,
    });

    setInviteSuccessMsg(`Invitations sent directly to ${selectedPeerIds.length} candidate(s)! Notifications and phone contacts dispatched.`);
    setSelectedPeerIds([]);
    setInvitationNote("");
    setInvitations(getTeamInvitations());

    setTimeout(() => setInviteSuccessMsg(""), 6000);
  };

  const handleInvitationAction = (inviteId, newStatus) => {
    respondToTeamInvitation(inviteId, newStatus);
    setInvitations(getTeamInvitations());
  };

  const handleCancelInvite = (inviteId) => {
    cancelTeamInvitation(inviteId);
    setInvitations(getTeamInvitations());
    setInviteSuccessMsg("Team invitation was successfully withdrawn.");
    setTimeout(() => setInviteSuccessMsg(""), 4000);
  };

  const handleApproveAllInvites = () => {
    approveAllTeamInvitations();
    setInvitations(getTeamInvitations());
    setInviteSuccessMsg("All pending candidate invitations have been approved!");
    setTimeout(() => setInviteSuccessMsg(""), 5000);
  };

  const generateFullPromptText = () => {
    return `### SYSTEM ARCHITECTURE & FULL IMPLEMENTATION PROMPT ###

PROJECT TITLE: ${ideaName || "Autonomous Venture"}
TARGET SECTOR: ${sector}
PRIMARY AUDIENCE: ${targetAudience}
${websiteUrl ? `REFERENCE REPO/SITE: ${websiteUrl}` : ""}

EXECUTIVE PROBLEM & VALUE PROPOSITION:
${description}

VIABILITY & SCORE APPRAISAL:
${analysis?.viabilityScore ? `${analysis.viabilityScore}/100 — ${analysis.verdict}` : "High-Impact Production Candidate"}

EXECUTIVE SUMMARY:
${analysis?.summary || "Comprehensive intelligent system tailored for high scale and intuitive workflows."}

RECOMMENDED TECH STACK & SYSTEM ARCHITECTURE:
- Frontend: React 18, Vite, Tailwind CSS, Motion animations, Lucide icons
- Backend & AI: Node.js / Express or FastAPI, Google Gemini API with fallback handlers
- Storage & State: Firestore / Cloud SQL, resilient client-side caching
- Deployment: Docker containerized Cloud Run with strict environment isolation

KEY MVP MODULES & USER STORIES:
1. User Authentication & Profile Role Discovery
2. Core Interactive Engine with Real-Time Computation
3. AI Recommendation & Intelligent Synthesis Pipeline
4. Team Assembly, Direct Phone / WhatsApp Coordination Hub
5. Export & Comprehensive Reporting Suite (PDF / JSON)

RISK MITIGATION & SECURITY DIRECTIVES:
- Enforce strict server-side API proxying for all LLM and third-party secrets.
- Enforce zero unauthenticated access to personal candidate contact phone numbers.
- Provide graceful offline recovery states when API keys are unconfigured.`;
  };

  const handleCopyFullPrompt = () => {
    const text = generateFullPromptText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 3000);
    }
  };

  const handleDownloadAnalysisPDF = () => {
    if (!analysis) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = 210;
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Header Banner
    doc.setFillColor(30, 27, 75); // Dark Indigo
    doc.roundedRect(margin, y, contentWidth, 32, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("IDEA VIABILITY & VENTURE FEASIBILITY REPORT", margin + 6, y + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(199, 210, 254);
    doc.text(`Project: ${ideaName || "Innovation"}  ·  Sector: ${sector}`, margin + 6, y + 20);

    doc.setFontSize(8);
    doc.setTextColor(224, 231, 255);
    doc.text(`Viability Score: ${analysis.viabilityScore}/100  ·  ${analysis.verdict}`, margin + 6, y + 26);

    y += 38;

    // Summary
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text("EXECUTIVE APPRAISAL:", margin + 5, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const sumLines = doc.splitTextToSize(analysis.summary || "", contentWidth - 10);
    doc.text(sumLines, margin + 5, y + 12);

    y += 30;

    // Pros
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(16, 185, 129);
    doc.text("KEY PROS & STRATEGIC ADVANTAGES:", margin, y);
    y += 6;

    analysis.pros?.forEach((pro) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`+ ${pro.title}:`, margin + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const text = doc.splitTextToSize(pro.description, contentWidth - 8);
      doc.text(text, margin + 4, y + 4.5);
      y += text.length * 4.5 + 4;
    });

    // Cons
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(239, 68, 68);
    doc.text("KEY RISKS & BOTTLENECK MITIGATIONS:", margin, y);
    y += 6;

    analysis.cons?.forEach((con) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`! [${con.impact} Risk] ${con.risk}:`, margin + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const text = doc.splitTextToSize(`Mitigation: ${con.mitigation}`, contentWidth - 8);
      doc.text(text, margin + 4, y + 4.5);
      y += text.length * 4.5 + 4;
    });

    // Budget
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(79, 70, 229);
    doc.text(`ESTIMATED BUDGET: ${analysis.budgetEstimation?.totalEstimatedRange || "MVP Runway"}`, margin, y);
    y += 6;

    doc.save(`${(ideaName || "Idea").replace(/\s+/g, "-")}-Analysis-Report.pdf`);
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-10 font-body">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-xs">
              <Lightbulb className="h-6 w-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
              Startup & Project Idea Analyzer
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep multi-dimensional venture feasibility analysis, full AI architecture prompts, budget estimation, and peer talent matching.
          </p>
        </div>

        {analysis && (
          <button
            onClick={handleDownloadAnalysisPDF}
            className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            <Download className="h-4 w-4 text-amber-400" />
            <span>Download Analysis PDF</span>
          </button>
        )}
      </div>

      {/* Input Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Preset quick buttons */}
        <div className="flex items-center gap-2 flex-wrap pb-4 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Example Ideas:</span>
          {PRESET_IDEAS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Idea / Startup Name
              </label>
              <input
                type="text"
                required
                value={ideaName}
                onChange={(e) => setIdeaName(e.target.value)}
                placeholder="e.g. Agentic Code Sentinel, OmniHealth"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Industry Sector
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              >
                <option>Developer Tools & AI</option>
                <option>HealthTech & Biotech</option>
                <option>FinTech & Payments</option>
                <option>EdTech & Upskilling</option>
                <option>ClimateTech & Clean Energy</option>
                <option>Cybersecurity & Privacy</option>
                <option>E-Commerce & Retail AI</option>
                <option>Web3 & Smart Contracts</option>
                <option>Enterprise SaaS & Workflow Automation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Target User / Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. University Researchers, Small Business Owners, DevOps"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Reference Website or GitHub (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://myproject.com or https://github.com/repo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Description & Problem Statement
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the core problem, who suffers from it, how your proposed solution fixes it, and what unique technologies/agents will be utilized..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">
              Evaluates viability, tech stack, financial runway, and recommended hiring profiles.
            </p>
            <button
              type="submit"
              disabled={analyzing || !ideaName.trim() || !description.trim()}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              {analyzing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-amber-300" />
                  <span>Evaluating Venture Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Analyze Idea & Generate Full AI Prompt</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* FULL PROMPT ABOUT IDEA GENERATOR SECTION */}
      {(ideaName.trim().length > 0 || analysis) && (
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <FileCode className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  Full AI Architecture & Implementation Prompt
                </h3>
                <p className="text-xs text-slate-400">
                  Ready-to-use comprehensive prompt for AI coding agents, Gemini, or developer sprints.
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyFullPrompt}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              {promptCopied ? (
                <>
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Full Prompt</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800/80 font-mono text-xs text-slate-300 space-y-3 max-h-72 overflow-y-auto leading-relaxed">
            <pre className="whitespace-pre-wrap font-sans text-xs">
              {generateFullPromptText()}
            </pre>
          </div>
        </div>
      )}

      {/* ANALYSIS RESULTS DASHBOARD */}
      {analysis && (
        <div className="space-y-8 animate-in fade-in">
          {/* Executive Summary & Score Banner */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/50 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  {analysis.verdict}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-heading mt-2">
                  {ideaName}
                </h2>
                <p className="text-xs text-indigo-200 mt-1">
                  Sector: <strong>{sector}</strong> · Market Feasibility Appraisal
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-xs border border-white/10">
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-400 font-heading">
                    {analysis.viabilityScore}<span className="text-lg text-white/60">/100</span>
                  </div>
                  <div className="text-3xs uppercase tracking-widest text-indigo-200 font-bold mt-0.5">
                    Viability Index
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
                Executive Synthesis
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {analysis.summary}
              </p>
            </div>
          </div>

          {/* Pros and Cons Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200/80 dark:border-emerald-900/40 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base font-heading">
                <CheckCircle2 className="h-5 w-5" />
                <span>Strategic Advantages & Pros ({analysis.pros?.length || 0})</span>
              </div>

              <div className="space-y-3.5">
                {analysis.pros?.map((pro, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{pro.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{pro.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons & Risk Mitigation */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-rose-900/40 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base font-heading">
                <AlertTriangle className="h-5 w-5" />
                <span>Identified Bottlenecks & Mitigations ({analysis.cons?.length || 0})</span>
              </div>

              <div className="space-y-3.5">
                {analysis.cons?.map((con, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{con.risk}</h4>
                      <span className="text-3xs font-black uppercase px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200">
                        {con.impact} Risk
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-0.5">
                      <strong className="text-slate-800 dark:text-slate-200">Mitigation:</strong> {con.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Estimation Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg font-heading">
                <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>MVP Financial Runway & Budget Allocation</span>
              </div>
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
                Estimated Total: {analysis.budgetEstimation?.totalEstimatedRange || "$3,000 - $8,000"}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-2xs uppercase tracking-wider font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-4 rounded-l-xl">Expense Category</th>
                    <th className="py-2.5 px-4">Estimated Cost</th>
                    <th className="py-2.5 px-4 rounded-r-xl">Specific Allocation Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {analysis.budgetEstimation?.breakdown?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.cost}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {item.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Required Team Members & Headcount */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg font-heading">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span>Recommended Team Member Roles & Skill Profiles</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.requiredTeam?.map((role, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{role.role}</h4>
                    <span className="text-2xs font-black px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                      {role.headcount} Member
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {role.responsibilities}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {role.skills?.map((sk, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-3xs font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PEER TALENT RECRUITMENT & DIRECT PHONE COORDINATION */}
          <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-3xl border-2 border-indigo-500/30 p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
                    <UserCheck className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                    Assemble Your Team from Available Peers
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Only students who marked <strong>"I am willing to be a part of another team"</strong> in their profile are available here. Invitations and notifications are sent directly to their phone numbers for team coordination.
                </p>
              </div>

              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
                {selectedPeerIds.length} Candidate(s) Selected
              </div>
            </div>

            {inviteSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{inviteSuccessMsg}</span>
              </div>
            )}

            {/* Peer Cards with Tick-mark Checkboxes and Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePeers.map((peer) => {
                const isSelected = selectedPeerIds.includes(peer.id);
                const rawPhone = (peer.phone || "+15550192834").replace(/[^0-9]/g, "");

                return (
                  <div
                    key={peer.id}
                    onClick={() => togglePeerSelection(peer.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer relative select-none flex flex-col justify-between gap-3",
                      isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    )}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                            {peer.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white">{peer.name}</h4>
                            <p className="text-3xs text-slate-400">{peer.institution}</p>
                          </div>
                        </div>

                        {/* Tick Mark Checkbox */}
                        <div className={cn(
                          "h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
                          isSelected 
                            ? "bg-indigo-600 border-indigo-600 text-white" 
                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        )}>
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </div>

                      <p className="text-2xs font-semibold text-indigo-600 dark:text-indigo-400 mt-2">
                        {peer.roleTitle}
                      </p>

                      {/* Direct Phone & WhatsApp Integration */}
                      <div className="flex items-center gap-2 mt-1.5 text-3xs font-mono text-slate-600 dark:text-slate-300" onClick={(e) => e.stopPropagation()}>
                        <a 
                          href={`tel:${peer.phone || "+15550192834"}`} 
                          className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <Phone className="h-2.5 w-2.5" />
                          {peer.phone || "+1 (555) 019-2834"}
                        </a>
                        <a 
                          href={`https://wa.me/${rawPhone}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="h-2.5 w-2.5" /> WhatsApp
                        </a>
                      </div>

                      <p className="text-3xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                        {peer.bio}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {peer.knowledgeSkills?.slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-3xs font-medium">
                            {sk}
                          </span>
                        ))}
                        {peer.knowledgeSkills?.length > 3 && (
                          <span className="text-3xs text-slate-400 font-medium">
                            +{peer.knowledgeSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-3xs text-slate-400">
                      <span>{peer.hoursPerWeek}h / week</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Contact: {peer.contactPreference}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Invitation Note & Dispatch */}
            {selectedPeerIds.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Custom Invitation Message & Opportunity Pitch
                </label>
                <input
                  type="text"
                  value={invitationNote}
                  onChange={(e) => setInvitationNote(e.target.value)}
                  placeholder={`Hey! We are building "${ideaName}" and would love to collaborate with you. Let's connect!`}
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSendTeamInvites}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Invitations to {selectedPeerIds.length} Candidate(s)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Invitations Tracker & Approval / Rejection Management */}
            {invitations.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Opportunity Invitations & Responses ({invitations.length})
                  </h4>

                  {invitations.some(inv => inv.status === "pending") && (
                    <button
                      onClick={handleApproveAllInvites}
                      className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      <span>Approve All</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {invitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {inv.recipientName}
                          </span>
                          <span className="text-2xs text-slate-400 font-mono">
                            {inv.recipientEmail}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-3xs font-black uppercase",
                            inv.status === "approved" 
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : inv.status === "rejected"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          )}>
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1">
                          Project: <strong>{inv.ideaTitle}</strong> · Sent: {new Date(inv.sentAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {inv.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleInvitationAction(inv.id, "approved")}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs flex items-center gap-1 transition-colors"
                            >
                              <Check className="h-3 w-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleInvitationAction(inv.id, "rejected")}
                              className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-2xs flex items-center gap-1 transition-colors"
                            >
                              <X className="h-3 w-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleCancelInvite(inv.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Cancel Invitation"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
