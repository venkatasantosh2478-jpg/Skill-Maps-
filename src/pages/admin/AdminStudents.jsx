import React, { useEffect, useState } from "react";
import { skillsMap } from "@/api/skillsMapClient";
import { avgCompetency } from "@/lib/skillMap";
import { getStoredLectures } from "@/data/lecturesData";
import CompetencyRadar from "@/components/CompetencyRadar";
import { 
  downloadUsersCSV, 
  downloadUsersJSON, 
  downloadTopVideosCSV, 
  downloadFullPlatformReport 
} from "@/lib/appExporter";
import { 
  Loader2, 
  Search, 
  X, 
  Download, 
  UserPlus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  FileCode,
  Video,
  FileText,
  Building,
  Flame,
  Sparkles,
  RefreshCw
} from "lucide-react";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // 'all', 'student', 'admin', 'faculty'
  
  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const [newUserForm, setNewUserForm] = useState({
    full_name: "",
    email: "",
    role: "student",
    institution: "University Institute of Technology",
    careerGoal: "Full Stack Cloud & AI Architecture",
    track: "Software Engineering",
    xp: 2150,
    streakDays: 5,
    modulesCompleted: 4
  });

  const load = async () => {
    setLoading(true);
    try {
      // Fetch both student profiles and all registered users
      const allProfiles = await skillsMap.entities.StudentProfile.list();
      const allAuthUsers = skillsMap.auth.getAllUsers ? skillsMap.auth.getAllUsers() : [];
      
      // Merge unique users
      const map = new Map();
      allAuthUsers.forEach((u) => {
        map.set(u.id || u.uid || u.email, {
          id: u.id || u.uid,
          uid: u.uid || u.id,
          name: u.full_name || u.name,
          full_name: u.full_name || u.name,
          email: u.email,
          role: u.role || "student",
          institution: u.institution || "University Institute of Technology",
          careerGoal: u.careerGoal || "Full Stack Software Engineer",
          track: u.track || "Software Engineering",
          xp: u.xp ?? 2150,
          streakDays: u.streakDays ?? 5,
          modulesCompleted: u.modulesCompleted ?? 4,
          quizzesCompleted: u.quizzesCompleted ?? 8,
          codeChallengesSolved: u.codeChallengesSolved ?? 9,
          created_date: u.created_date || new Date().toISOString(),
          competencyGraph: null
        });
      });

      allProfiles.forEach((p) => {
        const key = p.created_by_id || p.id || p.email;
        const existing = map.get(key) || {};
        map.set(key, {
          ...existing,
          id: p.id || existing.id,
          profileId: p.id,
          name: p.name || p.full_name || existing.name || "Student Candidate",
          full_name: p.full_name || p.name || existing.full_name || "Student Candidate",
          email: p.email || existing.email,
          role: existing.role || "student",
          institution: p.institution || existing.institution || "University Institute of Technology",
          careerGoal: p.careerGoal || existing.careerGoal || "Full Stack Software Engineer",
          track: p.track || existing.track || "Software Engineering",
          xp: existing.xp ?? 2150,
          streakDays: p.courseMode?.streak || existing.streakDays || 5,
          modulesCompleted: existing.modulesCompleted || 4,
          competencyGraph: p.competencyGraph || existing.competencyGraph
        });
      });

      const list = Array.from(map.values());
      setStudents(list);
    } catch (e) {
      console.error("Failed to load students:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handleUsersChange = () => load();
    window.addEventListener("skillsmap_users_changed", handleUsersChange);
    return () => window.removeEventListener("skillsmap_users_changed", handleUsersChange);
  }, []);

  const triggerSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(""), 4000);
  };

  // Handlers for CRUD
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      skillsMap.auth.updateUser(editingUser.id, editingUser);
      if (editingUser.profileId) {
        skillsMap.entities.StudentProfile.update(editingUser.profileId, {
          name: editingUser.full_name,
          full_name: editingUser.full_name,
          institution: editingUser.institution,
          careerGoal: editingUser.careerGoal,
          track: editingUser.track
        }).catch(() => {});
      }
      setEditingUser(null);
      load();
      triggerSuccess(`Successfully updated profile for ${editingUser.full_name || editingUser.email}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;
    try {
      skillsMap.auth.deleteUser(deletingUser.id);
      if (deletingUser.profileId) {
        skillsMap.entities.StudentProfile.delete(deletingUser.profileId).catch(() => {});
      }
      const name = deletingUser.full_name || deletingUser.name || deletingUser.email;
      setDeletingUser(null);
      load();
      triggerSuccess(`User "${name}" has been permanently deleted from the directory.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.email || !newUserForm.full_name) return;
    try {
      const created = skillsMap.auth.createUser(newUserForm);
      skillsMap.entities.StudentProfile.create({
        created_by_id: created.id,
        name: newUserForm.full_name,
        full_name: newUserForm.full_name,
        email: newUserForm.email,
        institution: newUserForm.institution,
        careerGoal: newUserForm.careerGoal,
        track: newUserForm.track
      }).catch(() => {});

      setShowAddModal(false);
      setNewUserForm({
        full_name: "",
        email: "",
        role: "student",
        institution: "University Institute of Technology",
        careerGoal: "Full Stack Cloud & AI Architecture",
        track: "Software Engineering",
        xp: 2150,
        streakDays: 5,
        modulesCompleted: 4
      });
      load();
      triggerSuccess(`Successfully registered new user: ${newUserForm.full_name}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Export handlers
  const handleExportUsersCSV = () => {
    downloadUsersCSV(students);
    triggerSuccess(`Exported ${students.length} users to CSV format!`);
  };

  const handleExportUsersJSON = () => {
    downloadUsersJSON(students);
    triggerSuccess(`Exported ${students.length} users to JSON format!`);
  };

  const handleExportTopVideos = () => {
    const videos = getStoredLectures();
    downloadTopVideosCSV(videos);
    triggerSuccess(`Exported top ${videos.length} peer videos to CSV format!`);
  };

  const handleExportFullReport = () => {
    const videos = getStoredLectures();
    downloadFullPlatformReport({
      users: students,
      videos,
      stats: {
        avgScore: "82%",
        activeThisWeek: students.length,
        quizzesToday: 28,
        certificates: 14
      }
    });
    triggerSuccess("Complete application telemetry report downloaded!");
  };

  // Filter students
  const filtered = students.filter((s) => {
    const q = query.toLowerCase();
    const matchesQuery = 
      (s.full_name || s.name || "").toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q) ||
      (s.institution || "").toLowerCase().includes(q) ||
      (s.careerGoal || "").toLowerCase().includes(q);

    const matchesRole = roleFilter === "all" || s.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">Student & User Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {students.length} Active Users
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, edit, grant XP, delete users, and download complete platform database archives and lecture catalogs.
          </p>
        </div>

        {/* Global Action Bar: Downloads & Add User */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-md transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-violet-400" />
              <span>Download App Details</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1.5 hidden group-hover:block z-30 space-y-1">
              <button
                onClick={handleExportUsersCSV}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-violet-600/20 hover:text-violet-200 transition-colors text-left"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                <span>Export Users (CSV)</span>
              </button>
              <button
                onClick={handleExportUsersJSON}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-violet-600/20 hover:text-violet-200 transition-colors text-left"
              >
                <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                <span>Export Users (JSON)</span>
              </button>
              <button
                onClick={handleExportTopVideos}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-violet-600/20 hover:text-violet-200 transition-colors text-left"
              >
                <Video className="h-3.5 w-3.5 text-pink-400" />
                <span>Export Top Videos (CSV)</span>
              </button>
              <button
                onClick={handleExportFullReport}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-violet-600/20 hover:text-violet-200 transition-colors text-left border-t border-slate-800 pt-2"
              >
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                <span>Full System Report (JSON)</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/25 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, university, goal..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "student", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                roleFilter === r
                  ? "bg-violet-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {r === "all" ? "All Roles" : r}
            </button>
          ))}
          <button
            onClick={load}
            title="Refresh list"
            className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Student / User</th>
                <th className="px-5 py-3.5 hidden md:table-cell">Institution</th>
                <th className="px-5 py-3.5">Career Goal</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">XP & Level</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 text-violet-500 animate-spin mx-auto mb-2" />
                    Loading user directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    No users matching "{query}".
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id || s.email} className="hover:bg-slate-800/40 transition-colors group">
                    {/* User Name & Email */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {(s.full_name || s.name || s.email || "S").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[180px] sm:max-w-none">
                            {s.full_name || s.name || "Student"}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-none">
                            {s.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Institution */}
                    <td className="px-5 py-3.5 hidden md:table-cell text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-slate-500" />
                        <span className="truncate max-w-[160px]">{s.institution || "University"}</span>
                      </div>
                    </td>

                    {/* Career Goal */}
                    <td className="px-5 py-3.5 text-slate-300">
                      <span className="truncate max-w-[180px] inline-block font-medium text-slate-200">
                        {s.careerGoal || "Software Engineer"}
                      </span>
                    </td>

                    {/* Role Badge */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          s.role === "admin"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        }`}
                      >
                        {s.role || "student"}
                      </span>
                    </td>

                    {/* XP & Streak */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-violet-400">{s.xp || 2150} XP</span>
                        {s.streakDays > 0 && (
                          <span className="flex items-center gap-0.5 text-[11px] text-amber-400 font-medium">
                            <Flame className="h-3 w-3" />
                            {s.streakDays}d
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions: View Radar, Edit, Delete */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          title="View Competency Radar"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Sparkles className="h-4 w-4 text-indigo-400" />
                        </button>
                        <button
                          onClick={() => setEditingUser({ ...s })}
                          title="Edit User Profile"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="h-4 w-4 text-violet-400" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(s)}
                          title="Delete User"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Edit User Profile */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Edit3 className="h-5 w-5 text-violet-400" />
                <h3 className="text-lg font-bold text-white">Edit User Profile</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.full_name || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Role</label>
                  <select
                    value={editingUser.role || "student"}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                    <option value="faculty">Faculty Member</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Institution</label>
                  <input
                    type="text"
                    value={editingUser.institution || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, institution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-semibold">Target Career Goal</label>
                  <input
                    type="text"
                    value={editingUser.careerGoal || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, careerGoal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">XP Score Points</label>
                  <input
                    type="number"
                    value={editingUser.xp ?? 2150}
                    onChange={(e) => setEditingUser({ ...editingUser, xp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Streak Days</label>
                  <input
                    type="number"
                    value={editingUser.streakDays ?? 5}
                    onChange={(e) => setEditingUser({ ...editingUser, streakDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/30 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Delete Confirmation */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-900/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-400">
              <div className="h-10 w-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete User?</h3>
                <p className="text-xs text-red-300/80">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{deletingUser.full_name || deletingUser.email}</strong> from the database? Their competency progress, leaderboard stats, and records will be removed.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 transition-all"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Add New User */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <UserPlus className="h-5 w-5 text-violet-400" />
                <h3 className="text-lg font-bold text-white">Register New Student / User</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Smith"
                    value={newUserForm.full_name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan.smith@university.edu"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">User Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  >
                    <option value="student">Student Member</option>
                    <option value="admin">Administrator</option>
                    <option value="faculty">Faculty Member</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">University / Institution</label>
                  <input
                    type="text"
                    placeholder="University Institute of Technology"
                    value={newUserForm.institution}
                    onChange={(e) => setNewUserForm({ ...newUserForm, institution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-semibold">Career Target Goal</label>
                  <input
                    type="text"
                    placeholder="Full Stack Cloud & AI Architecture"
                    value={newUserForm.careerGoal}
                    onChange={(e) => setNewUserForm({ ...newUserForm, careerGoal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/30 transition-all"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Competency Radar View */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedStudent.full_name || selectedStudent.name}</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {selectedStudent.email} · {selectedStudent.institution}
                </p>
                <p className="text-xs text-indigo-400 mt-1 font-medium">Target: {selectedStudent.careerGoal || "Software Engineer"}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <CompetencyRadar graph={selectedStudent.competencyGraph} height={280} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-medium">Avg Competency</p>
                <p className="text-lg font-bold text-indigo-400">
                  {Math.round(avgCompetency(selectedStudent.competencyGraph) * 100)}%
                </p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-medium">XP Points</p>
                <p className="text-lg font-bold text-violet-400">{selectedStudent.xp || 2150}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-medium">Streak</p>
                <p className="text-lg font-bold text-amber-400">{selectedStudent.streakDays || 5} days</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-medium">Role</p>
                <p className="text-sm font-bold text-slate-200 uppercase">{selectedStudent.role || "student"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
