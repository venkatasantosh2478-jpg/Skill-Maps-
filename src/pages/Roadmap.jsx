import React, { useEffect, useState } from "react";
import { getMyProfile, generateRoadmap, updateProfile, addActivity } from "@/lib/skillMap";
import { 
  Loader2, 
  Map, 
  Lock, 
  CheckCircle2, 
  Target, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  Zap,
  Download,
  FileText,
  BookOpen,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateSyllabusPDF } from "@/lib/syllabusPdfGenerator";
import { downloadPhaseNotesPDF, downloadPhaseNotesMarkdown, downloadAllCourseNotesPDF } from "@/lib/notesGenerator";
import PhaseQuizModal from "@/components/PhaseQuizModal";
import AdaptiveAssessmentModal from "@/components/AdaptiveAssessmentModal";

const CAREER_PRESETS = [
  "Full Stack Software Engineer",
  "AI / ML Solutions Engineer",
  "Cloud & DevOps Architect",
  "Frontend & UX Engineer",
  "Data Platform Engineer",
];

export default function Roadmap() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [goal, setGoal] = useState("");
  const [activeQuizPhase, setActiveQuizPhase] = useState(null);
  const [adaptiveAssessmentSkill, setAdaptiveAssessmentSkill] = useState(null);

  const load = async () => {
    const p = await getMyProfile();
    setProfile(p);
    setGoal(p?.careerGoal || "");
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const buildRoadmap = async (targetGoal) => {
    const goalToUse = targetGoal || goal;
    if (!goalToUse.trim() || !profile) return;
    setGenerating(true);
    const roadmap = await generateRoadmap(profile.competencyGraph, goalToUse);
    const newLog = addActivity(profile.activityLog, `Generated strategic roadmap for ${goalToUse}`, "", 0);
    const updated = await updateProfile(profile.id, { careerGoal: goalToUse, roadmap, activityLog: newLog });
    setProfile({ ...profile, ...updated });
    setGoal(goalToUse);
    setGenerating(false);
  };

  const toggleMilestone = async (idx) => {
    const milestones = [...(profile.roadmap?.milestones || [])];
    const current = milestones[idx];
    const wasComplete = current.status === "complete";
    milestones[idx] = { ...current, status: wasComplete ? "in_progress" : "complete" };
    // unlock next
    if (!wasComplete && idx + 1 < milestones.length && milestones[idx + 1].status === "locked") {
      milestones[idx + 1] = { ...milestones[idx + 1], status: "in_progress" };
    }
    const newLog = addActivity(profile.activityLog, `${wasComplete ? "Reopened" : "Completed"} milestone: ${current.skill}`, current.skill, wasComplete ? 0 : 0.1);
    const updated = await updateProfile(profile.id, { roadmap: { milestones }, activityLog: newLog });
    setProfile({ ...profile, ...updated });
  };

  const handlePhaseQuizCompleted = ({ updatedProfile, updatedMilestones }) => {
    setProfile(updatedProfile);
    setActiveQuizPhase(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm animate-pulse">
          <Sparkles className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-500">Loading your career roadmap...</p>
      </div>
    );
  }

  if (!profile) return <div className="p-8 text-slate-500">Complete onboarding first.</div>;

  const milestones = profile.roadmap?.milestones || [];
  const completedCount = milestones.filter((m) => m.status === "complete").length;
  const progressPct = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;
  const totalWeeks = milestones.reduce((sum, m) => sum + (m.durationWeeks || 2), 0);

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Zap className="h-3.5 w-3.5 text-indigo-600" />
              Dynamic Curriculum
            </span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">Personalized Career Roadmap</h1>
          <p className="text-slate-500 text-sm mt-1">
            Tailored step-by-step milestones synthesized by Gemini AI based on your current skill matrix.
          </p>
        </div>

        {milestones.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => generateSyllabusPDF(profile, milestones, goal)}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-indigo-700 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all"
              title="Download official PDF syllabus of this curriculum"
            >
              <FileText className="h-4 w-4 text-indigo-600" />
              <span>Download Syllabus (PDF)</span>
            </button>
            <button
              onClick={() => downloadAllCourseNotesPDF(milestones, profile, goal)}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all"
              title="Download combined study notes for all phases"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Download All Notes (PDF)</span>
            </button>
          </div>
        )}
      </div>

      {/* Real-time Learning Phase Progress Card */}
      {milestones.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-indigo-800/60 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
                  LEARNING PHASE PROGRESS
                </span>
                <span className="text-xs text-slate-300">· {totalWeeks} Weeks Total</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-white">
                {completedCount === milestones.length
                  ? "Curriculum Completed! 🎉"
                  : `${completedCount} of ${milestones.length} Phases Mastered`}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-300">Completion</p>
                <p className="font-heading text-2xl font-black text-indigo-300">{progressPct}%</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-indigo-700/40 mb-4">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-violet-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Current Focus Milestone quick jump */}
          {milestones.findIndex((m) => m.status === "in_progress") !== -1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>
                  Current Phase: <strong className="text-white">{milestones.find((m) => m.status === "in_progress")?.skill}</strong>
                </span>
              </div>
              <button
                onClick={() => {
                  const idx = milestones.findIndex((m) => m.status === "in_progress");
                  if (idx !== -1) {
                    setActiveQuizPhase({ milestone: milestones[idx], index: idx });
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors flex items-center gap-1.5"
              >
                <Award className="h-3.5 w-3.5" /> Take Current Phase Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Goal input Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Target Career Role</label>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buildRoadmap()}
            placeholder="e.g. Senior Full Stack Engineer, Cloud Architect, AI Engineer..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50"
          />
          <button
            onClick={() => buildRoadmap()}
            disabled={!goal.trim() || generating}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{milestones.length ? "Regenerate Roadmap" : "Synthesize Milestones"}</span>
              </>
            )}
          </button>
        </div>

        {/* Preset chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Popular Goals:</span>
          {CAREER_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setGoal(preset);
                buildRoadmap(preset);
              }}
              className="whitespace-nowrap text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {milestones.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Map className="h-8 w-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-800 mb-1">No Roadmap Generated Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Enter your target career goal above to synthesize a personalized learning sequence with week-by-week goals.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Milestone timeline */}
          <div className="relative pl-6 sm:pl-8">
            <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-300 to-slate-200 -ml-px" />
            
            <div className="space-y-6">
              {milestones.map((m, i) => {
                const isComplete = m.status === "complete";
                const isInProgress = m.status === "in_progress";
                const isLocked = m.status === "locked";

                return (
                  <div key={i} className="relative flex gap-4 sm:gap-6 group">
                    {/* Node icon */}
                    <div 
                      className={cn(
                        "relative z-10 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 shadow-sm",
                        isComplete 
                          ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                          : isInProgress 
                            ? "bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-indigo-600/30 animate-pulse" 
                            : "bg-white border-2 border-slate-200 text-slate-300"
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : isInProgress ? (
                        <Sparkles className="h-6 w-6 text-amber-300" />
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content Card */}
                    <div 
                      className={cn(
                        "flex-1 bg-white rounded-3xl border p-5 sm:p-6 transition-all duration-200 shadow-xs",
                        isInProgress ? "border-indigo-200 shadow-md ring-1 ring-indigo-100" : "border-slate-200/80 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Phase {i + 1}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                              <Clock className="h-3 w-3" /> {m.durationWeeks || 2} Weeks
                            </span>
                          </div>
                          <h3 className="font-heading text-lg font-bold text-slate-900">{m.skill}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span 
                            className={cn(
                              "text-xs font-bold px-3 py-1 rounded-full",
                              isComplete 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                : isInProgress 
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200" 
                                  : "bg-slate-100 text-slate-500"
                            )}
                          >
                            {isInProgress ? "In Progress" : isComplete ? "Completed" : "Locked"}
                          </span>
                        </div>
                      </div>

                      {/* Proficiency Progress Bar */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Proficiency Target:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{Math.round((m.currentLevel || 0) * 100)}%</span>
                          <span className="text-slate-400">→</span>
                          <span className="font-bold text-indigo-600">{Math.round((m.targetLevel || 0) * 100)}%</span>
                        </div>
                      </div>

                      {/* Sub-goals */}
                      {m.subGoals?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Objectives:</p>
                          <ul className="space-y-2">
                            {m.subGoals.map((g, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                                <Target className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                                <span>{g}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action trigger */}
                      {!isLocked && (
                        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2.5">
                            {/* Quiz completion trigger */}
                            <button
                              onClick={() => setActiveQuizPhase({ milestone: m, index: i })}
                              className={cn(
                                "text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-xs",
                                isComplete
                                  ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                              )}
                            >
                              <Award className="h-4 w-4" />
                              <span>{isComplete ? "Retake Phase Quiz" : "Take Phase Quiz to Complete"}</span>
                            </button>

                            <button
                              onClick={() => setAdaptiveAssessmentSkill({ skill: m.skill, level: m.currentLevel || 0.5 })}
                              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition-all flex items-center gap-2 shadow-xs"
                              title="Launch adaptive AI quiz to validate understanding"
                            >
                              <Sparkles className="h-4 w-4 text-violet-600" />
                              <span>Validate Your Understanding</span>
                            </button>

                            {/* Download Notes buttons */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => downloadPhaseNotesPDF(m, profile)}
                                className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
                                title="Download structured study notes in PDF"
                              >
                                <FileText className="h-3.5 w-3.5 text-indigo-600" />
                                <span>Study Notes (PDF)</span>
                              </button>
                              <button
                                onClick={() => downloadPhaseNotesMarkdown(m, profile)}
                                className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
                                title="Download Markdown (.md) notes"
                              >
                                <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                                <span>.md</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                            <button
                              onClick={() => toggleMilestone(i)}
                              className="text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
                            >
                              {isComplete ? "Mark as Incomplete" : "Manual override: mark complete"}
                            </button>
                            {isInProgress && (
                              <span className="text-indigo-600 font-semibold flex items-center gap-1">
                                Current Focus Area <ChevronRight className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Phase Quiz Modal */}
      {activeQuizPhase && (
        <PhaseQuizModal
          milestone={activeQuizPhase.milestone}
          phaseIndex={activeQuizPhase.index}
          profile={profile}
          allMilestones={milestones}
          onCompleted={handlePhaseQuizCompleted}
          onClose={() => setActiveQuizPhase(null)}
        />
      )}

      {/* Adaptive Assessment Modal (Module B) */}
      <AdaptiveAssessmentModal
        isOpen={!!adaptiveAssessmentSkill}
        onClose={() => { setAdaptiveAssessmentSkill(null); load(); }}
        skillTopic={adaptiveAssessmentSkill?.skill}
        initialDifficulty={adaptiveAssessmentSkill?.level || 0.5}
      />
    </div>
  );
}
