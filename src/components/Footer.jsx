import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  Settings, 
  ChevronRight,
  Headphones
} from "lucide-react";
import { getFooterSettings } from "@/lib/footerSettings";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export default function Footer({ className = "" }) {
  const [settings, setSettings] = useState(getFooterSettings());
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getFooterSettings());
    };
    window.addEventListener("skillsmap_footer_update", handleUpdate);
    return () => window.removeEventListener("skillsmap_footer_update", handleUpdate);
  }, []);

  return (
    <footer className={cn("w-full bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors duration-200 mt-auto shrink-0", className)}>
      {/* Top Banner / Accreditation Ribbon */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-medium text-slate-300">
              {settings.accreditationNote}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-300/90 font-medium">
              <Headphones className="h-3.5 w-3.5" />
              <span>{settings.emergencyHelpline}</span>
            </span>
            {isAdmin && (
              <Link
                to="/admin/overview"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-600/30 hover:bg-violet-600 text-violet-200 hover:text-white text-[11px] font-semibold border border-violet-500/40 transition-colors"
                title="Edit footer contact details in Admin Dashboard"
              >
                <Settings className="h-3 w-3" />
                <span>Edit in Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand & Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-white text-xl tracking-tight">SkillsMap</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
                <p className="text-[11px] text-slate-400 font-medium">Competency & Career Intelligence</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.tagline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Verified Curriculum
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 font-medium">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                24/7 AI Tutors
              </span>
            </div>
          </div>

          {/* Col 2: Direct Contact & Office (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-400" />
              Contact & Campus Office
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-3 group">
                <MapPin className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 shrink-0 mt-0.5 transition-colors" />
                <div>
                  <p className="text-slate-200 font-medium">{settings.campusLocation}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{settings.officeAddress}</p>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <a 
                    href={`mailto:${settings.supportEmail}`} 
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors underline-offset-2 hover:underline"
                  >
                    {settings.supportEmail}
                  </a>
                  <span className="text-slate-600">·</span>
                  <a 
                    href={`mailto:${settings.admissionsEmail}`} 
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Admissions
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <a 
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} 
                    className="text-slate-200 hover:text-indigo-300 font-medium transition-colors"
                  >
                    {settings.phone}
                  </a>
                  <span className="text-slate-600">·</span>
                  <a 
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    <MessageSquare className="h-3 w-3" />
                    WhatsApp
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="text-xs text-slate-400">{settings.operatingHours}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Portals & Curriculum Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Student Portals
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/student-lectures" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Peer Video Vault
                </Link>
              </li>
              <li>
                <Link to="/course-docs" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Course Handbooks
                </Link>
              </li>
              <li>
                <Link to="/timetable" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  AI Timetable
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Global Rankings
                </Link>
              </li>
              <li>
                <Link to="/resume-generator" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  ATS Resume Builder
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Tools (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Community & Career
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/idea-analyzer" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Idea Match & Squads
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Hackathons & Events
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  1:1 Mentor Booking
                </Link>
              </li>
              <li>
                <Link to="/freelance" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Freelance Contracts
                </Link>
              </li>
              <li>
                <Link to="/system-docs" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  System Docs & Reports
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Terms, Socials */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            {settings.copyrightText}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link to="/system-docs" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/system-docs" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link to="/system-docs" className="hover:text-slate-300 transition-colors">Honor Code</Link>
            <span>·</span>
            <a 
              href="mailto:support@skillsmap.io" 
              className="hover:text-indigo-400 transition-colors font-medium"
            >
              Direct Helpdesk
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
