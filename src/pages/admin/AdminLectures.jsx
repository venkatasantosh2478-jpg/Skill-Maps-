import React, { useState, useEffect } from "react";
import { 
  Video, 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  Download, 
  Play, 
  CheckCircle2, 
  RotateCcw,
  Film,
  X,
  Clock
} from "lucide-react";
import { 
  getStoredLectures, 
  deleteCommunityLecture, 
  updateCommunityLecture, 
  addCommunityLecture, 
  resetLecturesToDefault 
} from "@/data/lecturesData";
import { SUBJECTS_LIST } from "@/data/courseDocsData";
import { cn } from "@/lib/utils";

export default function AdminLectures() {
  const [lectures, setLectures] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Modals state
  const [previewVideo, setPreviewVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    subject: "Python Programming",
    duration: "18:30",
    embedUrl: "",
    difficulty: "Intermediate",
    eduScore: 95,
    tags: "Architecture, Memory, CPython",
    aiSummary: ""
  });

  const loadLectures = () => {
    setLectures(getStoredLectures());
  };

  useEffect(() => {
    loadLectures();
    const handleUpdate = () => loadLectures();
    window.addEventListener("skillsmap_lectures_update", handleUpdate);
    return () => window.removeEventListener("skillsmap_lectures_update", handleUpdate);
  }, []);

  // Filtered lectures
  const filtered = lectures.filter((lec) => {
    const matchesSearch = 
      lec.title.toLowerCase().includes(search.toLowerCase()) ||
      lec.instructor.toLowerCase().includes(search.toLowerCase()) ||
      lec.subject.toLowerCase().includes(search.toLowerCase()) ||
      (lec.tags && lec.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
    
    const matchesSubject = 
      selectedSubject === "all" || 
      lec.subject.toLowerCase().includes(selectedSubject.toLowerCase());

    const matchesDifficulty = 
      selectedDifficulty === "all" || 
      lec.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  // Actions
  const handleDelete = (id) => {
    deleteCommunityLecture(id);
    setDeleteConfirmId(null);
    loadLectures();
  };

  const handleOpenEdit = (lec) => {
    setEditingVideo(lec);
    setFormData({
      title: lec.title,
      instructor: lec.instructor,
      subject: lec.subject,
      duration: lec.duration,
      embedUrl: lec.embedUrl,
      difficulty: lec.difficulty || "Intermediate",
      eduScore: lec.eduScore || 95,
      tags: Array.isArray(lec.tags) ? lec.tags.join(", ") : "",
      aiSummary: lec.aiSummary || ""
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingVideo) return;

    const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
    updateCommunityLecture(editingVideo.id, {
      ...formData,
      tags: tagsArray,
      eduScore: Number(formData.eduScore) || 90
    });

    setEditingVideo(null);
    loadLectures();
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
    
    // Normalize youtube URL if user pasted standard link
    let embedUrl = formData.embedUrl;
    if (embedUrl.includes("watch?v=")) {
      const videoId = embedUrl.split("watch?v=")[1].split("&")[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    } else if (embedUrl.includes("youtu.be/")) {
      const videoId = embedUrl.split("youtu.be/")[1].split("?")[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    }

    addCommunityLecture({
      title: formData.title,
      instructor: formData.instructor,
      subject: formData.subject,
      duration: formData.duration,
      embedUrl: embedUrl || "https://www.youtube-nocookie.com/embed/rfscVS0vtbw",
      difficulty: formData.difficulty,
      eduScore: Number(formData.eduScore) || 95,
      tags: tagsArray.length > 0 ? tagsArray : ["Engineering", "Core"],
      aiSummary: formData.aiSummary || `Key Concept: Comprehensive lecture on ${formData.title}.`
    });

    setIsAddModalOpen(false);
    setFormData({
      title: "",
      instructor: "",
      subject: "Python Programming",
      duration: "18:30",
      embedUrl: "",
      difficulty: "Intermediate",
      eduScore: 95,
      tags: "Architecture, Memory, CPython",
      aiSummary: ""
    });
    loadLectures();
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Instructor", "Subject", "Difficulty", "Duration", "Views", "Likes", "EduScore", "EmbedURL"];
    const rows = lectures.map(l => [
      l.id,
      `"${(l.title || "").replace(/"/g, '""')}"`,
      `"${(l.instructor || "").replace(/"/g, '""')}"`,
      `"${(l.subject || "").replace(/"/g, '""')}"`,
      l.difficulty || "Intermediate",
      l.duration || "N/A",
      l.views || 0,
      l.likes || 0,
      l.eduScore || 0,
      l.embedUrl
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SkillsMap-Lectures-Export-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the lecture database back to the factory defaults?")) {
      resetLecturesToDefault();
      loadLectures();
    }
  };

  const totalViews = lectures.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const avgScore = lectures.length > 0 ? Math.round(lectures.reduce((acc, curr) => acc + (curr.eduScore || 0), 0) / lectures.length) : 0;

  return (
    <div className="space-y-8 font-body">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5 text-violet-400" />
              PORTAL VIDEO VAULT & CMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2.5">
            <Video className="h-8 w-8 text-violet-400" />
            Video Lectures & Moderation
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Manage, edit, review AI educational scores, or delete curriculum video lectures. Changes synchronize in real time with the Student Portal.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 cursor-pointer transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Lecture</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
            title="Reset Video Database"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Lectures</span>
          <p className="text-2xl font-extrabold text-white font-heading">{lectures.length}</p>
          <span className="text-[11px] text-violet-400 font-medium">Curriculum library</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Views</span>
          <p className="text-2xl font-extrabold text-white font-heading">{totalViews.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 font-medium">Student engagements</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Quality Score</span>
          <p className="text-2xl font-extrabold text-amber-400 font-heading">{avgScore}%</p>
          <span className="text-[11px] text-slate-400 font-medium">AI Verified rating</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subjects Covered</span>
          <p className="text-2xl font-extrabold text-white font-heading">{SUBJECTS_LIST.length}</p>
          <span className="text-[11px] text-cyan-400 font-medium">Full-stack & Systems</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, instructor, subject, or technology tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Subjects</option>
            <option value="python">Python Programming</option>
            <option value="java">Java & OOP</option>
            <option value="dsa">Data Structures & Algo</option>
            <option value="web">Full-Stack Web</option>
            <option value="devops">DevOps & Cloud</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                viewMode === "table" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                viewMode === "grid" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Lectures Content Area */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <Film className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Video Lectures Match Your Criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the filters to view all available lectures.
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* Table Layout */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-5">Lecture Video & Subject</th>
                  <th className="py-4 px-4">Instructor</th>
                  <th className="py-4 px-4">Duration & Level</th>
                  <th className="py-4 px-4 text-center">Quality Score</th>
                  <th className="py-4 px-4 text-center">Views</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map((lec) => (
                  <tr key={lec.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => setPreviewVideo(lec)}
                          className="relative h-12 w-20 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center group/thumb hover:border-violet-500 transition-colors"
                        >
                          <Play className="h-4 w-4 text-violet-400 fill-violet-400 group-hover/thumb:scale-110 transition-transform" />
                        </button>
                        <div className="space-y-1">
                          <button
                            onClick={() => setPreviewVideo(lec)}
                            className="font-bold text-white hover:text-violet-300 text-left line-clamp-1 transition-colors"
                          >
                            {lec.title}
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">
                              {lec.subject}
                            </span>
                            {lec.isAiVerified && (
                              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                AI Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {lec.instructor}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{lec.duration}</span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded inline-block",
                        lec.difficulty === "Advanced" ? "bg-rose-500/20 text-rose-300" :
                        lec.difficulty === "Intermediate" ? "bg-amber-500/20 text-amber-300" :
                        "bg-emerald-500/20 text-emerald-300"
                      )}>
                        {lec.difficulty || "Intermediate"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {lec.eduScore || 95}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center text-slate-400">
                      {(lec.views || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewVideo(lec)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Preview Video"
                        >
                          <Play className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(lec)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-violet-300 transition-colors"
                          title="Edit Video"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(lec.id)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors"
                          title="Delete Video"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lec) => (
            <div key={lec.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between gap-4 group hover:border-violet-500/40 transition-all">
              <div className="space-y-3">
                {/* Embed Preview Frame */}
                <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                  <iframe
                    src={lec.embedUrl}
                    title={lec.title}
                    className="w-full h-full pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                  <button
                    onClick={() => setPreviewVideo(lec)}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-lg">
                      <Play className="h-5 w-5 fill-white ml-0.5" />
                    </div>
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                      {lec.subject}
                    </span>
                    <span className="text-xs font-extrabold text-amber-400">
                      ★ {lec.eduScore}%
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {lec.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Instructor: {lec.instructor} · {lec.duration}
                  </p>
                </div>

                {lec.aiSummary && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                    {lec.aiSummary}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500">{(lec.views || 0).toLocaleString()} views</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(lec)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="h-3 w-3 text-violet-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(lec.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">{previewVideo.subject}</span>
                <h3 className="text-base font-bold text-white">{previewVideo.title}</h3>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
              <iframe
                src={previewVideo.embedUrl}
                title={previewVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p><strong>Instructor:</strong> {previewVideo.instructor} | <strong>Duration:</strong> {previewVideo.duration} | <strong>Quality Score:</strong> {previewVideo.eduScore}%</p>
              {previewVideo.aiSummary && <p className="text-slate-400"><strong>AI Synthesis:</strong> {previewVideo.aiSummary}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div className="h-12 w-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Permanently Delete Video?</h3>
            <p className="text-xs text-slate-400">
              This action will remove this video lecture from the community repository and student learning track immediately.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Yes, Delete Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Video Modal */}
      {(isAddModalOpen || editingVideo) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Film className="h-5 w-5 text-violet-400" />
                <span>{editingVideo ? "Edit Video Lecture" : "Add Verified Video Lecture"}</span>
              </h3>
              <button
                onClick={() => {
                  setEditingVideo(null);
                  setIsAddModalOpen(false);
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={editingVideo ? handleSaveEdit : handleAddNew} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Lecture Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Python Memory Architecture & CPython Internals"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Instructor Name / Channel</label>
                  <input
                    type="text"
                    required
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    placeholder="e.g. Corey Schafer / MIT OpenCourseWare"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Curriculum Subject Track</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Python Programming">Python Programming</option>
                    <option value="Java & OOP Engineering">Java & OOP Engineering</option>
                    <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                    <option value="Full-Stack Web (React & Node)">Full-Stack Web (React & Node)</option>
                    <option value="DevOps & Cloud Systems">DevOps & Cloud Systems</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Video Embed URL (or YouTube Link)</label>
                <input
                  type="text"
                  required
                  value={formData.embedUrl}
                  onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or embed link"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="24:15"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Quality Score (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formData.eduScore}
                    onChange={(e) => setFormData({ ...formData, eduScore: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Technology Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Heap Memory, Garbage Collection, CPython"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">AI Educational Synthesis / Key Takeaway</label>
                <textarea
                  rows={3}
                  value={formData.aiSummary}
                  onChange={(e) => setFormData({ ...formData, aiSummary: e.target.value })}
                  placeholder="Key Concept Takeaway: Deep explanation of core concepts discussed in this video..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingVideo(null);
                    setIsAddModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30"
                >
                  {editingVideo ? "Save Changes" : "Publish Lecture"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
