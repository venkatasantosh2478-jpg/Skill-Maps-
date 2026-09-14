import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search
} from "lucide-react";
import { getStoredSectors, saveStoredSector, deleteStoredSector } from "@/lib/dataStore";

export default function AdminSectors() {
  const [sectors, setSectors] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentSector, setCurrentSector] = useState(null);

  const load = () => {
    setSectors(getStoredSectors());
  };

  useEffect(() => {
    load();
    window.addEventListener("skillsmap_store_update", load);
    return () => window.removeEventListener("skillsmap_store_update", load);
  }, []);

  const handleCreateNew = () => {
    setCurrentSector({
      id: `sector_${Date.now()}`,
      name: "",
      category: "Technology",
      tagline: "",
      cagr: "+15.0% (2025–2030)",
      marketSize: "$500 Billion",
      demandIndex: 85,
      automationRisk: "Low to Moderate",
      overview: "",
      coreCompetencies: [
        { name: "Core Domain Architecture", level: "Core", tools: ["Standard Tooling"] }
      ],
      emergingCompetencies: [
        { name: "AI & Automation Orchestration", description: "Integration of modern AI and real-time telemetry." }
      ]
    });
    setIsEditing(true);
  };

  const handleEdit = (sec) => {
    setCurrentSector({ ...sec });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sector? This will affect student competency views.")) {
      deleteStoredSector(id);
      load();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentSector.name) return;
    saveStoredSector(currentSector);
    setIsEditing(false);
    setCurrentSector(null);
    load();
  };

  const filtered = sectors.filter((s) => 
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto font-body text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              FACULTY ADMIN
            </span>
            <span className="text-xs text-slate-400">· Industry Scope Matrix</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Sectors & Real World Competencies
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Configure industry sectors, market growth projections (CAGR), and core competency benchmarks.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/25 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add New Sector
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter sectors by name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
        <span className="text-xs text-slate-400">{filtered.length} configured sectors</span>
      </div>

      {/* Sectors Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4 pl-6">Sector & Category</th>
                <th className="p-4">CAGR & Market</th>
                <th className="p-4">Demand Index</th>
                <th className="p-4">Competencies</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((sec) => (
                <tr key={sec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-white text-sm">{sec.name}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{sec.tagline || sec.category}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-emerald-400">{sec.cagr}</span>
                    <p className="text-[11px] text-slate-400">{sec.marketSize}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{sec.demandIndex}/100</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                      {sec.coreCompetencies?.length || 0} Core Skills
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(sec)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Sector"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sec.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Sector"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isEditing && currentSector && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-heading text-lg font-bold text-white">
                {currentSector.id ? "Edit Industry Sector" : "Add New Industry Sector"}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Sector Name *</label>
                  <input
                    type="text"
                    required
                    value={currentSector.name}
                    onChange={(e) => setCurrentSector({ ...currentSector, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={currentSector.category}
                    onChange={(e) => setCurrentSector({ ...currentSector, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={currentSector.tagline}
                  onChange={(e) => setCurrentSector({ ...currentSector, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">CAGR Growth</label>
                  <input
                    type="text"
                    value={currentSector.cagr}
                    onChange={(e) => setCurrentSector({ ...currentSector, cagr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Market Size</label>
                  <input
                    type="text"
                    value={currentSector.marketSize}
                    onChange={(e) => setCurrentSector({ ...currentSector, marketSize: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Demand Index (1-100)</label>
                  <input
                    type="number"
                    value={currentSector.demandIndex}
                    onChange={(e) => setCurrentSector({ ...currentSector, demandIndex: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Overview Description</label>
                <textarea
                  rows={3}
                  value={currentSector.overview}
                  onChange={(e) => setCurrentSector({ ...currentSector, overview: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold"
                >
                  Save Sector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
