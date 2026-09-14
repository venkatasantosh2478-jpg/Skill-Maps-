import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  FileText,
  Loader2,
  Sparkles,
  Download
} from "lucide-react";
import { generateAdaptiveQuestion, bumpSkill, addActivity, updateProfile } from "@/lib/skillMap";
import { QUIZ_BANK } from "@/lib/quizBank";
import { downloadPhaseNotesPDF, downloadPhaseNotesMarkdown } from "@/lib/notesGenerator";
import { useToast } from "@/components/ui/use-toast";

export default function PhaseQuizModal({
  milestone,
  phaseIndex,
  profile,
  allMilestones,
  onCompleted,
  onClose
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); // [{ questionIdx, selected, correct: boolean }]
  const [quizFinished, setQuizFinished] = useState(false);
  const [updatingRoadmap, setUpdatingRoadmap] = useState(false);
  const { toast } = useToast();

  const skill = milestone?.skill || "Skill";

  // Build 3 questions for this skill
  useEffect(() => {
    let isMounted = true;

    async function loadQuestions() {
      setLoading(true);
      try {
        // Look up static bank questions that might match
        const staticMatches = [];
        Object.values(QUIZ_BANK).forEach((trackList) => {
          trackList.forEach((qItem) => {
            if (qItem.skill.toLowerCase() === skill.toLowerCase()) {
              staticMatches.push({
                question: qItem.q,
                options: qItem.options,
                correctIndex: qItem.correct,
                explanation: `Correct understanding of ${skill} fundamentals.`
              });
            }
          });
        });

        const generatedQuestions = [...staticMatches];

        // If we need more questions up to 3, fetch adaptive questions
        while (generatedQuestions.length < 3) {
          const diff = generatedQuestions.length === 0 ? 0.35 : generatedQuestions.length === 1 ? 0.6 : 0.8;
          const q = await generateAdaptiveQuestion(skill, diff, null);
          generatedQuestions.push(q);
        }

        if (isMounted) {
          setQuestions(generatedQuestions.slice(0, 3));
          setLoading(false);
        }
      } catch (err) {
        console.warn("Quiz load notice:", err);
        // Fallback default questions
        if (isMounted) {
          setQuestions([
            {
              question: `In production ${skill}, what is the primary architectural best practice?`,
              options: [
                "Modular decomposition and clear error boundaries",
                "Hardcoding configuration inside controllers",
                "Disabling validation to improve network speed",
                "Coupling all logic directly to UI rendering"
              ],
              correctIndex: 0,
              explanation: "Modular decomposition ensures maintainability, isolation, and resilience."
            },
            {
              question: `How do you measure operational performance and reliability for ${skill}?`,
              options: [
                "Only checking if the server boots up",
                "Monitoring throughput, p99 latency, and structured telemetry logs",
                "Relying solely on user complaints in production",
                "Ignoring memory consumption"
              ],
              correctIndex: 1,
              explanation: "Continuous telemetry and latency tracking are critical for production systems."
            },
            {
              question: `What is the standard procedure when a critical failure or bug occurs in ${skill}?`,
              options: [
                "Immediately delete git history",
                "Revert to previous stable release and inspect error traces",
                "Turn off automated alerts",
                "Ignore until the next quarter"
              ],
              correctIndex: 1,
              explanation: "Fast rollback and post-mortem analysis minimize service downtime."
            }
          ]);
          setLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, [skill]);

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const currentQ = questions[currentQIndex];
    const isCorrect = idx === currentQ.correctIndex;

    const newAnswers = [
      ...userAnswers,
      {
        questionIdx: currentQIndex,
        selected: idx,
        isCorrect
      }
    ];
    setUserAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz completed!
      const correctCount = userAnswers.filter((a) => a.isCorrect).length;
      const passed = correctCount >= 2; // 2 out of 3 to pass

      if (passed) {
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        // Update Roadmap and Competency
        setUpdatingRoadmap(true);
        await handleSaveCompletion();
        setUpdatingRoadmap(false);
      }

      setQuizFinished(true);
    }
  };

  const handleSaveCompletion = async () => {
    if (!profile || !allMilestones) return;

    // 1. Update milestones
    const updatedMilestones = allMilestones.map((m, idx) => {
      if (idx === phaseIndex) {
        return { ...m, status: "complete" };
      }
      // Unlock subsequent phase if locked
      if (idx === phaseIndex + 1 && m.status === "locked") {
        return { ...m, status: "in_progress" };
      }
      return m;
    });

    // 2. Bump skill competency
    const newGraph = bumpSkill(profile.competencyGraph, skill, 0.10);

    // 3. Add Activity log
    const newLog = addActivity(
      profile.activityLog,
      `Passed Phase ${phaseIndex + 1} Quiz & Completed Milestone: ${skill}`,
      skill,
      0.10
    );

    // 4. Update Course Mode progress if active
    let updatedCourseMode = profile.courseMode;
    if (profile.courseMode?.active) {
      updatedCourseMode = {
        ...profile.courseMode,
        streak: (profile.courseMode.streak || 0) + 1,
        lastCompletedDate: new Date().toISOString()
      };
    }

    try {
      const updated = await updateProfile(profile.id, {
        roadmap: { milestones: updatedMilestones },
        competencyGraph: newGraph,
        activityLog: newLog,
        courseMode: updatedCourseMode
      });

      toast({
        title: `Phase ${phaseIndex + 1} Completed! 🎉`,
        description: `Your roadmap and ${skill} competency score have been updated.`
      });

      if (onCompleted) {
        onCompleted({
          updatedProfile: { ...profile, ...updated },
          updatedMilestones
        });
      }
    } catch (err) {
      console.warn("Failed to persist milestone update:", err);
    }
  };

  const handleRetake = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setUserAnswers([]);
    setQuizFinished(false);
  };

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const passed = correctCount >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              {phaseIndex + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  PHASE EVALUATION QUIZ
                </span>
                <span className="text-xs text-slate-400">· 3 Questions</span>
              </div>
              <h2 className="font-heading text-lg font-bold text-slate-900 leading-snug">
                {skill} Competency Assessment
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="h-9 w-9 text-indigo-600 animate-spin mx-auto" />
              <p className="font-semibold text-slate-700">Generating phase evaluation questions...</p>
              <p className="text-xs text-slate-400">Calibrating adaptive assessment for {skill}</p>
            </div>
          ) : !quizFinished ? (
            <div>
              {/* Question progress tracker */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>Question {currentQIndex + 1} of {questions.length}</span>
                  <span className="text-indigo-600">Passing score: 2 of 3 correct</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300"
                    style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="mb-5">
                <h3 className="font-heading text-base font-bold text-slate-900 leading-relaxed">
                  {questions[currentQIndex]?.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-5">
                {questions[currentQIndex]?.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === questions[currentQIndex].correctIndex;

                  let btnClass = "border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-700";
                  if (isAnswered) {
                    if (isCorrect) {
                      btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                    } else if (isSelected && !isCorrect) {
                      btnClass = "border-rose-400 bg-rose-50 text-rose-900";
                    } else {
                      btnClass = "border-slate-200 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all text-sm flex items-start gap-3 ${btnClass}`}
                    >
                      <span className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isAnswered && isCorrect 
                          ? "bg-emerald-600 text-white" 
                          : isAnswered && isSelected && !isCorrect 
                            ? "bg-rose-600 text-white" 
                            : "bg-slate-100 text-slate-600"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 leading-snug pt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {isAnswered && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedOption === questions[currentQIndex].correctIndex ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Correct!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700">
                        <AlertCircle className="h-4 w-4 text-rose-600" /> Incorrect
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {questions[currentQIndex].explanation}
                  </p>
                </div>
              )}

              {/* Footer action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => downloadPhaseNotesPDF(milestone, profile)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Download Study Notes
                </button>
                <button
                  disabled={!isAnswered}
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                >
                  {currentQIndex < questions.length - 1 ? (
                    <>Next Question <ArrowRight className="h-4 w-4" /></>
                  ) : (
                    <>Submit Quiz <CheckCircle2 className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="py-6 text-center space-y-5">
              <div className={`h-16 w-16 rounded-3xl mx-auto flex items-center justify-center ${
                passed ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              }`}>
                {passed ? <Award className="h-9 w-9" /> : <RotateCcw className="h-8 w-8" />}
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  {passed ? `Phase ${phaseIndex + 1} Passed! 🎉` : "Review Needed"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  You scored <strong className="text-slate-800">{correctCount} of {questions.length}</strong> questions correctly.
                </p>
              </div>

              {passed ? (
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    Roadmap & Competency Successfully Updated
                  </div>
                  <ul className="text-xs text-emerald-700 space-y-1 list-disc list-inside">
                    <li>Phase status marked as <strong>Completed</strong> in Roadmap.</li>
                    <li>Subsequent phase automatically unlocked.</li>
                    <li><strong>+10% Competency boost</strong> applied to {skill}.</li>
                  </ul>
                </div>
              ) : (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-left max-w-md mx-auto">
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    A minimum of 2 correct answers is required to complete this milestone. Review the downloadable study notes below and retry the quiz!
                  </p>
                </div>
              )}

              {/* Study Notes Download Buttons */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-md mx-auto">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Phase Study Materials:
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => downloadPhaseNotesPDF(milestone, profile)}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-indigo-700 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all"
                  >
                    <FileText className="h-4 w-4 text-indigo-600" /> Download PDF Notes
                  </button>
                  <button
                    onClick={() => downloadPhaseNotesMarkdown(milestone, profile)}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all"
                  >
                    <BookOpen className="h-4 w-4 text-slate-500" /> Download Markdown (.md)
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                {!passed && (
                  <button
                    onClick={handleRetake}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <RotateCcw className="h-4 w-4" /> Retake Phase Quiz
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
