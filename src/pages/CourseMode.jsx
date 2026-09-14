import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { getMyProfile, updateProfile, addActivity, bumpSkill, generateAdaptiveQuestion } from "@/lib/skillMap";
import { skillsMap } from "@/api/skillsMapClient";
import { 
  Loader2, 
  GraduationCap, 
  Flame, 
  Check, 
  Award, 
  BookOpen, 
  ClipboardCheck, 
  Lock, 
  ChevronRight,
  FileText,
  Download,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateSyllabusPDF } from "@/lib/syllabusPdfGenerator";
import { downloadPhaseNotesPDF, downloadPhaseNotesMarkdown, downloadAllCourseNotesPDF } from "@/lib/notesGenerator";

export default function CourseMode() {
  const [profile, setProfile] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    const p = await getMyProfile();
    setProfile(p);
    const all = await skillsMap.entities.Resource.list();
    setResources(all);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const buildPlan = () => {
    const milestones = profile?.roadmap?.milestones || [];
    const plan = [];
    milestones.forEach((m) => {
      plan.push({ skill: m.skill, kind: "resource" });
      plan.push({ skill: m.skill, kind: "quiz" });
    });
    return plan;
  };

  const enable = async () => {
    const updated = await updateProfile(profile.id, { courseMode: { active: true, dayIndex: 0, streak: 0, lastCompletedDate: null, certificateEarned: false } });
    setProfile({ ...profile, ...updated });
  };

  const completeToday = async () => {
    const plan = buildPlan();
    const today = plan[profile.courseMode.dayIndex];
    const newGraph = bumpSkill(profile.competencyGraph, today.skill, 0.05);
    const newLog = addActivity(profile.activityLog, `Course day ${profile.courseMode.dayIndex + 1} complete (${today.kind}: ${today.skill})`, today.skill, 0.05);
    const allDone = profile.courseMode.dayIndex + 1 >= plan.length;

    // Synchronize to roadmap milestones
    const currentMilestones = profile.roadmap?.milestones || [];
    let updatedMilestones = [...currentMilestones];
    if (today.kind === "quiz" || currentMilestones.some(m => m.skill === today.skill && m.status !== "complete")) {
      const targetIdx = updatedMilestones.findIndex(m => m.skill === today.skill);
      if (targetIdx !== -1) {
        updatedMilestones[targetIdx] = { ...updatedMilestones[targetIdx], status: "complete" };
        if (targetIdx + 1 < updatedMilestones.length && updatedMilestones[targetIdx + 1].status === "locked") {
          updatedMilestones[targetIdx + 1] = { ...updatedMilestones[targetIdx + 1], status: "in_progress" };
        }
      }
    }

    const updated = await updateProfile(profile.id, {
      competencyGraph: newGraph,
      activityLog: newLog,
      roadmap: { milestones: updatedMilestones },
      courseMode: {
        ...profile.courseMode,
        dayIndex: profile.courseMode.dayIndex + 1,
        streak: profile.courseMode.streak + 1,
        lastCompletedDate: new Date().toISOString(),
        certificateEarned: allDone,
      },
    });
    setProfile({ ...profile, ...updated });
    setQuiz(null);
    setQuizAnswered(false);
    setSelected(null);
    if (allDone) generateCertificate(profile.name, profile.careerGoal || profile.track);
  };

  const missToday = async () => {
    const newLog = addActivity(profile.activityLog, `Missed course day ${profile.courseMode.dayIndex + 1}`, "", 0);
    const updated = await updateProfile(profile.id, {
      activityLog: newLog,
      courseMode: { ...profile.courseMode, streak: 0, dayIndex: profile.courseMode.dayIndex + 1 },
    });
    setProfile({ ...profile, ...updated });
    setQuiz(null);
    setQuizAnswered(false);
    setSelected(null);
  };

  const startQuiz = async (skill) => {
    const q = await generateAdaptiveQuestion(skill, 0.4, null);
    setQuiz(q);
    setQuizAnswered(false);
    setSelected(null);
  };

  const answerQuiz = (i) => {
    setSelected(i);
    setQuizAnswered(true);
  };

  const generateCertificate = (name, goal) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, "F");
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(0.5);
    doc.rect(16, 16, 265, 178);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(15, 23, 42);
    doc.text("Certificate of Completion", 148.5, 50, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text("SkillMap — Personalized Learning & Career Intelligence", 148.5, 64, { align: "center" });
    doc.setFontSize(12);
    doc.text("This certifies that", 148.5, 88, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(79, 70, 229);
    doc.text(name || "Student", 148.5, 104, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text("has successfully completed the structured course for", 148.5, 120, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text(goal || "their learning track", 148.5, 132, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Completed on ${new Date().toLocaleDateString()}`, 148.5, 160, { align: "center" });
    doc.save(`SkillMap-Certificate.pdf`);
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 text-indigo-500 animate-spin" /></div>;
  if (!profile) return <div className="p-8 text-slate-500">Complete onboarding first.</div>;

  const plan = buildPlan();
  const cm = profile.courseMode || {};
  const today = plan[cm.dayIndex];
  const allDone = cm.dayIndex >= plan.length;

  if (!cm.active) {
    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Structured Course Mode</h1>
          <p className="text-slate-500 mt-1">Turn your roadmap into a day-by-day course. Complete one task per day to build a streak.</p>
        </div>
        {plan.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
            <GraduationCap className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 mb-4">Generate a roadmap first to enable course mode.</p>
            <button onClick={() => navigate("/roadmap")} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium">Go to Roadmap</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Ready to start your course</h2>
            <p className="text-slate-500 mt-1 mb-6">{plan.length} days · one task per day</p>
            <button onClick={enable} className="px-6 py-3 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Start course</button>
          </div>
        )}
      </div>
    );
  }

  const completedMilestonesCount = (profile.roadmap?.milestones || []).filter(m => m.status === "complete").length;
  const totalMilestonesCount = (profile.roadmap?.milestones || []).length;
  const progressPercent = plan.length ? Math.round((cm.dayIndex / plan.length) * 100) : 0;

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              LEARNING PHASE ENGINE
            </span>
            <span className="text-xs text-slate-500">· Active Course Mode</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Interactive Course Mode</h1>
          <p className="text-slate-500 text-sm mt-1">
            Step through daily resources, pass skill quizzes, and synchronize progress to your roadmap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => generateSyllabusPDF(profile, profile.roadmap?.milestones, profile.careerGoal || profile.track)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-indigo-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
            title="Download full course syllabus PDF"
          >
            <FileText className="h-4 w-4 text-indigo-600" /> Syllabus PDF
          </button>
          <button
            onClick={() => downloadAllCourseNotesPDF(profile.roadmap?.milestones, profile, profile.careerGoal || profile.track)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
            title="Download full course revision notes PDF"
          >
            <Download className="h-4 w-4 text-slate-500" /> All Notes PDF
          </button>
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 shadow-2xs">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="font-bold text-slate-900 text-xs">{cm.streak}</span>
            <span className="text-[11px] text-slate-400">streak</span>
          </div>
        </div>
      </div>

      {/* Progress & Milestone Sync Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                Overall Progress: {progressPercent}% Completed
              </span>
              <span className="text-xs text-slate-400">
                (Day {Math.min(cm.dayIndex + 1, plan.length)} of {plan.length})
              </span>
            </div>
            <p className="text-xs text-indigo-600 mt-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Roadmap Synced: {completedMilestonesCount} of {totalMilestonesCount} Milestones Mastered</span>
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            {plan.length - cm.dayIndex} days remaining
          </div>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {allDone ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Course Complete! 🎉</h2>
          <p className="text-slate-500 mt-1 mb-6 text-sm">
            You finished all {plan.length} days. All roadmap milestones and competencies are updated.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => generateCertificate(profile.name, profile.careerGoal || profile.track)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-md shadow-indigo-600/20"
            >
              <Award className="h-4 w-4" /> Download Certificate
            </button>
            <button
              onClick={() => generateSyllabusPDF(profile, profile.roadmap?.milestones, profile.careerGoal || profile.track)}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-indigo-600" /> Download Syllabus PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              {today.kind === "resource" ? (
                <BookOpen className="h-5 w-5 text-indigo-600" />
              ) : (
                <ClipboardCheck className="h-5 w-5 text-violet-600" />
              )}
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
                Day {cm.dayIndex + 1} · {today.kind}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {today.skill}
              </span>
            </div>

            {/* Quick Notes Download */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadPhaseNotesPDF({ skill: today.skill }, profile)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title={`Download study notes for ${today.skill}`}
              >
                <FileText className="h-3.5 w-3.5 text-indigo-600" /> Notes (PDF)
              </button>
              <button
                onClick={() => downloadPhaseNotesMarkdown({ skill: today.skill }, profile)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1 transition-colors"
                title={`Download markdown notes for ${today.skill}`}
              >
                <Download className="h-3 w-3" /> .md
              </button>
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900 font-heading mb-1">
            {today.kind === "resource" ? "Study Recommended Learning Material" : "Pass Skill Assessment Quiz"}
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            {today.kind === "resource"
              ? `Review the curated study resources and architectural notes on ${today.skill}, then mark today complete.`
              : `Answer the adaptive evaluation question on ${today.skill} to complete today and update your roadmap.`}
          </p>

          {today.kind === "resource" ? (
            <div className="space-y-2.5 mb-6">
              {resources.filter((r) => r.skill === today.skill).slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.type} · {r.levelBand}</p>
                  </div>
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Open Resource →
                    </a>
                  )}
                </div>
              ))}
              {resources.filter((r) => r.skill === today.skill).length === 0 && (
                <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500 border border-slate-100">
                  Curated online resources for {today.skill} are supplemented by the downloadable Study Notes above. Complete your self-study and mark done.
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6">
              {!quiz ? (
                <button
                  onClick={() => startQuiz(today.skill)}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Start Phase Quiz Question
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 mb-3">{quiz.question}</p>
                  <div className="space-y-2">
                    {quiz.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => answerQuiz(i)}
                        disabled={quizAnswered}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all",
                          !quizAnswered && "border-slate-200 hover:border-violet-400 bg-white",
                          quizAnswered && i === quiz.correctIndex && "border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold",
                          quizAnswered && i === selected && i !== quiz.correctIndex && "border-rose-300 bg-rose-50 text-rose-800",
                          quizAnswered && i !== selected && i !== quiz.correctIndex && "border-slate-200 text-slate-400 bg-white"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={completeToday}
              disabled={today.kind === "quiz" && !quizAnswered}
              className="flex-1 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
            >
              <Check className="h-4 w-4" /> Complete Today & Update Roadmap (+1 streak)
            </button>
            <button
              onClick={missToday}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Curriculum Schedule & Notes */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-base font-bold text-slate-900">Curriculum Schedule & Day Breakdown</h3>
          <span className="text-xs text-slate-400">{plan.length} Total Modules</span>
        </div>
        <div className="space-y-2">
          {plan.map((d, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between p-3 rounded-2xl text-xs transition-all",
                i < cm.dayIndex
                  ? "bg-slate-50 border border-slate-100 text-slate-700"
                  : i === cm.dayIndex
                  ? "bg-indigo-50/80 border border-indigo-200 text-indigo-950 font-medium"
                  : "bg-white border border-slate-100 text-slate-400 opacity-70"
              )}
            >
              <div className="flex items-center gap-3">
                {i < cm.dayIndex ? (
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : i === cm.dayIndex ? (
                  <ChevronRight className="h-4 w-4 text-indigo-600 shrink-0" />
                ) : (
                  <Lock className="h-4 w-4 text-slate-300 shrink-0" />
                )}
                <span className="w-14 font-semibold text-slate-500">Day {i + 1}</span>
                <span className="font-bold text-slate-800">{d.skill}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-600 capitalize text-[10px]">
                  {d.kind}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => downloadPhaseNotesPDF({ skill: d.skill }, profile)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-indigo-600 transition-colors"
                  title={`Download study note PDF for ${d.skill}`}
                >
                  <FileText className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}