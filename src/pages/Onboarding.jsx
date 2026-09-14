import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { skillsMap } from "@/api/skillsMapClient";
import { PRIMARY_TRACKS, SKILL_TRACKS, getQuizForTrack } from "@/lib/quizBank";
import { generateCompetencyGraph, createProfile } from "@/lib/skillMap";
import { Sparkles, Upload, Loader2, ArrowRight, ArrowLeft, Check, Edit3, Compass, Terminal, Layout, BarChart3, Shield, Cloud, Gamepad2, Coins, Smartphone } from "lucide-react";

const TRACK_ICONS = {
  "Software Engineering": Terminal,
  "Data Science": BarChart3,
  "Product Management": Compass,
  "UX Design": Layout,
  "Cybersecurity": Shield,
  "Cloud & DevOps": Cloud,
  "Game Development": Gamepad2,
  "Blockchain & Web3": Coins,
  "Mobile Development": Smartphone
};

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 track, 1 resume, 2 quiz, 3 generating
  const [track, setTrack] = useState("");
  const [isCustomTrack, setIsCustomTrack] = useState(false);
  const [customTrackInput, setCustomTrackInput] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [generating, setGenerating] = useState(false);

  // Active quiz list for current track (supports standard and custom tracks)
  const currentQuiz = getQuizForTrack(track || "Software Engineering");

  const handleSelectTrack = (selectedTrack) => {
    setTrack(selectedTrack);
    setIsCustomTrack(false);
    setStep(1);
  };

  const handleCustomTrackSubmit = (e) => {
    if (e) e.preventDefault();
    const finalTrack = customTrackInput.trim() || "Custom Technical Focus";
    setTrack(finalTrack);
    setIsCustomTrack(false);
    setStep(1);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      // Direct text reading for text files
      if (file.type?.includes("text") || file.name?.endsWith(".txt") || file.name?.endsWith(".md")) {
        const directText = await file.text();
        if (directText && directText.trim().length > 0) {
          setResumeText(directText.trim());
          setUploading(false);
          return;
        }
      }

      // Convert to base64 for PDFs / scanned images
      let base64Data = null;
      const mimeType = file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg");

      if (typeof FileReader !== "undefined") {
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        });

        if (typeof dataUrl === "string" && dataUrl.includes(",")) {
          base64Data = dataUrl.split(",")[1];
        }
      }

      const extracted = await skillsMap.integrations.Core.ExtractDataFromUploadedFile({
        base64Data,
        mimeType,
        fileName: file.name,
      });

      const text = extracted?.output?.resumeText || extracted?.output || "";
      if (typeof text === "string" && text.trim().length > 0) {
        setResumeText(text.trim());
      }
    } catch (e) {
      console.warn("Resume upload notice:", e);
    }
    setUploading(false);
  };

  const answerQuestion = (optionIdx) => {
    const q = currentQuiz[quizIdx];
    const newAnswers = [...answers];
    newAnswers[quizIdx] = { skill: q.skill, correct: optionIdx === q.correct, selected: optionIdx };
    setAnswers(newAnswers);
    if (quizIdx < currentQuiz.length - 1) {
      setQuizIdx(quizIdx + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers) => {
    setGenerating(true);
    const graph = await generateCompetencyGraph(resumeText, track, finalAnswers);
    await createProfile({
      name: user?.full_name || user?.email || "Student",
      email: user?.email || "",
      track,
      resumeText,
      competencyGraph: graph,
      careerGoal: track,
      roadmap: { milestones: [] },
      courseMode: { active: false, dayIndex: 0, streak: 0, lastCompletedDate: null, certificateEarned: false },
      activityLog: [{ date: new Date().toISOString(), action: "Completed skill profiling", skillAffected: "", delta: 0 }],
      missingSkills: [],
    });
    setGenerating(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">SkillMap</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["Track", "Resume", "Quiz"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= i ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {step > i ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${step >= i ? "text-slate-700" : "text-slate-400"}`}>{label}</span>
                {i < 2 && <div className={`h-0.5 w-8 ${step > i ? "bg-indigo-600" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-bold text-slate-900">Choose your learning track</h2>
                <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-semibold">
                  4 Core Themes & Custom
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Select one of the 4 flagship specializations or customize your own domain.
              </p>

              {/* 4 Core Themes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                {PRIMARY_TRACKS.map((t) => {
                  const Icon = TRACK_ICONS[t] || Terminal;
                  const skillCount = SKILL_TRACKS[t]?.length || 10;
                  return (
                    <button
                      key={t}
                      onClick={() => handleSelectTrack(t)}
                      className="text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group flex items-start gap-3.5 shadow-xs"
                    >
                      <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-700 text-sm">{t}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{skillCount} Core Competencies</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Other / Custom Option */}
              <div className="border-t border-slate-100 pt-4">
                {!isCustomTrack ? (
                  <button
                    onClick={() => setIsCustomTrack(true)}
                    className="w-full text-left p-4 rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/60 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Edit3 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-700 text-sm">
                          Other (Type Custom Track)
                        </p>
                        <p className="text-xs text-slate-500">
                          Cybersecurity, Cloud & DevOps, Game Dev, Blockchain, Mobile, AI Agents, etc.
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <div className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/40 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                        Enter Custom Career Track or Domain
                      </label>
                      <button
                        onClick={() => setIsCustomTrack(false)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                    <input
                      type="text"
                      autoFocus
                      value={customTrackInput}
                      onChange={(e) => setCustomTrackInput(e.target.value)}
                      placeholder="e.g. Cybersecurity, Cloud & DevOps, Game Dev, Quantum Computing..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* Quick suggestion tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-500">Suggestions:</span>
                      {["Cybersecurity", "Cloud & DevOps", "Game Development", "Blockchain & Web3", "Mobile Development"].map((sugg) => (
                        <button
                          key={sugg}
                          type="button"
                          onClick={() => setCustomTrackInput(sugg)}
                          className="px-2 py-0.5 rounded-lg text-[11px] bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCustomTrackSubmit}
                        disabled={!customTrackInput.trim()}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                      >
                        <span>Confirm & Continue</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-bold text-slate-900">Add your resume</h2>
                <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold">
                  Track: {track}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6">Upload a PDF or image (OCR), or paste text. Optional but improves accuracy.</p>
              <label className="block border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors mb-4">
                <input type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                {uploading ? (
                  <Loader2 className="h-8 w-8 mx-auto text-indigo-500 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 mx-auto text-slate-400" />
                )}
                <p className="text-sm font-medium text-slate-700 mt-2">{uploading ? "Extracting text..." : "Click to upload PDF or image"}</p>
                <p className="text-xs text-slate-400">OCR handles scanned resumes</p>
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="...or paste your resume text here (e.g. your education, projects, skills, and tools)"
                rows={5}
                className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-2"
              />

              {/* Sample presets */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="text-xs text-slate-400">Quick load:</span>
                <button
                  type="button"
                  onClick={() => setResumeText("Education: Computer Science & Software Engineering\nSkills: JavaScript, React, Node.js, Git, SQL, Docker, REST APIs, System Design\nExperience: Built full-stack web applications and microservices.")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-xs transition-colors"
                >
                  💻 Software Sample
                </button>
                <button
                  type="button"
                  onClick={() => setResumeText("Education: Information Systems & Cybersecurity\nSkills: Network Security, Cryptography, OWASP, Linux, Python, Docker, Pen Testing\nExperience: Configured firewalls and conducted vulnerability assessments.")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-xs transition-colors"
                >
                  🛡️ Security / DevOps Sample
                </button>
                {resumeText && (
                  <button
                    type="button"
                    onClick={() => setResumeText("")}
                    className="px-2 py-1 rounded-lg text-rose-500 hover:bg-rose-50 text-xs transition-colors ml-auto"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button onClick={() => setStep(0)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
                  <ArrowLeft className="h-4 w-4" /> Back to Tracks
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-700 underline"
                  >
                    Skip to Dashboard
                  </button>
                  <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                    Continue to Quiz <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && !generating && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Diagnostic Quiz</h2>
              <p className="text-slate-500 mb-6">
                Question {quizIdx + 1} of {currentQuiz.length} — <span className="font-semibold text-indigo-600">{track}</span>
              </p>
              <div className="h-1.5 bg-slate-100 rounded-full mb-6">
                <div className="h-1.5 bg-indigo-600 rounded-full transition-all" style={{ width: `${((quizIdx + 1) / currentQuiz.length) * 100}%` }} />
              </div>
              <div className="mb-6">
                <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-3">
                  Skill Focus: {currentQuiz[quizIdx]?.skill}
                </span>
                <p className="text-lg font-medium text-slate-900">{currentQuiz[quizIdx]?.q}</p>
              </div>
              <div className="space-y-2.5">
                {currentQuiz[quizIdx]?.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => answerQuestion(i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-medium ${answers[quizIdx]?.selected === i ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                {quizIdx > 0 ? (
                  <button onClick={() => setQuizIdx(quizIdx - 1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
                    <ArrowLeft className="h-4 w-4" /> Previous question
                  </button>
                ) : (
                  <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
                    <ArrowLeft className="h-4 w-4" /> Back to resume
                  </button>
                )}
                {quizIdx > 0 && (
                  <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600">
                    Back to resume
                  </button>
                )}
              </div>
            </div>
          )}

          {generating && (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 mx-auto text-indigo-500 animate-spin mb-4" />
              <h2 className="text-lg font-semibold text-slate-900">Building your competency graph</h2>
              <p className="text-sm text-slate-500 mt-1">AI is analyzing your resume and quiz results for {track}...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
