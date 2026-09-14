import React, { useEffect, useState } from "react";
import { getMyProfile } from "@/lib/skillMap";
import { skillsMap } from "@/api/skillsMapClient";
import { Briefcase, ExternalLink, Sparkles, Award, Users, Trophy, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  project: { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: Layers },
  certification: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Award },
  internship: { bg: "bg-blue-50 text-blue-700 border-blue-200", icon: Briefcase },
  job: { bg: "bg-violet-50 text-violet-700 border-violet-200", icon: Briefcase },
  competition: { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: Trophy },
  volunteer: { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: Users },
};

export default function Opportunities() {
  const [profile, setProfile] = useState(null);
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");

  const load = async () => {
    const p = await getMyProfile();
    setProfile(p);
    const all = await skillsMap.entities.Opportunity.list();
    setOpps(all);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm animate-pulse">
          <Sparkles className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-500">Matching opportunities to your competency gaps...</p>
      </div>
    );
  }

  if (!profile) return <div className="p-8 text-slate-500">Complete onboarding first.</div>;

  // missingSkills from resume check, or lowest 2 competency skills
  let targetSkills = profile.missingSkills && profile.missingSkills.length
    ? profile.missingSkills
    : [...(profile.competencyGraph || [])].sort((a, b) => (a.level || 0) - (b.level || 0)).slice(0, 3).map((s) => s.skill);

  const ranked = opps
    .map((o) => {
      const overlap = (o.requiredSkills || []).filter((s) => targetSkills.includes(s));
      return { ...o, overlap, overlapCount: overlap.length };
    })
    .sort((a, b) => b.overlapCount - a.overlapCount);

  const filteredOpps = activeType === "all" ? ranked : ranked.filter(o => o.type === activeType);

  const grouped = {};
  filteredOpps.forEach((o) => {
    grouped[o.type] = grouped[o.type] || [];
    grouped[o.type].push(o);
  });

  const availableTypes = ["all", ...new Set(opps.map(o => o.type).filter(Boolean))];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              Skill-Gap Matched Engine
            </span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">Opportunities & Roles</h1>
          <p className="text-slate-500 text-sm mt-1">
            Ranked by synergy with your focal skill targets:{" "}
            <span className="font-semibold text-slate-800">
              {targetSkills.length ? targetSkills.slice(0, 4).join(", ") : "general profile"}
            </span>
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-100 p-1.5 rounded-2xl shrink-0">
          {availableTypes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={cn(
                "capitalize text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors",
                activeType === t ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {ranked.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <Briefcase className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-heading text-lg font-bold text-slate-800 mb-1">No Opportunities Active</h3>
          <p className="text-sm text-slate-400">Head to the Admin dashboard to seed or create new career opportunities.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([type, items]) => {
            const conf = TYPE_CONFIG[type] || TYPE_CONFIG.job;
            const Icon = conf.icon;

            return (
              <div key={type} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider flex items-center gap-1.5", conf.bg)}>
                    <Icon className="h-3.5 w-3.5" />
                    {type}
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {items.length} {items.length === 1 ? "position" : "positions"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((o) => (
                    <div 
                      key={o.id} 
                      className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-heading font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                            {o.title}
                          </h3>
                        </div>

                        {o.overlapCount > 0 ? (
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full mb-3">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                            Directly bridges {o.overlapCount} skill {o.overlapCount === 1 ? "gap" : "gaps"}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 mb-3">General industry requirement</div>
                        )}

                        {o.requiredSkills?.length > 0 && (
                          <div className="space-y-1.5 mb-4">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Required Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {o.requiredSkills.map((s, i) => {
                                const isGap = targetSkills.includes(s);
                                return (
                                  <span 
                                    key={i} 
                                    className={cn(
                                      "text-xs px-2.5 py-1 rounded-xl font-medium transition-colors",
                                      isGap 
                                        ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200" 
                                        : "bg-slate-100 text-slate-600"
                                    )}
                                  >
                                    {s}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div className="space-y-0.5">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Min Proficiency</p>
                          <p className="text-xs font-bold text-slate-700">{Math.round((o.minLevel || 0) * 100)}%</p>
                        </div>
                        {o.link && (
                          <a 
                            href={o.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <span>Explore Role</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
