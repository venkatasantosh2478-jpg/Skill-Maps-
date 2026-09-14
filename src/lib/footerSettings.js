// Global Footer & Institutional Contact Configuration Store

const STORAGE_KEY = "skillsmap_footer_settings";

export const DEFAULT_FOOTER_SETTINGS = {
  organizationName: "SkillsMap Competency & Career Intelligence",
  tagline: "Empowering next-generation engineers with adaptive AI curriculum, peer video knowledge vaults, and real-world career telemetry.",
  supportEmail: "support@skillsmap.io",
  admissionsEmail: "admissions@skillsmap.io",
  adminContactEmail: "santosh.admin@skillsmap.io",
  phone: "+1 (800) 555-0199",
  whatsapp: "+1 (555) 019-2834",
  emergencyHelpline: "+1 (888) 992-4357 (24/7 Student Career Hotline)",
  officeAddress: "SkillsMap Academic Innovation Complex, 450 Innovation Parkway, Suite 800, Silicon Valley, CA 94025",
  campusLocation: "Building B, Higher Education Research & Engineering Labs",
  operatingHours: "Monday – Friday: 8:00 AM – 8:00 PM EST (AI Tutor Available 24/7)",
  copyrightText: "© 2026 SkillsMap Platform Inc. All rights reserved. Powered by Google Gemini AI.",
  accreditationNote: "Accredited Higher Education Engineering & Competency Verification Standards Board",
  socialLinks: {
    github: "https://github.com/skillsmap",
    linkedin: "https://linkedin.com/company/skillsmap",
    discord: "https://discord.gg/skillsmap",
    youtube: "https://youtube.com/@skillsmap-edu",
    twitter: "https://twitter.com/skillsmap_app"
  },
  quickLinks: [
    { label: "Competency Dashboard", to: "/dashboard" },
    { label: "Course Study Notes & PDF", to: "/course-docs" },
    { label: "Student Video Lectures", to: "/student-lectures" },
    { label: "Adaptive Timetable", to: "/timetable" },
    { label: "Competitive Leaderboard", to: "/leaderboard" },
    { label: "Hackathons & Contests", to: "/events" },
    { label: "1:1 Mentorship Hub", to: "/mentorship" },
    { label: "Career Roadmap & AI Scope", to: "/roadmap" }
  ]
};

export function getFooterSettings() {
  if (typeof window === "undefined") return DEFAULT_FOOTER_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FOOTER_SETTINGS;
    return { ...DEFAULT_FOOTER_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_FOOTER_SETTINGS;
  }
}

export function saveFooterSettings(updatedSettings) {
  if (typeof window === "undefined") return updatedSettings;
  try {
    const merged = { ...getFooterSettings(), ...updatedSettings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent("skillsmap_footer_update", { detail: merged }));
    return merged;
  } catch (e) {
    console.error("Failed to save footer settings:", e);
    return updatedSettings;
  }
}

export function resetFooterSettings() {
  if (typeof window === "undefined") return DEFAULT_FOOTER_SETTINGS;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("skillsmap_footer_update", { detail: DEFAULT_FOOTER_SETTINGS }));
    return DEFAULT_FOOTER_SETTINGS;
  } catch (e) {
    return DEFAULT_FOOTER_SETTINGS;
  }
}
