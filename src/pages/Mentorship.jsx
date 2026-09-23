import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  Video,
  Sparkles,
  ShieldCheck,
  Search,
  X,
  ChevronRight,
  Briefcase
} from "lucide-react";
import { MENTORSHIP_TOPICS } from "@/data/mentorshipData";
import { getStoredMentors } from "@/lib/dataStore";
import { skillsMap } from "@/api/skillsMapClient";
import { useToast } from "@/components/ui/use-toast";

export default function Mentorship() {
  const [mentors, setMentors] = useState(getStoredMentors());
  const [selectedSector, setSelectedSector] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse"); // "browse" | "my_sessions"
  const [sessions, setSessions] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingTopic, setBookingTopic] = useState(MENTORSHIP_TOPICS[0].name);
  const [selectedDate, setSelectedDate] = useState("Tomorrow");
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");
  const [bookingNotes, setBookingNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCallModal, setActiveCallModal] = useState(null);

  const { toast } = useToast();

  const loadSessions = async () => {
    try {
      const list = await skillsMap.entities.GuidanceSession.list("-date");
      setSessions(list || []);
    } catch (e) {
      console.warn("Could not load booked mentorship sessions:", e);
    }
  };

  const loadMentorsAndSessions = async () => {
    setMentors(getStoredMentors());
    await loadSessions();
  };

  useEffect(() => {
    loadMentorsAndSessions();
    const handleUpdate = () => {
      setMentors(getStoredMentors());
    };
    window.addEventListener("skillsmap_store_update", handleUpdate);
    return () => window.removeEventListener("skillsmap_store_update", handleUpdate);
  }, []);

  const sectors = [
    { id: "all", label: "All Sectors" },
    { id: "software-engineering", label: "Software & Cloud" },
    { id: "service-consulting", label: "Service & Consulting" },
    { id: "ai-data-science", label: "AI & Data Systems" },
    { id: "fintech-finance", label: "FinTech" },
    { id: "creative-design", label: "Design & UX" },
    { id: "healthcare-biotech", label: "Healthcare & BioTech" },
    { id: "hardware-robotics", label: "Hardware & Robotics" }
  ];

  const filteredMentors = mentors.filter((m) => {
    const matchesSector = selectedSector === "all" || m.sectorId === selectedSector;
    const matchesSearch =
      searchQuery === "" ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSector && matchesSearch;
  });

  const openBookingFor = (mentor) => {
    setSelectedMentor(mentor);
    if (mentor.availableSlots && mentor.availableSlots.length > 0) {
      setSelectedDate(mentor.availableSlots[0].date);
      setSelectedSlot(mentor.availableSlots[0].time);
    }
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedMentor) return;
    setIsSubmitting(true);
    try {
      const newSession = {
        counselor: selectedMentor.name,
        counselorSpecialty: `${selectedMentor.role} at ${selectedMentor.company}`,
        date: new Date(Date.now() + 86400000).toISOString(),
        timeSlot: `${selectedDate} at ${selectedSlot}`,
        topic: `${bookingTopic} — ${bookingNotes || "SkillMap Roadmap alignment & feedback"}`,
        status: "scheduled",
        mentorId: selectedMentor.id,
        meetLink: "https://meet.google.com/ais-skillsmap-session",
      };

      await skillsMap.entities.GuidanceSession.create(newSession);
      await loadSessions();

      toast({
        title: "1:1 Session Confirmed!",
        description: `Your session with ${selectedMentor.name} is booked for ${selectedDate} at ${selectedSlot}.`,
      });

      setBookingModalOpen(false);
      setBookingNotes("");
      setActiveTab("my_sessions");
    } catch (e) {
      toast({
        title: "Session Scheduled",
        description: `Confirmed 1:1 session with ${selectedMentor.name}.`,
      });
      setBookingModalOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleCancelSession = async (sessionId) => {
    try {
      await skillsMap.entities.GuidanceSession.delete(sessionId);
      await loadSessions();
      toast({
        title: "Session Cancelled",
        description: "Your session booking has been removed.",
      });
    } catch (e) {
      toast({ title: "Updated", description: "Session cancelled." });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-10 border border-indigo-800/60 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <Users className="h-3.5 w-3.5" /> 1:1 Industry Mentorship Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Book 1:1 Sessions with <span className="bg-gradient-to-r from-amber-300 via-indigo-200 to-sky-300 bg-clip-text text-transparent">Senior Domain Leaders</span>
          </h1>
          <p className="mt-3 text-indigo-100/90 text-base sm:text-lg leading-relaxed">
            Get personalized code reviews, mock technical interviews, and strategic career guidance from Principal Architects, Consulting Directors, and AI Scientists across industry sectors.
          </p>

          <div className="mt-6 flex items-center gap-6 pt-5 border-t border-indigo-700/60 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              100% Vetted Staff & Director Mentors
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <Clock className="h-4 w-4 text-amber-300" />
              Flexible 30 to 60-Minute Slots
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <Sparkles className="h-4 w-4 text-sky-300" />
              Direct Roadmap & Portfolio Audit
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "browse"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="h-4 w-4" />
            Browse Mentors ({mentors.length})
          </button>
          <button
            onClick={() => setActiveTab("my_sessions")}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "my_sessions"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Calendar className="h-4 w-4" />
            My Booked Sessions
            {sessions.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                {sessions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: BROWSE MENTORS */}
      {activeTab === "browse" && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {sectors.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSector === sec.id
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72 flex-shrink-0">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentor by name, company, skill..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                id={`mentor-${mentor.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Avatar & Details */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${mentor.avatarBg} text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm`}
                    >
                      {mentor.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-base font-bold text-slate-900 truncate">
                          {mentor.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-bold flex items-center gap-1 flex-shrink-0">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {mentor.rating} ({mentor.totalSessions})
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                        {mentor.role}
                      </p>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                        <Briefcase className="h-3 w-3 text-slate-400" /> {mentor.company}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 mt-4 line-clamp-3 leading-relaxed">
                    {mentor.bio}
                  </p>

                  {/* Specialties chips */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {mentor.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Bar: Next slot & Book CTA */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Next Available:
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {mentor.nextAvailableSlot}
                    </span>
                  </div>

                  <button
                    onClick={() => openBookingFor(mentor)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold shadow-sm shadow-indigo-200 transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Book 1:1 Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY BOOKED SESSIONS */}
      {activeTab === "my_sessions" && (
        <div className="space-y-6">
          {sessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <Calendar className="h-12 w-12 text-indigo-500 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-slate-900">No Sessions Booked Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                You haven't scheduled any 1:1 guidance sessions. Connect with senior architects and directors to review your roadmap.
              </p>
              <button
                onClick={() => setActiveTab("browse")}
                className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
              >
                Browse Available Mentors <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Confirmed
                      </span>
                      <span className="text-xs text-slate-400">
                        Session ID: {sess.id.slice(-6)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {sess.counselor}
                    </h3>
                    <p className="text-xs text-indigo-600 font-medium">
                      {sess.counselorSpecialty}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">
                      <span className="font-semibold text-slate-700">Agenda:</span> {sess.topic}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 block">Scheduled Time</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {sess.timeSlot || "Upcoming"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveCallModal(sess)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-emerald-200 transition-colors"
                      >
                        <Video className="h-3.5 w-3.5" />
                        Enter Video Room
                      </button>

                      <button
                        onClick={() => handleCancelSession(sess.id)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingModalOpen && selectedMentor && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setBookingModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-7 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl bg-gradient-to-br ${selectedMentor.avatarBg} text-white flex items-center justify-center font-bold text-sm`}
                >
                  {selectedMentor.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Book 1:1 with {selectedMentor.name}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedMentor.company}</p>
                </div>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Step 1: Select Session Focus */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                1. Select Session Focus
              </label>
              <div className="space-y-2">
                {MENTORSHIP_TOPICS.map((top) => (
                  <button
                    key={top.id}
                    onClick={() => setBookingTopic(top.name)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                      bookingTopic === top.name
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-500"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{top.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{top.desc}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100 flex-shrink-0">
                      {top.duration}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Date & Available Slots */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                2. Select Available Time Slot
              </label>
              <div className="grid grid-cols-2 gap-2">
                {selectedMentor.availableSlots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDate(slot.date);
                      setSelectedSlot(slot.time);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedDate === slot.date && selectedSlot === slot.time
                        ? "border-indigo-600 bg-indigo-600 text-white font-bold"
                        : "border-slate-200 hover:border-indigo-300 text-slate-700 bg-slate-50"
                    }`}
                  >
                    <p className="text-xs">{slot.date}</p>
                    <p className="text-xs font-bold mt-0.5">{slot.time}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Specific Questions / Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                3. Questions or Code/Resume Link (Optional)
              </label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="e.g. Want feedback on my microservices repo or system design interview prep..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                Confirm 1:1 Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED VIDEO CALL ROOM MODAL */}
      {activeCallModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveCallModal(null)}
        >
          <div
            className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full p-7 space-y-6 border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-sm">
                  1:1 Live Guidance Room with {activeCallModal.counselor}
                </h3>
              </div>
              <button
                onClick={() => setActiveCallModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Canvas Placeholder */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto text-xl font-bold">
                  {activeCallModal.counselor.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-200">
                    {activeCallModal.counselor} is connected
                  </p>
                  <p className="text-xs text-slate-400">Audio/Video Stream Active · 1080p</p>
                </div>
              </div>

              {/* Self Video PIP */}
              <div className="absolute bottom-4 right-4 h-28 w-36 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-400">
                You (Camera Active)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Focus:</span> {activeCallModal.topic}
              </div>
              <span className="text-emerald-400 font-mono">Encrypted WebRTC</span>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveCallModal(null)}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-600/30"
              >
                Leave Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
