import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search
} from "lucide-react";
import { getStoredFreelanceGigs, saveStoredFreelanceGig, deleteStoredFreelanceGig, getStudentApplications } from "@/lib/dataStore";

export default function AdminFreelance() {
  const [gigs, setGigs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentGig, setCurrentGig] = useState(null);
  const [viewPropsModal, setViewPropsModal] = useState(null);

  const load = () => {
    setGigs(getStoredFreelanceGigs());
    setApplications(getStudentApplications());
  };

  useEffect(() => {
    load();
    window.addEventListener("skillsmap_store_update", load);
    return () => window.removeEventListener("skillsmap_store_update", load);
  }, []);

  const handleCreateNew = () => {
    setCurrentGig({
      id: `gig_${Date.now()}`,
      title: "",
      client: "",
      category: "Frontend Development",
      payout: "$750 Fixed",
      rateType: "Fixed Project",
      duration: "2 Weeks",
      difficulty: "Beginner Friendly",
      location: "Remote",
      skillsRequired: ["React", "JavaScript", "Tailwind CSS"],
      description: "",
      deliverables: ["Tested code repository", "Documentation guide"],
      status: "Accepting Proposals",
      clientRating: 5.0,
      studentFriendlyBadge: "Verified Student Friendly"
    });
    setIsEditing(true);
  };

  const handleEdit = (g) => {
    setCurrentGig({ ...g });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this freelance opportunity?")) {
      deleteStoredFreelanceGig(id);
      load();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentGig.title) return;
    saveStoredFreelanceGig(currentGig);
    setIsEditing(false);
    setCurrentGig(null);
    load();
  };

  const filtered = gigs.filter((g) => 
    g.title?.toLowerCase().includes(search.toLowerCase()) ||
    g.client?.toLowerCase().includes(search.toLowerCase()) ||
    g.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto font-body text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              FACULTY ADMIN
            </span>
            <span className="text-xs text-slate-400">· Student Freelancing Portal CMS</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Freelancing & Project Gigs Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Post student-friendly paid projects, review applicant student pitches, and verify compensation terms.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-600/25 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Post New Gig
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
            placeholder="Search gigs by title or client..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{filtered.length} gigs listed</span>
          <span>·</span>
          <span className="text-emerald-400 font-semibold">{applications.length} Student Proposals Received</span>
        </div>
      </div>

      {/* Gigs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4 pl-6">Project Title & Client</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stipend / Budget</th>
                <th className="p-4">Duration & Level</th>
                <th className="p-4">Student Applications</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((g) => {
                const gigApps = applications.filter((a) => a.gigId === g.id);
                return (
                  <tr key={g.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-white text-sm">{g.title}</p>
                      <p className="text-[11px] text-slate-400">{g.client}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                        {g.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-emerald-400 font-bold">{g.payout}</span>
                      <p className="text-[10px] text-slate-400">{g.rateType}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-300">{g.duration}</span>
                      <p className="text-[10px] text-slate-400">{g.difficulty}</p>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setViewPropsModal({ gig: g, apps: gigApps })}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors"
                      >
                        {gigApps.length} Proposals
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(g)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Gig"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Gig"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Proposals Modal */}
      {viewPropsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-sky-400 font-bold uppercase">Student Proposals</span>
                <h3 className="font-heading text-base font-bold text-white mt-0.5">{viewPropsModal.gig.title}</h3>
              </div>
              <button onClick={() => setViewPropsModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {viewPropsModal.apps.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No student proposals submitted yet for this gig.</p>
            ) : (
              <div className="space-y-3">
                {viewPropsModal.apps.map((app) => (
                  <div key={app.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{app.studentName}</span>
                      <span className="text-[10px] text-slate-400">{new Date(app.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 italic">"{app.coverNote}"</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>Timeline: {app.deliveryWeeks}</span>
                      <a href={app.portfolioLink} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                        View Portfolio / GitHub
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isEditing && currentGig && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">
                {currentGig.id ? "Edit Freelance Opportunity" : "Post New Freelance Gig"}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={currentGig.title}
                  onChange={(e) => setCurrentGig({ ...currentGig, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Hiring Client / Startup</label>
                  <input
                    type="text"
                    value={currentGig.client}
                    onChange={(e) => setCurrentGig({ ...currentGig, client: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={currentGig.category}
                    onChange={(e) => setCurrentGig({ ...currentGig, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Stipend / Payout (e.g. $850 Fixed)</label>
                  <input
                    type="text"
                    value={currentGig.payout}
                    onChange={(e) => setCurrentGig({ ...currentGig, payout: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={currentGig.duration}
                    onChange={(e) => setCurrentGig({ ...currentGig, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Scope & Requirements Description</label>
                <textarea
                  rows={3}
                  value={currentGig.description}
                  onChange={(e) => setCurrentGig({ ...currentGig, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
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
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Save Freelance Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
