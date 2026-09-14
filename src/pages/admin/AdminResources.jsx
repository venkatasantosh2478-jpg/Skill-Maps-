import React, { useEffect, useState } from "react";
import { skillsMap } from "@/api/skillsMapClient";
import { SKILL_TRACKS } from "@/lib/quizBank";
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  BookOpen, 
  Search, 
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = ["course", "article", "video", "book", "tutorial", "documentation", "project"];
const BANDS = ["beginner", "intermediate", "advanced"];
const ALL_SKILLS = [...new Set(Object.values(SKILL_TRACKS).flat())];

export default function AdminResources() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [form, setForm] = useState({ title: "", url: "", type: "course", skill: "", levelBand: "beginner" });

  const load = async () => {
    try {
      const all = await skillsMap.entities.Resource.list();
      setItems(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { 
    setForm({ title: "", url: "", type: "course", skill: ALL_SKILLS[0] || "Python", levelBand: "beginner" }); 
    setEditing("new"); 
  };

  const openEdit = (r) => { 
    setForm({ title: r.title, url: r.url || "", type: r.type, skill: r.skill, levelBand: r.levelBand }); 
    setEditing(r.id); 
  };

  const save = async () => {
    if (!form.title || !form.skill) return;
    if (editing === "new") {
      await skillsMap.entities.Resource.create(form);
    } else {
      await skillsMap.entities.Resource.update(editing, form);
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    await skillsMap.entities.Resource.delete(id);
    load();
  };

  const filtered = items.filter((r) => {
    const matchesSearch = 
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.skill?.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "all" || r.type === selectedType;
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
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5 w-fit mb-1.5">
            <BookOpen className="h-3.5 w-3.5 text-violet-400" />
            CURRICULUM CONTENT REPOSITORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Curriculum Resources CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage learning modules, textbook links, official docs, and interactive coding challenges.
          </p>
        </div>

        <button 
          onClick={openNew} 
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 self-start sm:self-auto cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" /> 
          <span>Add New Resource</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or target skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3.5 py-2 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl focus:outline-none focus:border-violet-500 w-full sm:w-auto"
        >
          <option value="all">All Content Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Table Content */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Resource Title & Link</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Core Skill</th>
                <th className="py-4 px-4">Level Band</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm line-clamp-1">{r.title}</p>
                      {r.url && (
                        <a 
                          href={r.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[11px] text-violet-400 hover:underline flex items-center gap-1 w-fit"
                        >
                          <span className="truncate max-w-xs">{r.url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                      {r.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {r.skill}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      r.levelBand === "advanced" ? "bg-rose-500/20 text-rose-300" :
                      r.levelBand === "intermediate" ? "bg-amber-500/20 text-amber-300" :
                      "bg-emerald-500/20 text-emerald-300"
                    )}>
                      {r.levelBand}
                    </span>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEdit(r)} 
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-violet-300 transition-colors"
                        title="Edit Resource"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => remove(r.id)} 
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors"
                        title="Delete Resource"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No resources found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-violet-400" />
                <span>{editing === "new" ? "Add Resource" : "Edit Resource"}</span>
              </h2>
              <button 
                onClick={() => setEditing(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Resource Title</label>
                <input 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  placeholder="e.g. Official React 19 Documentation"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Target URL</label>
                <input 
                  value={form.url} 
                  onChange={(e) => setForm({ ...form, url: e.target.value })} 
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Resource Type</label>
                  <select 
                    value={form.type} 
                    onChange={(e) => setForm({ ...form, type: e.target.value })} 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 capitalize"
                  >
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Level Band</label>
                  <select 
                    value={form.levelBand} 
                    onChange={(e) => setForm({ ...form, levelBand: e.target.value })} 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 capitalize"
                  >
                    {BANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Associated Skill</label>
                <select 
                  value={form.skill} 
                  onChange={(e) => setForm({ ...form, skill: e.target.value })} 
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="">Select a skill...</option>
                  {ALL_SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
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
                className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-500 shadow-lg shadow-violet-600/30"
              >
                Save Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
