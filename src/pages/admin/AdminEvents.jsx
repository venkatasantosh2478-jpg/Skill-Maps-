import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search
} from "lucide-react";
import { getStoredEvents, saveStoredEvent, deleteStoredEvent } from "@/lib/dataStore";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const load = () => {
    setEvents(getStoredEvents());
  };

  useEffect(() => {
    load();
    window.addEventListener("skillsmap_store_update", load);
    return () => window.removeEventListener("skillsmap_store_update", load);
  }, []);

  const handleCreateNew = () => {
    setCurrentEvent({
      id: `event_${Date.now()}`,
      title: "",
      organizer: "",
      type: "Hackathon",
      mode: "Virtual",
      dateRange: "Oct 20 - Oct 22, 2026",
      prizePool: "$20,000 Cash",
      eligibility: "Open to all enrolled university students",
      teamSize: "1 to 4 Members",
      category: "Software Engineering",
      tags: ["AI", "Cloud", "React"],
      description: "",
      status: "Registration Open",
      perks: ["Cloud credits", "Fast-track interviews", "Swag kit"]
    });
    setIsEditing(true);
  };

  const handleEdit = (evt) => {
    setCurrentEvent({ ...evt });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event/hackathon?")) {
      deleteStoredEvent(id);
      load();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentEvent.title) return;
    saveStoredEvent(currentEvent);
    setIsEditing(false);
    setCurrentEvent(null);
    load();
  };

  const filtered = events.filter((e) => 
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.organizer?.toLowerCase().includes(search.toLowerCase()) ||
    e.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto font-body text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              FACULTY ADMIN
            </span>
            <span className="text-xs text-slate-400">· Events & Hackathons CMS</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Hackathons & Tech Events Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Publish hackathons, student coding competitions, workshop dates, and prize pools.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/25 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Event
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
            placeholder="Search events by title or host..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
        <span className="text-xs text-slate-400">{filtered.length} events listed</span>
      </div>

      {/* Events Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4 pl-6">Event & Host</th>
                <th className="p-4">Type & Format</th>
                <th className="p-4">Dates & Schedule</th>
                <th className="p-4">Prize Pool</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-white text-sm">{evt.title}</p>
                    <p className="text-[11px] text-slate-400">{evt.organizer}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {evt.type}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{evt.mode}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-300 font-medium">{evt.dateRange}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-amber-400 font-bold">{evt.prizePool}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                      {evt.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(evt)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Event"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Event"
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
      {isEditing && currentEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">
                {currentEvent.id ? "Edit Hackathon / Event" : "Create Hackathon / Event"}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Host / Organizer</label>
                  <input
                    type="text"
                    value={currentEvent.organizer}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, organizer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Event Type</label>
                  <select
                    value={currentEvent.type}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Conference">Conference</option>
                    <option value="Competition">Competition</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Dates / Timeline</label>
                  <input
                    type="text"
                    value={currentEvent.dateRange}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, dateRange: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Prize Pool / Grants</label>
                  <input
                    type="text"
                    value={currentEvent.prizePool}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, prizePool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={currentEvent.description}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
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
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
