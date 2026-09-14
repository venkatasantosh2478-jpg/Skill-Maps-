import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Download, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  Sliders,
  User,
  Brain,
  CalendarDays,
  Target
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { invokeAi, getMyProfile } from "@/lib/skillMap";
import { downloadTimetablePDF } from "@/lib/coursePdfGenerator";
import { cn } from "@/lib/utils";

const FOCUS_PRESETS = [
  "Python Foundations & Advanced Architecture",
  "Data Structures & Algorithms (Interview Ready)",
  "Full-Stack Web Engineering (React + Node.js)",
  "System Design & Cloud DevOps (AWS/Docker)",
  "AI, ML & Large Language Models"
];

const TIME_SLOT_OPTIONS = [
  { id: "morning", label: "Early Morning Focus (6:00 AM – 8:30 AM)", time: "6:00 AM – 8:30 AM" },
  { id: "afternoon", label: "Afternoon Deep Work (1:30 PM – 4:30 PM)", time: "1:30 PM – 4:30 PM" },
  { id: "evening", label: "Evening Post-Work (6:30 PM – 9:30 PM)", time: "6:30 PM – 9:30 PM" },
  { id: "night", label: "Late Night Intensive (9:00 PM – 11:30 PM)", time: "9:00 PM – 11:30 PM" },
  { id: "weekend", label: "Weekend Heavy + Light Weekday (Flexible)", time: "Flexible" }
];

export default function TimetableGenerator() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  // User input form state
  const [studentName, setStudentName] = useState(user?.full_name || "Alex Chen");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [durationDays, setDurationDays] = useState(7); // 7, 14, or 30 days
  const [targetSkill, setTargetSkill] = useState("Python Foundations & Advanced Architecture");
  const [preferredSlot, setPreferredSlot] = useState("evening");
  const [dailyHours, setDailyHours] = useState(2.5);
  const [conditionText, setConditionText] = useState(
    "Working a full-time 9-to-5 job and feeling low energy on weekdays after 8 PM. Complete beginner in Python and DSA. Preparing for technical interviews in 4 weeks. Need structured video lecture recommendations, active hands-on coding, and quick 15-minute recaps."
  );

  const [generating, setGenerating] = useState(false);
  const [aiCoachRationale, setAiCoachRationale] = useState(
    "Based on your 9-to-5 job constraints and fatigue after 8 PM, high-cognitive video lecture learning is scheduled between 6:30 PM – 7:30 PM. Hands-on coding labs follow immediately for 45 minutes, ending with a low-stress 15-minute recap so you retain concepts without burnout."
  );

  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem("skillsmap_adaptive_timetable");
      if (saved) return JSON.parse(saved);
    } catch {}
    return generateDefaultSchedule(user?.full_name || "Alex Chen", 7, "6:30 PM – 9:00 PM", 2.5, "Python Foundations & Advanced Architecture");
  });

  // Pomodoro Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeSessionTopic, setActiveSessionTopic] = useState("Day 1: Python Core Syntax & Memory Model");

  useEffect(() => {
    async function load() {
      const p = await getMyProfile();
      setProfile(p);
      if (p?.name && !studentName) setStudentName(p.name);
    }
    load();
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  function generateDefaultSchedule(name, daysCount, timeSlot, hours, focusTopic) {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const topics = [
      {
        topic: `${focusTopic}: Core Mental Models & Syntax`,
        activity: "Watch Chapter 1 Video Lecture (40 mins), code 3 baseline scripts, and write flash notes.",
        type: "Concept & Video",
      },
      {
        topic: `${focusTopic}: Control Flow & Data Structures`,
        activity: "Solve 4 practical exercises, inspect variable memory diagrams, and complete self-check.",
        type: "Hands-on Lab",
      },
      {
        topic: `${focusTopic}: Object-Oriented Design & Clean Patterns`,
        activity: "Build a modular OOP inventory/task system with classes, error boundaries, and tests.",
        type: "Project Build",
      },
      {
        topic: `${focusTopic}: Advanced Iterators, Generators & Async`,
        activity: "Study async/await concurrency pipelines, stream files, and benchmark memory consumption.",
        type: "Deep Dive",
      },
      {
        topic: `${focusTopic}: Integration & External APIs`,
        activity: "Connect scripts to live JSON REST endpoints with error handling and retry logic.",
        type: "System Lab",
      },
      {
        topic: `${focusTopic}: Portfolio Capstone Sprint (Part 1)`,
        activity: "Develop end-to-end full project prototype with documentation, README, and unit tests.",
        type: "Sprint Project",
      },
      {
        topic: `${focusTopic}: Spaced Review & Retrospective Assessment`,
        activity: "Take comprehensive adaptive assessment, review weak areas, and generate ATS resume bullets.",
        type: "Review & Quiz",
      },
    ];

    const result = [];
    for (let i = 0; i < daysCount; i++) {
      const dayName = daysOfWeek[i % 7];
      const topicItem = topics[i % topics.length];
      result.push({
        dayIndex: i + 1,
        day: `Day ${i + 1} (${dayName})`,
        date: new Date(Date.now() + i * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        timeSlot: timeSlot || "6:30 PM – 9:00 PM",
        allocatedHours: hours || 2.5,
        topic: topicItem.topic,
        activity: topicItem.activity,
        type: topicItem.type,
        completed: false,
      });
    }
    return result;
  }

  const handleGenerateCustomTimetable = async (e) => {
    if (e) e.preventDefault();
    setGenerating(true);

    const chosenSlotObj = TIME_SLOT_OPTIONS.find((o) => o.id === preferredSlot) || TIME_SLOT_OPTIONS[2];
    const timeSlotStr = chosenSlotObj.time;

    const prompt = `You are an AI study coach and spaced repetition scheduler.
Generate a tailored ${durationDays}-day personalized timetable.
Student Name: ${studentName}
Target Start Date: ${startDate}
Target Focus Domain: ${targetSkill}
Preferred Time Slot: ${timeSlotStr}
Daily Hours Allocated: ${dailyHours} hours
Student's Personal Condition, Work Schedule & Constraints:
"${conditionText}"

Return a strictly valid JSON object in this exact schema:
{
  "coachRationale": "2-3 sentences explaining exactly how this schedule fits the student's energy levels, work constraints, and study goals.",
  "days": [
    {
      "dayIndex": 1,
      "day": "Day 1 (DayName)",
      "timeSlot": "e.g. 6:30 PM – 9:00 PM",
      "allocatedHours": ${dailyHours},
      "topic": "Specific actionable topic title",
      "activity": "Step-by-step breakdown (e.g. 6:30-7:15 PM Watch Video Lecture, 7:15-8:30 PM Code Challenge, 8:30-9:00 PM Active Recap)",
      "type": "Concept / Code Lab / Project / Review"
    }
  ]
}
Create all ${durationDays} days. Ensure activities are realistic, specifically addressing their condition, and alternating high-intensity with active reinforcement.`;

    try {
      const aiResponse = await invokeAi({ prompt });
      if (aiResponse) {
        // Parse JSON from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.days && parsed.days.length) {
            const formatted = parsed.days.map((d, idx) => ({
              ...d,
              dayIndex: idx + 1,
              date: new Date(new Date(startDate).getTime() + idx * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              completed: false,
            }));
            setSchedule(formatted);
            if (parsed.coachRationale) setAiCoachRationale(parsed.coachRationale);
            localStorage.setItem("skillsmap_adaptive_timetable", JSON.stringify(formatted));
            setGenerating(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn("AI generation fallback:", err);
    }

    // Fallback if AI call failed or timed out
    const fallback = generateDefaultSchedule(studentName, durationDays, timeSlotStr, dailyHours, targetSkill);
    setSchedule(fallback);
    setAiCoachRationale(`Customized for ${studentName}: Designed around your ${dailyHours}h daily window (${timeSlotStr}) to systematically conquer ${targetSkill} while pacing your study energy.`);
    localStorage.setItem("skillsmap_adaptive_timetable", JSON.stringify(fallback));
    setGenerating(false);
  };

  const toggleDayCompletion = (index) => {
    const updated = [...schedule];
    updated[index].completed = !updated[index].completed;
    setSchedule(updated);
    try {
      localStorage.setItem("skillsmap_adaptive_timetable", JSON.stringify(updated));
    } catch {}
  };

  const handleDownloadPDF = () => {
    downloadTimetablePDF(schedule, dailyHours * schedule.length, targetSkill, studentName, conditionText);
  };

  const completedCount = schedule.filter((s) => s.completed).length;
  const progressPercent = schedule.length ? Math.round((completedCount / schedule.length) * 100) : 0;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-body">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              AI ADAPTIVE TIMETABLE & COACH
            </span>
            <span className="text-xs text-slate-400">· Spaced Learning & Personalized Constraints</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2.5">
            <Calendar className="h-7 w-7 text-teal-600 dark:text-teal-400" />
            Adaptive Learning Timetable
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-3xl">
            Input your real-life work schedule, target subject, preferred learning hours, and personal fatigue/exam conditions. Gemini AI will synthesize an hour-by-hour actionable study timetable.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Timetable (PDF)</span>
          </button>
        </div>
      </div>

      {/* Generator Configuration Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="h-10 w-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Personalize Your Study Schedule
            </h2>
            <p className="text-xs text-slate-400">
              Configure your specific timeframe, preferred hours, and exact background conditions.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateCustomTimetable} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-teal-600" />
                Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
                required
              />
            </div>

            {/* Target Start Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-teal-600" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
                required
              />
            </div>

            {/* Duration Plan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                Schedule Timeframe
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
              >
                <option value={7}>7-Day High-Impact Sprint</option>
                <option value={14}>14-Day Intensive Mastery</option>
                <option value={21}>21-Day Habit Formation</option>
                <option value={30}>30-Day Complete Roadmap</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Target Subject / Track */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-teal-600" />
                Target Learning Subject / Focus Domain
              </label>
              <input
                type="text"
                list="focus-presets"
                value={targetSkill}
                onChange={(e) => setTargetSkill(e.target.value)}
                placeholder="e.g. Python Foundations, React, DSA, System Design"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
                required
              />
              <datalist id="focus-presets">
                {FOCUS_PRESETS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>

            {/* Daily Hours Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-teal-600" />
                  Daily Hours
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  {dailyHours} Hours/Day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Preferred Time Slot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              Preferred Time of Day for Learning
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TIME_SLOT_OPTIONS.map((slot) => {
                const isSelected = preferredSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setPreferredSlot(slot.id)}
                    className={cn(
                      "p-3 rounded-2xl text-left border transition-all text-xs font-semibold flex items-center justify-between cursor-pointer",
                      isSelected
                        ? "bg-teal-50/90 dark:bg-teal-950/60 border-teal-500 text-teal-950 dark:text-teal-200 shadow-2xs"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    )}
                  >
                    <span>{slot.label}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Background, Condition & Constraints Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-teal-600" />
                Describe Your Personal Condition, Schedule & Constraints
              </span>
              <span className="text-[11px] font-normal text-slate-400 normal-case">
                AI customizes difficulty & energy pacing based on this text
              </span>
            </label>
            <textarea
              rows={3}
              value={conditionText}
              onChange={(e) => setConditionText(e.target.value)}
              placeholder="e.g., I work full-time 9 to 5, feel exhausted by 8 PM, complete beginner in Python, have campus exams in 3 weeks, want 2 hours daily with structured video lecture watch, coding practice, and revision before bed."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all leading-relaxed"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={generating}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>{generating ? "AI Generating Custom Timetable..." : "Generate AI Adaptive Timetable"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI Coach Rationale Callout */}
      {aiCoachRationale && (
        <div className="p-5 rounded-3xl bg-teal-500/10 dark:bg-teal-950/40 border border-teal-500/20 text-teal-950 dark:text-teal-200 flex items-start gap-4">
          <div className="h-9 w-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Brain className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              AI Study Coach Energy & Constraint Strategy
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-teal-900/90 dark:text-teal-200/90 font-medium">
              {aiCoachRationale}
            </p>
          </div>
        </div>
      )}

      {/* Timetable Progress & Pomodoro Focus Timer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Progress & Stats Card (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Plan Completion
              </h3>
              <span className="text-xs font-bold text-teal-600">
                {completedCount} / {schedule.length} Days
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200">{progressPercent}% Achieved</span>
                <span className="text-emerald-600 font-semibold">+{completedCount * 50} XP Gained</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Learner:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{studentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Commitment:</span>
                <span className="font-bold text-teal-600">{schedule.length * dailyHours} Hours Total</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Primary Skill:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]" title={targetSkill}>
                  {targetSkill}
                </span>
              </div>
            </div>
          </div>

          {/* Integrated Pomodoro Focus Timer */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
                ACTIVE FOCUS SESSION
              </span>
              <Flame className="h-4 w-4 text-amber-400 animate-pulse" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-medium">Session Focus Topic:</p>
              <h4 className="text-sm font-bold text-white truncate mt-0.5" title={activeSessionTopic}>
                {activeSessionTopic}
              </h4>
            </div>

            {/* Digital Clock display */}
            <div className="text-center py-3 bg-black/30 rounded-2xl border border-white/10">
              <span className="font-mono text-4xl font-extrabold tracking-wider text-teal-300">
                {formatTimer(timerSeconds)}
              </span>
            </div>

            {/* Timer controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer",
                  isTimerRunning ? "bg-amber-500 hover:bg-amber-600 text-slate-950" : "bg-teal-500 hover:bg-teal-600 text-slate-950"
                )}
              >
                {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isTimerRunning ? "Pause Focus" : "Start 25m Sprint"}</span>
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(25 * 60);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Day-by-Day Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Personalized Day-by-Day Learning Roadmap
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Click checkbox when done
            </span>
          </div>

          <div className="space-y-3.5">
            {schedule.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setActiveSessionTopic(item.topic)}
                  className={cn(
                    "p-5 rounded-3xl border transition-all cursor-pointer relative",
                    item.completed
                      ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60"
                      : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 shadow-xs"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDayCompletion(index);
                        }}
                        className={cn(
                          "h-7 w-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer",
                          item.completed
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "border-2 border-slate-300 dark:border-slate-700 hover:border-teal-500 text-transparent"
                        )}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {item.day}
                          </span>
                          <span className="text-[10px] text-slate-400">· {item.date}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold",
                            item.type === "Concept & Video" || item.type === "Concept" ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300" :
                            item.type === "Hands-on Lab" ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" :
                            item.type === "Sprint Project" || item.type === "Project Build" ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300" :
                            "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300"
                          )}>
                            {item.type}
                          </span>
                        </div>

                        <h3 className={cn(
                          "text-sm font-bold transition-colors",
                          item.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-100"
                        )}>
                          {item.topic}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
                          {item.activity}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        <Clock className="h-3 w-3 text-teal-500" />
                        <span>{item.timeSlot}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {item.allocatedHours} hrs
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
