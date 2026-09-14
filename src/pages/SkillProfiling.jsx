import React, { useState } from "react";
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Award, 
  Brain, 
  ArrowRight,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import CompetencyRadar from "@/components/CompetencyRadar";

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    axis: "Backend",
    difficulty: "Easy",
    question: "What is the primary role of middleware in an Express.js server?",
    options: [
      "To execute functions between receiving a request and sending a response",
      "To directly compile TypeScript code into WebAssembly",
      "To manage CSS stylesheet preprocessors",
      "To replace the relational database management system"
    ],
    correctIndex: 0
  },
  {
    id: 2,
    axis: "Backend",
    difficulty: "Medium",
    question: "Which pattern best prevents cascading failures when calling an unstable external microservice?",
    options: [
      "Singleton pattern",
      "Circuit Breaker pattern",
      "Factory Method pattern",
      "Active Record pattern"
    ],
    correctIndex: 1
  },
  {
    id: 3,
    axis: "Frontend",
    difficulty: "Easy",
    question: "In React, why must you avoid mutating state directly in component bodies?",
    options: [
      "It makes CSS styling fail to render",
      "It prevents React from detecting changes and triggering re-renders",
      "It causes browser memory leaks automatically",
      "It violates JavaScript strict syntax rules"
    ],
    correctIndex: 1
  },
  {
    id: 4,
    axis: "Frontend",
    difficulty: "Medium",
    question: "What is the primary benefit of React Server Components (RSC)?",
    options: [
      "Running all UI logic entirely on client devices without network requests",
      "Zero bundle size impact on client and direct server-side data access",
      "Automatic conversion of class components to functional hooks",
      "Eliminating the need for CSS Tailwind styling"
    ],
    correctIndex: 1
  },
  {
    id: 5,
    axis: "Architecture",
    difficulty: "Medium",
    question: "What is the key architectural characteristic of Event-Driven Microservices?",
    options: [
      "Tight coupling via synchronous remote procedure calls",
      "Asynchronous message passing via brokers enabling loose coupling",
      "Shared in-memory state across all microservices",
      "Monolithic deployment on a single server instance"
    ],
    correctIndex: 1
  },
  {
    id: 6,
    axis: "Problem Solving",
    difficulty: "Easy",
    question: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    options: ["O(N)", "O(log N)", "O(N^2)", "O(1)"],
    correctIndex: 1
  },
  {
    id: 7,
    axis: "Problem Solving",
    difficulty: "Medium",
    question: "Which algorithmic paradigm is best suited for solving the 0/1 Knapsack problem with optimal substructure?",
    options: ["Greedy algorithm", "Dynamic Programming", "Brute Force search", "Depth-First Search without memoization"],
    correctIndex: 1
  },
  {
    id: 8,
    axis: "Database",
    difficulty: "Easy",
    question: "What does ACID stand for in relational database transactions?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Asynchronous, Collaborative, Indexed, Distributed",
      "Access Control, Integration, Design",
      "Application Cache Invalidation Directory"
    ],
    correctIndex: 0
  },
  {
    id: 9,
    axis: "Database",
    difficulty: "Medium",
    question: "When should you choose a NoSQL Document store over a Relational database?",
    options: [
      "When strict ACID multi-table transactions are strictly mandatory",
      "When working with highly flexible, schema-less evolving JSON documents at massive horizontal scale",
      "When you need complex multi-table SQL joins",
      "When financial ledger consistency is required"
    ],
    correctIndex: 1
  },
  {
    id: 10,
    axis: "DevOps",
    difficulty: "Medium",
    question: "What is the primary purpose of containerization with Docker in CI/CD pipelines?",
    options: [
      "To ensure consistent execution environments across dev, staging, and production",
      "To replace Git version control repositories",
      "To encrypt network traffic over HTTPS",
      "To automatically generate frontend UI components"
    ],
    correctIndex: 0
  }
];

export default function SkillProfiling() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1); // 1: Resume Upload, 2: Diagnostic Quiz, 3: Results & Radar
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [profileResults, setProfileResults] = useState(null);
  const [manualOverrides, setManualOverrides] = useState({});

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result;
        setResumeText(content || "Resume file uploaded: " + file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleSelectAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitProfiling = async () => {
    setAnalyzing(true);
    try {
      // Format quiz answers for Gemini API
      const quizSummary = DIAGNOSTIC_QUESTIONS.map((q) => {
        const studentAns = answers[q.id];
        const isCorrect = studentAns === q.correctIndex;
        return {
          axis: q.axis,
          question: q.question,
          correct: isCorrect,
          studentAnswer: studentAns !== undefined ? q.options[studentAns] : "Not answered"
        };
      });

      const res = await fetch("/api/ai/profile-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, quizAnswers: quizSummary })
      });
      const data = await res.json();
      const scores = data.competencyScores || [];

      // Format into graph format expected by app
      const competencyGraph = scores.map((item) => ({
        skill: item.axis,
        level: item.level,
        evidence: item.evidence
      }));

      setProfileResults(competencyGraph);

      // Save to Firestore / local user profile
      const storedUser = JSON.parse(localStorage.getItem("skillsmap_active_user") || "{}");
      if (storedUser && storedUser.id) {
        storedUser.competencyGraph = competencyGraph;
        localStorage.setItem("skillsmap_active_user", JSON.stringify(storedUser));
      }

      setStep(3);
      toast({
        title: "Skill Profiling Complete!",
        description: "Your objective competency scores have been successfully calculated and synchronized."
      });
    } catch (err) {
      console.error("Profiling error:", err);
      toast({
        title: "Profiling Error",
        description: "Could not generate profile scores. Using baseline estimation.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOverrideLevel = (axis, newLevel) => {
    setManualOverrides((prev) => ({ ...prev, [axis]: Number(newLevel) }));
    if (profileResults) {
      const updated = profileResults.map((item) => 
        item.skill === axis ? { ...item, level: Number(newLevel) } : item
      );
      setProfileResults(updated);
      const storedUser = JSON.parse(localStorage.getItem("skillsmap_active_user") || "{}");
      if (storedUser && storedUser.id) {
        storedUser.competencyGraph = updated;
        localStorage.setItem("skillsmap_active_user", JSON.stringify(storedUser));
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              MODULE A: OBJECTIVE SKILL PROFILING
            </span>
            <span className="text-xs text-slate-400">· Resume Analysis & Diagnostic Quiz</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2.5">
            <Brain className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            AI Technical Skill Profiler
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-3xl">
            Replace self-reported ratings with objective verification. Upload your resume and complete our 10-question diagnostic quiz to calibrate your true competency radar across 6 core technical axes.
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${step >= 1 ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800"}`}>
          <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
          <span>Upload Resume</span>
        </div>
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${step >= 2 ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800"}`}>
          <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
          <span>Diagnostic Quiz (10 Qs)</span>
        </div>
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${step >= 3 ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800"}`}>
          <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs">3</span>
          <span>Calibrated Radar Profile</span>
        </div>
      </div>

      {/* Step 1: Resume Upload */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 1: Upload Your Resume (PDF / TXT)</h2>
              <p className="text-xs text-slate-400">Our AI analyzer extracts projects, work experience, and technology stacks for evidence validation.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-500 transition-colors">
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-file-upload"
              />
              <label htmlFor="resume-file-upload" className="cursor-pointer space-y-3 flex flex-col items-center">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <FileText className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {fileName ? `Selected: ${fileName}` : "Click to upload resume or drag and drop"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF, TXT, or DOCX up to 15MB</p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Or Paste Resume Text Directly:
              </label>
              <textarea
                rows={5}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your professional experience, education, projects, and technologies here..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <span>Proceed to Diagnostic Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Diagnostic Quiz */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 2: 10-Question Diagnostic Assessment</h2>
              <p className="text-xs text-slate-400">Covers Backend, Frontend, Architecture, Problem Solving, Database, and DevOps axes.</p>
            </div>
          </div>

          <div className="space-y-6">
            {DIAGNOSTIC_QUESTIONS.map((q, idx) => {
              const selectedOpt = answers[q.id];
              return (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {q.axis} · {q.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Question {idx + 1} of 10</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {q.question}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                            isChosen
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Back to Resume
            </button>
            <button
              onClick={handleSubmitProfiling}
              disabled={analyzing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>{analyzing ? "AI Profiling & Analyzing..." : "Generate Calibrated Profile"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results & Calibrated Radar */}
      {step === 3 && profileResults && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Calibrated Competency Radar
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified by AI & Quiz
              </span>
            </div>

            <div className="h-80 w-full flex items-center justify-center">
              <CompetencyRadar graph={profileResults} height={320} />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Re-run Profiling
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Axis Level Breakdown & Evidence
            </h2>
            <div className="space-y-3">
              {profileResults.map((resItem) => (
                <div key={resItem.skill} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {resItem.skill}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-indigo-600 font-mono">
                        {Math.round(resItem.level * 100)}%
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={resItem.level}
                        onChange={(e) => handleOverrideLevel(resItem.skill, e.target.value)}
                        className="w-24 accent-indigo-600 cursor-pointer"
                        title="Manual override"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "{resItem.evidence}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
