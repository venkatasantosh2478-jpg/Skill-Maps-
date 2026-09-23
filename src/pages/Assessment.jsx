import React, { useEffect, useState } from "react";
import { getMyProfile, updateProfile, addActivity, bumpSkill, generateAdaptiveQuestion } from "@/lib/skillMap";
import { SKILL_TRACKS } from "@/lib/quizBank";
import { Loader2, ClipboardCheck, Check, X, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Assessment() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skill, setSkill] = useState("");
  const [running, setRunning] = useState(false);
  const [q, setQ] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [difficulty, setDifficulty] = useState(0.4);
  const [prevCorrect, setPrevCorrect] = useState(null);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState(null);
  const [loadingQ, setLoadingQ] = useState(false);

  const TOTAL = 5;

  const load = async () => {
    const p = await getMyProfile();
    setProfile(p);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const start = async () => {
    setRunning(true);
    setResults(null);
    setQIdx(0);
    setDifficulty(0.4);
    setPrevCorrect(null);
    await nextQuestion(skill, 0.4, null);
  };

  const nextQuestion = async (sk, diff, prev) => {
    setLoadingQ(true);
    setSelected(null);
    setAnswered(false);
    const question = await generateAdaptiveQuestion(sk, diff, prev);
    setQ(question);
    setLoadingQ(false);
  };

  const answer = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === q.correctIndex;
    setPrevCorrect(correct);
    const newDiff = correct ? Math.min(0.95, difficulty + 0.15) : Math.max(0.15, difficulty - 0.15);
    setDifficulty(newDiff);
  };

  const next = async () => {
    if (qIdx + 1 >= TOTAL) {
      await finish();
    } else {
      setQIdx(qIdx + 1);
      await nextQuestion(skill, difficulty, prevCorrect);
    }
  };

  const finish = async () => {
    // final score: average difficulty reached as proxy + base
    const score = Math.min(1, difficulty);
    const newGraph = bumpSkill(profile.competencyGraph, skill, score - 0.4);
    const newLog = addActivity(profile.activityLog, `Completed adaptive assessment on ${skill}`, skill, Math.round((score - 0.4) * 100) / 100);
    const updated = await updateProfile(profile.id, { competencyGraph: newGraph, activityLog: newLog });
    setProfile({ ...profile, ...updated });
    setResults({ score: Math.round(score * 100) });
    setRunning(false);
    setQ(null);
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 text-indigo-500 animate-spin" /></div>;
  if (!profile) return <div className="p-8 text-slate-500">Complete onboarding first.</div>;

  const skills = profile.competencyGraph?.map((s) => s.skill) || SKILL_TRACKS[profile.track] || [];

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">Code Quiz & IRT Engine</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Live AI Calibrated</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Adaptive Skill & Code Assessment</h1>
        <p className="text-slate-500 mt-1">5 dynamic questions and code evaluations that adapt to your level — correct answers increase question difficulty.</p>
      </div>

      {results ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center shadow-sm">
          <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Assessment complete</h2>
          <p className="text-slate-500 mt-1">Final mastery score for {skill}</p>
          <p className="text-5xl font-bold text-indigo-600 mt-4">{results.score}%</p>
          <p className="text-sm text-slate-400 mt-2">Your competency graph has been updated.</p>
          <button onClick={() => setResults(null)} className="mt-6 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Take another</button>
        </div>
      ) : !running ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Choose a skill to assess</label>
          <select value={skill} onChange={(e) => setSkill(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm mb-4">
            <option value="">Select a skill...</option>
            {skills.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={start} disabled={!skill} className="w-full px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
            <ClipboardCheck className="h-4 w-4" /> Start assessment
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Question {qIdx + 1} of {TOTAL}</span>
            <span className="text-xs text-slate-400">Difficulty: {Math.round(difficulty * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full mb-6">
            <div className="h-1.5 bg-indigo-600 rounded-full transition-all" style={{ width: `${(qIdx / TOTAL) * 100}%` }} />
          </div>

          {loadingQ || !q ? (
            <div className="py-12 text-center"><Loader2 className="h-8 w-8 mx-auto text-indigo-500 animate-spin" /></div>
          ) : (
            <>
              <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full mb-3">{skill}</span>
              <p className="text-lg font-medium text-slate-900 mb-5">{q.question}</p>
              <div className="space-y-2.5">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => answer(i)}
                    disabled={answered}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between",
                      !answered && "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700",
                      answered && i === q.correctIndex && "border-emerald-300 bg-emerald-50 text-emerald-700",
                      answered && i === selected && i !== q.correctIndex && "border-rose-300 bg-rose-50 text-rose-700",
                      answered && i !== selected && i !== q.correctIndex && "border-slate-200 text-slate-400"
                    )}
                  >
                    {opt}
                    {answered && i === q.correctIndex && <Check className="h-4 w-4" />}
                    {answered && i === selected && i !== q.correctIndex && <X className="h-4 w-4" />}
                  </button>
                ))}
              </div>
              {answered && (
                <div className="mt-4">
                  {q.explanation && <p className="text-sm text-slate-500 mb-4">{q.explanation}</p>}
                  <button onClick={next} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                    {qIdx + 1 >= TOTAL ? "Finish" : "Next question"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}