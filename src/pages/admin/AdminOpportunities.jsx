import React, { useEffect, useState } from "react";
import { skillsMap } from "@/api/skillsMapClient";
import { SKILL_TRACKS } from "@/lib/quizBank";
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Briefcase, 
  Search, 
  ExternalLink,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = ["project", "certification", "internship", "job", "competition", "volunteer"];
const ALL_SKILLS = [...new Set(Object.values(SKILL_TRACKS).flat())];

export default function AdminOpportunities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [form, setForm] = useState({ title: "", type: "project", requiredSkills: [], minLevel: 0.4, link: "" });

  const load = async () => {
    try {
      const all = await skillsMap.entities.Opportunity.list();
      setItems(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { 
    setForm({ title: "", type: "project", requiredSkills: [], minLevel: 0.4, link: "" }); 
    setEditing("new"); 
  };

  const openEdit = (o) => { 
    setForm({ title: o.title, type: o.type, requiredSkills: o.requiredSkills || [], minLevel: o.minLevel || 0.4, link: o.link || "" }); 
    setEditing(o.id); 
  };

  const save = async () => {
    if (!form.title) return;
    if (editing === "new") await skillsMap.entities.Opportunity.create(form);
    else await skillsMap.entities.Opportunity.update(editing, form);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;
    await skillsMap.entities.Opportunity.delete(id);
    load();
  };

  const toggleSkill = (skill) => {
    const skills = form.requiredSkills.includes(skill) 
      ? form.requiredSkills.filter((s) => s !== skill) 
      : [...form.requiredSkills, skill];
    setForm({ ...form, requiredSkills: skills });
  };

  const filtered = items.filter((o) => {
    const matchesSearch = 
      o.title?.toLowerCase().includes(search.toLowerCase()) ||
      (o.requiredSkills && o.requiredSkills.some(s => s.toLowerCase().includes(search.toLowerCase())));
    const matchesType = selectedType === "all" || o.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f172a]">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 w-fit mb-1.5">
            <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
            CAREER & PROJECT OPPORTUNITIES
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Opportunities & Internships
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish verified hackathons, client gigs, internships, and capstone team projects.
          </p>
        </div>

        <button 
          onClick={openNew} 
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 self-start sm:self-auto cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" /> 
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search opportunities by title or required skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3.5 py-2 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl focus:outline-none focus:border-indigo-500 w-full sm:w-auto capitalize"
        >
          <option value="all">All Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((o) => (
          <div key={o.id} className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                  {o.type}
                </span>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => openEdit(o)} 
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => remove(o.id)} 
                    className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-white text-sm leading-snug">{o.title}</h3>

              <div className="flex flex-wrap gap-1.5">
                {(o.requiredSkills || []).slice(0, 5).map((s, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Target className="h-3.5 w-3.5 text-indigo-400" />
                <span>Min level: {Math.round((o.minLevel || 0) * 100)}%</span>
              </div>
              {o.link && (
                <a 
                  href={o.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Apply Link</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/90 rounded-3xl border border-slate-800">
            No opportunities found matching search criteria.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-400" />
                <span>{editing === "new" ? "Add Opportunity" : "Edit Opportunity"}</span>
              </h2>
              <button 
                onClick={() => setEditing(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Opportunity Title</label>
                <input 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  placeholder="e.g. Full-Stack AI Resident Intern"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Category Type</label>
                  <select 
                    value={form.type} 
                    onChange={(e) => setForm({ ...form, type: e.target.value })} 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 capitalize"
                  >
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Min Skill Level: {Math.round((form.minLevel || 0) * 100)}%</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={form.minLevel} 
                    onChange={(e) => setForm({ ...form, minLevel: parseFloat(e.target.value) })} 
                    className="w-full mt-2 accent-indigo-500" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Application / Project Link</label>
                <input 
                  value={form.link} 
                  onChange={(e) => setForm({ ...form, link: e.target.value })} 
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Required Skills (Click to toggle)</label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto border border-slate-700 bg-slate-950/60 rounded-xl p-3">
                  {ALL_SKILLS.map((s) => {
                    const selected = form.requiredSkills.includes(s);
                    return (
                      <button 
                        key={s} 
                        type="button" 
                        onClick={() => toggleSkill(s)} 
                        className={cn(
                          "text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer",
                          selected 
                            ? "bg-indigo-600 text-white" 
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800">
              <button 
                onClick={() => setEditing(null)} 
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={save} 
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
              >
                Save Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
