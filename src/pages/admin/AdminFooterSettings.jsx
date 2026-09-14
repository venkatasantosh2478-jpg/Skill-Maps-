import React, { useState, useEffect } from "react";
import { 
  Building, 
  Mail, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Globe, 
  MessageSquare,
  Eye,
  AlertCircle
} from "lucide-react";
import { getFooterSettings, saveFooterSettings, resetFooterSettings } from "@/lib/footerSettings";

export default function AdminFooterSettings() {
  const [formData, setFormData] = useState(getFooterSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("contact"); // 'contact', 'office', 'branding', 'socials'

  useEffect(() => {
    setFormData(getFooterSettings());
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (network, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveFooterSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the footer and contact details to factory default institutional settings?")) {
      const reset = resetFooterSettings();
      setFormData(reset);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">Footer & Contact Settings</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Live Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Edit global support channels, campus office address, phone numbers, and emergency hotlines displayed across the entire platform footer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/25 transition-all"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Footer Details</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-emerald-300">Footer details updated successfully!</span>
            <span className="ml-1 text-emerald-400/80">Changes are now live across all student dashboard pages and public footers.</span>
          </div>
        </div>
      )}

      {/* Nav Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: "contact", label: "Support & Contacts", icon: Mail },
          { id: "office", label: "Campus & Location", icon: Building },
          { id: "branding", label: "Branding & Legal", icon: ShieldCheck },
          { id: "socials", label: "Socials & Community", icon: Globe }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                active
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Support & Contacts */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-400" />
                Primary Support Email
              </label>
              <input
                type="email"
                value={formData.supportEmail || ""}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
                placeholder="support@skillsmap.io"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500">General student inquiry and technical helpdesk inbox.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-400" />
                Admissions & Faculty Email
              </label>
              <input
                type="email"
                value={formData.admissionsEmail || ""}
                onChange={(e) => handleChange("admissionsEmail", e.target.value)}
                placeholder="admissions@skillsmap.io"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500">University admissions and corporate sponsorship inquiries.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-indigo-400" />
                Toll-Free Phone Support
              </label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 (800) 555-0199"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500">Clickable phone number formatted for instant mobile dialing.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                WhatsApp Direct Support Number
              </label>
              <input
                type="text"
                value={formData.whatsapp || ""}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500">Opens WhatsApp chat directly for international student queries.</p>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                24/7 Emergency Student Helpline
              </label>
              <input
                type="text"
                value={formData.emergencyHelpline || ""}
                onChange={(e) => handleChange("emergencyHelpline", e.target.value)}
                placeholder="+1 (888) 992-4357 (24/7 Student Career Hotline)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500">Prominently shown in top footer ribbon for round-the-clock urgent assistance.</p>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                Operating & Helpdesk Hours
              </label>
              <input
                type="text"
                value={formData.operatingHours || ""}
                onChange={(e) => handleChange("operatingHours", e.target.value)}
                placeholder="Monday – Friday: 8:00 AM – 8:00 PM EST (Live Chat 24/7)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Campus & Location */}
        {activeTab === "office" && (
          <div className="space-y-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-indigo-400" />
                Campus Facility / Laboratory Name
              </label>
              <input
                type="text"
                value={formData.campusLocation || ""}
                onChange={(e) => handleChange("campusLocation", e.target.value)}
                placeholder="Building B, Higher Education Research & Engineering Labs"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-indigo-400" />
                Full Physical Address
              </label>
              <textarea
                rows={3}
                value={formData.officeAddress || ""}
                onChange={(e) => handleChange("officeAddress", e.target.value)}
                placeholder="SkillsMap Academic Innovation Complex, 450 Innovation Parkway, Suite 800, Silicon Valley, CA 94025"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Branding & Legal */}
        {activeTab === "branding" && (
          <div className="space-y-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Organization Title</label>
              <input
                type="text"
                value={formData.organizationName || ""}
                onChange={(e) => handleChange("organizationName", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Footer Tagline & Mission Statement</label>
              <textarea
                rows={2}
                value={formData.tagline || ""}
                onChange={(e) => handleChange("tagline", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Accreditation Ribbon Note</label>
                <input
                  type="text"
                  value={formData.accreditationNote || ""}
                  onChange={(e) => handleChange("accreditationNote", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Copyright Statement</label>
                <input
                  type="text"
                  value={formData.copyrightText || ""}
                  onChange={(e) => handleChange("copyrightText", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Socials & Community */}
        {activeTab === "socials" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">GitHub Organization Link</label>
              <input
                type="text"
                value={formData.socialLinks?.github || ""}
                onChange={(e) => handleSocialChange("github", e.target.value)}
                placeholder="https://github.com/skillsmap"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">LinkedIn Community Link</label>
              <input
                type="text"
                value={formData.socialLinks?.linkedin || ""}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/company/skillsmap"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Discord Student Server</label>
              <input
                type="text"
                value={formData.socialLinks?.discord || ""}
                onChange={(e) => handleSocialChange("discord", e.target.value)}
                placeholder="https://discord.gg/skillsmap"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">YouTube Channel</label>
              <input
                type="text"
                value={formData.socialLinks?.youtube || ""}
                onChange={(e) => handleSocialChange("youtube", e.target.value)}
                placeholder="https://youtube.com/@skillsmap-edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Live Preview Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Live Footer Contact Preview
            </h3>
            <span className="text-[11px] text-slate-500">Live preview reflects active configuration</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-medium">{formData.accreditationNote}</span>
              <span className="text-amber-300 font-medium">{formData.emergencyHelpline}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <p className="font-semibold text-white">{formData.organizationName}</p>
                <p className="text-[11px] text-slate-400 mt-1">{formData.tagline}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Contact Channels</p>
                <p className="text-indigo-400 mt-1">{formData.supportEmail}</p>
                <p className="text-slate-300">{formData.phone}</p>
                <p className="text-emerald-400 font-medium">WhatsApp: {formData.whatsapp}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Campus Location</p>
                <p className="text-slate-300 mt-1">{formData.campusLocation}</p>
                <p className="text-[11px] text-slate-400">{formData.officeAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-600/30 transition-all hover:scale-[1.01]"
          >
            <Save className="h-4 w-4" />
            <span>Save & Broadcast Footer Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
}
