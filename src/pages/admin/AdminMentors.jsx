import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Search
} from "lucide-react";
import { getStoredMentors, saveStoredMentor, deleteStoredMentor } from "@/lib/dataStore";
import { cn } from "@/lib/utils";

export default function AdminMentors() {
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentMentor, setCurrentMentor] = useState(null);

  const load = () => {
    setMentors(getStoredMentors());
  };

  useEffect(() => {
    load();
    window.addEventListener("skillsmap_store_update", load);
    return () => window.removeEventListener("skillsmap_store_update", load);
  }, []);

  const handleCreateNew = () => {
    setCurrentMentor({
      id: `mentor_${Date.now()}`,
      name: "",
      role: "Staff Software Engineer",
      company: "Google / Tech",
      sector: "Software & Cloud Systems",
      sectorId: "software-engineering",
      experience: "8 years",
      rating: 5.0,
      totalSessions: 0,
      location: "San Francisco, CA (Remote)",
      avatarBg: "from-blue-600 to-indigo-700",
      initials: "M",
      bio: "Industry practitioner supporting students on mock interviews and system architecture.",
      specialties: ["System Design", "Cloud Infrastructure", "Career Growth"],
      nextAvailableSlot: "Tomorrow at 2:00 PM",
      availableSlots: [
        { date: "Tomorrow", time: "2:00 PM" },
        { date: "Friday", time: "11:00 AM" }
      ],
      verifiedBadge: "Verified Staff Mentor"
    });
    setIsEditing(true);
  };

  const handleEdit = (m) => {
    setCurrentMentor({ ...m });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this mentor profile?")) {
      deleteStoredMentor(id);
      load();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentMentor.name) return;
    saveStoredMentor(currentMentor);
    setIsEditing(false);
    setCurrentMentor(null);
    load();
  };

  const filtered = mentors.filter((m) => 
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.company?.toLowerCase().includes(search.toLowerCase()) ||
    m.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto font-body text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              FACULTY ADMIN
            </span>
            <span className="text-xs text-slate-400">· 1:1 Mentorship Registry</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Industry Mentors Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage verified industry directors, mock interviewers, and bookable student calendar slots.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/25 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Mentor
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
            placeholder="Search mentors by name or company..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
        <span className="text-xs text-slate-400">{filtered.length} mentors active</span>
      </div>

      {/* Mentors Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4 pl-6">Mentor & Organization</th>
                <th className="p-4">Sector Track</th>
                <th className="p-4">Rating & Sessions</th>
                <th className="p-4">Next Available Slot</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-9 w-9 rounded-xl bg-gradient-to-tr text-white font-bold flex items-center justify-center text-xs", m.avatarBg || "from-indigo-600 to-violet-600")}>
                        {m.initials || "M"}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{m.name}</p>
                        <p className="text-[11px] text-slate-400">{m.role} · {m.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                      {m.sector}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{m.rating}</span>
                      <span className="text-slate-500 font-normal">({m.totalSessions} sessions)</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-indigo-400 text-xs">{m.nextAvailableSlot}</span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Mentor"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Mentor"
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
      {isEditing && currentMentor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">
                {currentMentor.id ? "Edit Mentor Profile" : "Add Mentor Profile"}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={currentMentor.name}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={currentMentor.role}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={currentMentor.company}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Sector Track</label>
                  <input
                    type="text"
                    value={currentMentor.sector}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, sector: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  value={currentMentor.bio}
                  onChange={(e) => setCurrentMentor({ ...currentMentor, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Experience (e.g. 10 years)</label>
                  <input
                    type="text"
                    value={currentMentor.experience}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Next Slot Time</label>
                  <input
                    type="text"
                    value={currentMentor.nextAvailableSlot}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, nextAvailableSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
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
                  Save Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
