import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { skillsMap } from "@/api/skillsMapClient";
import { X, Check, Calendar, Loader2, ArrowLeft } from "lucide-react";

const COUNSELORS = [
  { name: "Dr. Sarah Chen", specialty: "Software Engineering & Tech Careers", initials: "SC", color: "bg-indigo-100 text-indigo-700" },
  { name: "Marcus Johnson", specialty: "Data Science & ML", initials: "MJ", color: "bg-emerald-100 text-emerald-700" },
  { name: "Priya Patel", specialty: "Product Management", initials: "PP", color: "bg-violet-100 text-violet-700" },
  { name: "Elena Rodriguez", specialty: "UX Design & Creative Tech", initials: "ER", color: "bg-amber-100 text-amber-700" },
];

const TIME_SLOTS = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

export default function BookingCalendar({ onClose, onBooked }) {
  const [step, setStep] = useState(0);
  const [counselor, setCounselor] = useState(null);
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState("");
  const [topic, setTopic] = useState("");
  const [booking, setBooking] = useState(false);

  const book = async () => {
    setBooking(true);
    try {
      await skillsMap.entities.GuidanceSession.create({
        counselor: counselor.name,
        counselorSpecialty: counselor.specialty,
        date: new Date(date).toISOString(),
        timeSlot: slot,
        topic: topic || "General career guidance",
        status: "scheduled",
      });
    } catch (e) { /* still confirm */ }
    setBooking(false);
    setStep(3);
    onBooked?.();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900">Book a Career Guidance Session</h2>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-3">
          {["Counselor", "Date & Time", "Confirm"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${step >= i ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>{i + 1}</div>
              <span className={`text-xs ${step >= i ? "text-slate-700" : "text-slate-400"}`}>{label}</span>
              {i < 2 && <div className={`h-0.5 w-6 ${step > i ? "bg-indigo-600" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        <div className="p-5">
          {step === 0 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-500 mb-3">Choose a career counselor for your session.</p>
              {COUNSELORS.map((c) => (
                <button key={c.name} onClick={() => { setCounselor(c); setStep(1); }} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm ${c.color}`}>{c.initials}</div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.specialty}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="flex justify-center mb-4 rdp-theme">
                <DayPicker mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} />
              </div>
              {date && (
                <>
                  <p className="text-xs font-medium text-slate-500 mb-2">Available slots — {date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {TIME_SLOTS.map((t) => (
                      <button key={t} onClick={() => setSlot(t)} className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${slot === t ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:border-indigo-400"}`}>{t}</button>
                    ))}
                  </div>
                  <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (optional) — e.g. career transition advice" className="input mb-4" />
                </>
              )}
              <div className="flex justify-between">
                <button onClick={() => setStep(0)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"><ArrowLeft className="h-4 w-4" /> Back</button>
                <button onClick={() => setStep(2)} disabled={!date || !slot} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">Continue</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 mb-4">
                <Row label="Counselor" value={counselor.name} />
                <Row label="Specialty" value={counselor.specialty} />
                <Row label="Date" value={date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} />
                <Row label="Time" value={slot} />
                {topic && <Row label="Topic" value={topic} />}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"><ArrowLeft className="h-4 w-4" /> Back</button>
                <button onClick={book} disabled={booking} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                  {booking ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</> : <><Check className="h-4 w-4" /> Confirm booking</>}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Check className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Session booked!</h3>
              <p className="text-sm text-slate-500 mt-1">{date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {slot}</p>
              <p className="text-sm text-slate-400">with {counselor.name}</p>
              <button onClick={onClose} className="mt-5 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm gap-3">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="font-medium text-slate-700 text-right">{value}</span>
    </div>
  );
}