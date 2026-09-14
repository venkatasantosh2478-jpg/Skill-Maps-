import React, { useEffect, useState } from "react";
import { getMyProfile, updateProfile, addActivity, bumpSkill, levelToBand, generateResourceReason } from "@/lib/skillMap";
import { skillsMap } from "@/api/skillsMapClient";
import { Loader2, BookOpen, ExternalLink, Check, Sparkles, Video, FileText, Code2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  course: { bg: "bg-blue-50 text-blue-700 border-blue-200", icon: GraduationCap },
  article: { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: FileText },
  video: { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: Video },
  book: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: BookOpen },
  tutorial: { bg: "bg-violet-50 text-violet-700 border-violet-200", icon: Code2 },
  documentation: { bg: "bg-slate-100 text-slate-700 border-slate-200", icon: FileText },
  project: { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: Code2 },
};

export default function Resources() {
  const [profile, setProfile] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reasons, setReasons] = useState({});
  const [completed, setCompleted] = useState({});
  const [selectedType, setSelectedType] = useState("all");

  const load = async () => {
    const p = await getMyProfile();
    setProfile(p);
    const all = await skillsMap.entities.Resource.list();
    setResources(all);
    setLoading(false);
    if (p) {
      const milestone = (p.roadmap?.milestones || []).find((m) => m.status === "in_progress") || (p.roadmap?.milestones || [])[0];
      const targetSkill = milestone?.skill;
      const band = levelToBand((p.competencyGraph || []).find((s) => s.skill === targetSkill)?.level || 0.3);
      const filtered = all
        .filter((r) => !targetSkill || r.skill === targetSkill)
        .filter((r) => r.levelBand === band || !r.levelBand)
        .slice(0, 6);
      const recs = filtered.length ? filtered : all.filter((r) => !targetSkill || r.skill === targetSkill).slice(0, 6);
      const reasonMap = {};
      for (const r of recs) {
        reasonMap[r.id] = await generateResourceReason(r, p);
      }
      setReasons(reasonMap);
    }
  };
  useEffect(() => { load(); }, []);

  const markComplete = async (r) => {
    if (completed[r.id]) return;
    setCompleted({ ...completed, [r.id]: true });
    const newGraph = bumpSkill(profile.competencyGraph, r.skill, 0.05);
    const newLog = addActivity(profile.activityLog, `Mastered resource: ${r.title}`, r.skill, 0.05);
    const updated = await updateProfile(profile.id, { competencyGraph: newGraph, activityLog: newLog });
    setProfile({ ...profile, ...updated });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm animate-pulse">
          <Sparkles className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-500">Curating tailored learning resources...</p>
      </div>
    );
  }

  if (!profile) return <div className="p-8 text-slate-500">Complete onboarding first.</div>;

  const milestone = (profile.roadmap?.milestones || []).find((m) => m.status === "in_progress") || (profile.roadmap?.milestones || [])[0];
  const targetSkill = milestone?.skill;
  const band = levelToBand((profile.competencyGraph || []).find((s) => s.skill === targetSkill)?.level || 0.3);

  const recommended = resources
    .filter((r) => !targetSkill || r.skill === targetSkill)
    .filter((r) => r.levelBand === band || !r.levelBand)
    .slice(0, 6);
  const recs = recommended.length ? recommended : resources.filter((r) => !targetSkill || r.skill === targetSkill).slice(0, 6);
  const others = resources.filter((r) => !recs.find((rr) => rr.id === r.id));

  const allTypes = ["all", ...new Set(resources.map((r) => r.type).filter(Boolean))];

  const filteredRecs = recs.filter((r) => selectedType === "all" || r.type === selectedType);
  const filteredOthers = others.filter((r) => selectedType === "all" || r.type === selectedType);

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              AI Curated Syllabus
            </span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">Curriculum Resources</h1>
          <p className="text-slate-500 text-sm mt-1">
            {targetSkill 
              ? `Personalized for your active milestone: ${targetSkill} · Current Band: ${band}` 
              : "Explore comprehensive learning materials matched to industry requirements."}
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-100 p-1.5 rounded-2xl shrink-0">
          {allTypes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={cn(
                "capitalize text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors",
                selectedType === t ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filteredRecs.length === 0 && filteredOthers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-heading text-lg font-bold text-slate-800 mb-1">No Resources Found</h3>
          <p className="text-sm text-slate-400">Try changing your type filter or requesting new syllabus modules in Admin.</p>
        </div>
      ) : (
        <>
          {/* Priority Recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-heading text-xl font-bold text-slate-900">Highest Impact for Your Milestone</h2>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                {filteredRecs.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRecs.map((r) => {
                const conf = TYPE_CONFIG[r.type] || TYPE_CONFIG.article;
                const Icon = conf.icon;
                const isDone = completed[r.id];

                return (
                  <div 
                    key={r.id} 
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider flex items-center gap-1", conf.bg)}>
                          <Icon className="h-3 w-3" /> {r.type}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {r.levelBand || "All Levels"}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                        {r.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {r.skill}
                        </span>
                      </div>

                      {/* Gemini reason */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4 min-h-[64px] flex items-start">
                        {reasons[r.id] ? (
                          <p className="text-xs text-slate-600 italic flex items-start gap-1.5 leading-relaxed">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                            <span>{reasons[r.id]}</span>
                          </p>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Synthesizing learning rationale...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2 mt-auto">
                      {r.url && (
                        <a 
                          href={r.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Open Resource
                        </a>
                      )}
                      <button
                        onClick={() => markComplete(r)}
                        disabled={isDone}
                        className={cn(
                          "flex-1 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs",
                          isDone 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        )}
                      >
                        <Check className="h-4 w-4" /> 
                        {isDone ? "Completed (+5%)" : "Complete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* More Resources */}
          {filteredOthers.length > 0 && (
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-heading text-lg font-bold text-slate-800">Additional Catalog Resources</h2>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {filteredOthers.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOthers.map((r) => {
                  const conf = TYPE_CONFIG[r.type] || TYPE_CONFIG.article;
                  const Icon = conf.icon;
                  const isDone = completed[r.id];

                  return (
                    <div key={r.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase flex items-center gap-1", conf.bg)}>
                            <Icon className="h-3 w-3" /> {r.type}
                          </span>
                          <span className="text-[11px] text-slate-400">{r.levelBand || "All"}</span>
                        </div>
                        <h4 className="font-heading font-semibold text-slate-900 text-sm mb-1">{r.title}</h4>
                        <p className="text-xs text-indigo-600 font-medium mb-3">{r.skill}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        {r.url && (
                          <a 
                            href={r.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex-1 text-xs font-semibold py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" /> Open
                          </a>
                        )}
                        <button
                          onClick={() => markComplete(r)}
                          disabled={isDone}
                          className={cn(
                            "flex-1 text-xs font-bold py-1.5 rounded-lg flex items-center justify-center gap-1",
                            isDone ? "bg-emerald-50 text-emerald-700" : "bg-indigo-600 text-white hover:bg-indigo-700"
                          )}
                        >
                          <Check className="h-3 w-3" /> {isDone ? "Done" : "+5%"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
