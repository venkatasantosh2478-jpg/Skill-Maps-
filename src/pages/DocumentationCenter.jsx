import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Layers, 
  Brain, 
  Map, 
  BookOpen, 
  Award, 
  Briefcase, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileCheck
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { generateSystemArchitecturePDF, generateStudentPortfolioAuditPDF } from "@/lib/projectDocsPdfGenerator";

const SIX_PILLARS = [
  {
    number: "01",
    id: "profiling",
    title: "Previous Learning Recognition & Skill Profiling",
    summary: "Analyzes previous learning, completed courses, projects, certifications, and diagnostic assessments to identify existing competencies and determine the appropriate learning starting point.",
    icon: Brain,
    features: [
      "Resume Text & PDF Upload Parsing (pdf-parse)",
      "10-Question Comprehensive Diagnostic Assessment",
      "Evidence-backed Competency Radar (6 Core Technical Axes)",
      "Manual Calibration & Override Controls"
    ],
    actionLink: "/skill-profiling",
    actionLabel: "Open Skill Profiler & Diagnostic Quiz"
  },
  {
    number: "02",
    id: "roadmap",
    title: "Personalized Learning Roadmap Generator",
    summary: "Generates adaptive learning plans with milestones, study schedules, prerequisite mapping, and career-oriented learning paths based on student goals and performance.",
    icon: Map,
    features: [
      "Multi-Phase Dynamic Roadmap Formulation (Gemini AI)",
      "Prerequisite Dependency Mapping (DAG)",
      "Fatigue-Aware Adaptive Timetable (Morning/Night Slots)",
      "Why Master This Skill Rationale & Capstone Projects"
    ],
    actionLink: "/roadmap",
    actionLabel: "Explore Career Roadmap"
  },
  {
    number: "03",
    id: "resources",
    title: "Intelligent Learning Resource Recommendation",
    summary: "Recommends personalized learning resources including books, videos, documentation, online courses, coding platforms, and practice materials based on competency level.",
    icon: BookOpen,
    features: [
      "3-Tier Competency Filtering (Beginner, Intermediate, Advanced)",
      "Video Lectures Vault with Timestamped Note-Taking",
      "8-Module Comprehensive Course Handbook & Multi-Page PDF",
      "AI Resource Fit Reasoner & ELI5 Concept Summaries"
    ],
    actionLink: "/resources",
    actionLabel: "View Recommended Resources"
  },
  {
    number: "04",
    id: "assessment",
    title: "Adaptive Assessment & Knowledge Validation",
    summary: "Generates AI-powered quizzes, coding challenges, and practical assignments that adapt to student performance while validating concept mastery.",
    icon: Award,
    features: [
      "Dynamic Item Response Theory (IRT) Adaptive Scaling (+/-0.15)",
      "Validate Your Understanding Milestone Quizzes",
      "Instant Delta Feedback Badges (e.g. +15% Level Gain)",
      "Automatic Central Competency Graph Synchronization"
    ],
    actionLink: "/assessment",
    actionLabel: "Launch Adaptive Assessment"
  },
  {
    number: "05",
    id: "resume",
    title: "Resume Intelligence & Skill Gap Analysis",
    summary: "Evaluates resumes for ATS readiness, identifies missing technical and soft skills, and recommends improvements, certifications, and projects.",
    icon: FileCheck,
    features: [
      "ATS Compatibility & Keyword Matching Index (0-100%)",
      "Hard & Soft Skill Gap Extraction vs. Target Roles",
      "Action-Verb Impact Analysis & Bullet Point Optimizer",
      "One-Click Standardized ATS Resume PDF Generator"
    ],
    actionLink: "/resume-check",
    actionLabel: "Analyze Resume for ATS"
  },
  {
    number: "06",
    id: "projects-certs",
    title: "AI Project & Certification Recommendation",
    summary: "Suggests industry-relevant projects, certifications, internships, hackathons, and extracurricular activities aligned with the student's target careers.",
    icon: Briefcase,
    features: [
      "Tier-1 Industry Certification Pathways (AWS, GCP, CKA, Meta)",
      "Production-Grade Portfolio Capstone Projects",
      "Real-World Hackathon & Freelance Project Directory",
      "AI Startup Idea Analyzer & Team Co-Founder Matcher"
    ],
    actionLink: "/opportunities",
    actionLabel: "Browse Projects & Certifications"
  }
];

export default function DocumentationCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [downloadingArch, setDownloadingArch] = useState(false);
  const [downloadingAudit, setDownloadingAudit] = useState(false);

  const handleDownloadArchPDF = () => {
    setDownloadingArch(true);
    try {
      generateSystemArchitecturePDF();
      toast({
        title: "System Architecture PDF Generated",
        description: "Your complete 4-page 6-Pillar technical specification PDF has been downloaded."
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Export Error",
        description: "Failed to generate architecture PDF.",
        variant: "destructive"
      });
    } finally {
      setDownloadingArch(false);
    }
  };

  const handleDownloadAuditPDF = () => {
    setDownloadingAudit(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("skillsmap_active_user") || "{}");
      generateStudentPortfolioAuditPDF(
        user?.name || storedUser?.name || "Student Learner",
        storedUser?.careerGoal || "Full Stack Software Engineer",
        storedUser?.competencyGraph || []
      );
      toast({
        title: "Portfolio Audit Dossier Generated",
        description: "Your personalized competency audit & certification recommendation dossier has been downloaded."
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Export Error",
        description: "Failed to generate portfolio audit PDF.",
        variant: "destructive"
      });
    } finally {
      setDownloadingAudit(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              OFFICIAL PLATFORM SPECIFICATION
            </span>
            <span className="text-xs text-slate-400">· 6 Foundational AI Learning Pillars</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-3">
            <Layers className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            Platform Documentation & Reports Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 max-w-3xl leading-relaxed">
            All six intelligent learning and assessment pillars are fully built and active. Generate and download formal PDF engineering specifications, personal audit dossiers, and architectural blueprints below.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadArchPDF}
            disabled={downloadingArch}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
          >
            <Download className="h-4 w-4" />
            <span>{downloadingArch ? "Generating PDF..." : "Export System Architecture (PDF)"}</span>
          </button>

          <button
            onClick={handleDownloadAuditPDF}
            disabled={downloadingAudit}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-2 border border-slate-700 cursor-pointer transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>{downloadingAudit ? "Generating..." : "Export Student Audit Dossier (PDF)"}</span>
          </button>
        </div>
      </div>

      {/* 6 Pillars Interactive Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            All 6 System Modules Status: Active & Operational
          </h2>
          <span className="text-xs font-semibold text-slate-400">100% Core Requirements Implemented</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIX_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={pillar.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-black text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 transition-colors">
                      {pillar.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {pillar.summary}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Technical Capabilities:
                    </p>
                    <ul className="space-y-1.5">
                      {pillar.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={pillar.actionLink}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{pillar.actionLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF Documentation Preview / Info Callout */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-400" />
              Need Full Documentation Artifacts for Review & Evaluation?
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              You can instantly download the comprehensive 4-page system architecture specification document or generate a customized student audit dossier containing real-time competency ratings across all 6 axes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadArchPDF}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Download System Docs (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
