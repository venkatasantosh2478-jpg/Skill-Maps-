// Centralized Data Store with LocalStorage Persistence
// Supports dynamic adding, editing, and deleting from the Admin Panel
// Automatically hydrates initial seed datasets if not already stored.

import { SECTORS_DATA } from "@/data/sectorsData";
import { INITIAL_MENTORS } from "@/data/mentorshipData";
import { INITIAL_EVENTS } from "@/data/eventsData";
import { INITIAL_FREELANCE_GIGS } from "@/data/freelanceData";

const STORAGE_KEYS = {
  SECTORS: "skillsmap_sectors",
  MENTORS: "skillsmap_mentors",
  EVENTS: "skillsmap_events",
  FREELANCE: "skillsmap_freelance",
  APPLICATIONS: "skillsmap_freelance_applications",
  EVENT_REGISTRATIONS: "skillsmap_event_registrations",
  EVENT_TEAMS: "skillsmap_event_teams",
  STUDENT_OPPORTUNITIES: "skillsmap_student_opportunities",
  STUDENT_PROJECTS: "skillsmap_student_projects",
  STUDENT_REMINDERS: "skillsmap_student_reminders",
  PEER_TALENT: "skillsmap_peer_talent",
  TEAM_INVITATIONS: "skillsmap_team_invitations",
  IDEA_ANALYSES: "skillsmap_idea_analyses",
  STUDENT_CERTIFICATES: "skillsmap_student_certificates",
};

function readStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function writeStorage(key, data) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom storage event so other open components in the same tab update immediately
    window.dispatchEvent(new CustomEvent("skillsmap_store_update", { detail: { key } }));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// ----------------- SECTORS -----------------
export function getStoredSectors() {
  return readStorage(STORAGE_KEYS.SECTORS, SECTORS_DATA);
}

export function saveStoredSector(sector) {
  const list = getStoredSectors();
  const existingIdx = list.findIndex((s) => s.id === sector.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = { ...updated[existingIdx], ...sector, updatedAt: new Date().toISOString() };
  } else {
    const newSector = {
      ...sector,
      id: sector.id || `sector_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updated = [newSector, ...list];
  }
  writeStorage(STORAGE_KEYS.SECTORS, updated);
  return updated;
}

export function deleteStoredSector(id) {
  const list = getStoredSectors();
  const updated = list.filter((s) => s.id !== id);
  writeStorage(STORAGE_KEYS.SECTORS, updated);
  return updated;
}

// ----------------- MENTORS -----------------
export function getStoredMentors() {
  return readStorage(STORAGE_KEYS.MENTORS, INITIAL_MENTORS);
}

export function saveStoredMentor(mentor) {
  const list = getStoredMentors();
  const existingIdx = list.findIndex((m) => m.id === mentor.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = { ...updated[existingIdx], ...mentor, updatedAt: new Date().toISOString() };
  } else {
    const newMentor = {
      ...mentor,
      id: mentor.id || `mentor_${Date.now()}`,
      rating: mentor.rating || 5.0,
      totalSessions: mentor.totalSessions || 0,
      initials: mentor.initials || (mentor.name ? mentor.name.split(" ").map(n => n[0]).join("") : "M"),
      createdAt: new Date().toISOString(),
    };
    updated = [newMentor, ...list];
  }
  writeStorage(STORAGE_KEYS.MENTORS, updated);
  return updated;
}

export function deleteStoredMentor(id) {
  const list = getStoredMentors();
  const updated = list.filter((m) => m.id !== id);
  writeStorage(STORAGE_KEYS.MENTORS, updated);
  return updated;
}

// ----------------- EVENTS / HACKATHONS -----------------
export function getStoredEvents() {
  return readStorage(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
}

export function saveStoredEvent(event) {
  const list = getStoredEvents();
  const existingIdx = list.findIndex((e) => e.id === event.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = { ...updated[existingIdx], ...event, updatedAt: new Date().toISOString() };
  } else {
    const newEvent = {
      ...event,
      id: event.id || `event_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: event.status || "Registration Open",
    };
    updated = [newEvent, ...list];
  }
  writeStorage(STORAGE_KEYS.EVENTS, updated);
  return updated;
}

export function deleteStoredEvent(id) {
  const list = getStoredEvents();
  const updated = list.filter((e) => e.id !== id);
  writeStorage(STORAGE_KEYS.EVENTS, updated);
  return updated;
}

// ----------------- FREELANCING GIGS -----------------
export function getStoredFreelanceGigs() {
  return readStorage(STORAGE_KEYS.FREELANCE, INITIAL_FREELANCE_GIGS);
}

export function saveStoredFreelanceGig(gig) {
  const list = getStoredFreelanceGigs();
  const existingIdx = list.findIndex((g) => g.id === gig.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = { ...updated[existingIdx], ...gig, updatedAt: new Date().toISOString() };
  } else {
    const newGig = {
      ...gig,
      id: gig.id || `gig_${Date.now()}`,
      postedDate: "Just now",
      proposalsCount: 0,
      status: gig.status || "Accepting Proposals",
      createdAt: new Date().toISOString(),
    };
    updated = [newGig, ...list];
  }
  writeStorage(STORAGE_KEYS.FREELANCE, updated);
  return updated;
}

export function deleteStoredFreelanceGig(id) {
  const list = getStoredFreelanceGigs();
  const updated = list.filter((g) => g.id !== id);
  writeStorage(STORAGE_KEYS.FREELANCE, updated);
  return updated;
}

// ----------------- STUDENT PROPOSALS / APPLICATIONS -----------------
export function getStudentApplications() {
  return readStorage(STORAGE_KEYS.APPLICATIONS, []);
}

export function submitStudentProposal(gigId, proposalData) {
  const list = getStudentApplications();
  const newApp = {
    id: `prop_${Date.now()}`,
    gigId,
    ...proposalData,
    submittedAt: new Date().toISOString(),
    status: "Under Review",
  };
  const updated = [newApp, ...list];
  writeStorage(STORAGE_KEYS.APPLICATIONS, updated);
  return newApp;
}

// ----------------- EVENT REGISTRATIONS -----------------
export function getEventRegistrations() {
  return readStorage(STORAGE_KEYS.EVENT_REGISTRATIONS, []);
}

export function registerForEvent(eventId, regData) {
  const list = getEventRegistrations();
  const existing = list.find((r) => r.eventId === eventId);
  if (existing) return existing;
  const newReg = {
    id: `reg_${Date.now()}`,
    eventId,
    ...regData,
    registeredAt: new Date().toISOString(),
  };
  const updated = [newReg, ...list];
  writeStorage(STORAGE_KEYS.EVENT_REGISTRATIONS, updated);
  return newReg;
}

// ----------------- STUDENT PEER OPPORTUNITIES ("I want a team for my project") -----------------
const INITIAL_STUDENT_OPPORTUNITIES = [
  {
    id: "opp_1",
    title: "AI Voice Assistant for Visually Impaired",
    creatorName: "Marcus Brody",
    creatorEmail: "marcus.b@stanford.edu",
    creatorRole: "AI/ML Lead",
    rolesNeeded: ["Frontend (React)", "WebAudio Engineer"],
    projectScope: "Building an accessible browser assistant that translates DOM interactions into conversational audio feedback.",
    techStack: ["React", "Web Audio API", "Gemini Live API", "Tailwind CSS"],
    compensation: "$450 Milestone Stipend + Hackathon Prize Split",
    timeline: "3 weeks (Global AI Hackathon)",
    applicants: [
      {
        id: "app_101",
        studentName: "Liam Vance",
        studentEmail: "liam.v@cmu.edu",
        pitch: "Specialized in React audio streams & accessibility WCAG compliance.",
        skills: ["React", "Web Audio", "TypeScript"],
        status: "pending",
        appliedAt: "2026-09-12T14:30:00Z"
      }
    ],
    status: "Accepting Team Applications",
    createdAt: "2026-09-10T10:00:00Z"
  },
  {
    id: "opp_2",
    title: "Campus Peer Book & Hardware Exchange",
    creatorName: "Priya Patel",
    creatorEmail: "priya.p@berkeley.edu",
    creatorRole: "Product & Backend",
    rolesNeeded: ["UI/UX Designer", "Full Stack (Next.js)"],
    projectScope: "Decentralized marketplace for university students to exchange textbooks, lab equipment, and GPUs.",
    techStack: ["Next.js", "Tailwind", "PostgreSQL", "Figma"],
    compensation: "Equal Co-Founder Equity + Portfolio Showcase",
    timeline: "4 weeks MVP",
    applicants: [],
    status: "Accepting Team Applications",
    createdAt: "2026-09-11T12:00:00Z"
  },
  {
    id: "opp_3",
    title: "Autonomous Code Refactoring Agent",
    creatorName: "Elena Rostova",
    creatorEmail: "elena.r@stanford.edu",
    creatorRole: "Full Stack Engineer",
    rolesNeeded: ["Python / LLM Engineer", "DevOps / CI/CD"],
    projectScope: "CLI & GitHub Action that automatically inspects PRs for architectural anti-patterns and generates pull requests.",
    techStack: ["Python", "FastAPI", "Docker", "GitHub Actions", "Gemini 3"],
    compensation: "$600 Project Grant + Open Source Sponsorship",
    timeline: "2 weeks",
    applicants: [],
    status: "Accepting Team Applications",
    createdAt: "2026-09-12T09:00:00Z"
  }
];

export function getStoredStudentOpportunities() {
  return readStorage(STORAGE_KEYS.STUDENT_OPPORTUNITIES, INITIAL_STUDENT_OPPORTUNITIES);
}

export function saveStoredStudentOpportunity(opp) {
  const list = getStoredStudentOpportunities();
  const existingIdx = list.findIndex((o) => o.id === opp.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = { ...updated[existingIdx], ...opp, updatedAt: new Date().toISOString() };
  } else {
    const newOpp = {
      ...opp,
      id: opp.id || `opp_${Date.now()}`,
      applicants: opp.applicants || [],
      status: opp.status || "Accepting Team Applications",
      createdAt: new Date().toISOString()
    };
    updated = [newOpp, ...list];
  }
  writeStorage(STORAGE_KEYS.STUDENT_OPPORTUNITIES, updated);
  return updated;
}

export function applyToStudentOpportunity(oppId, applicationData) {
  const list = getStoredStudentOpportunities();
  const opp = list.find((o) => o.id === oppId);
  if (!opp) return null;

  const newApplicant = {
    id: `app_${Date.now()}`,
    studentName: applicationData.studentName || "Alex Chen",
    studentEmail: applicationData.studentEmail || "alex.chen@university.edu",
    pitch: applicationData.pitch || "Excited to collaborate on this project!",
    skills: applicationData.skills || ["React", "JavaScript"],
    status: "pending", // 'pending', 'approved', 'rejected'
    appliedAt: new Date().toISOString()
  };

  const updatedOpp = {
    ...opp,
    applicants: [newApplicant, ...(opp.applicants || [])]
  };

  const updatedList = list.map((o) => (o.id === oppId ? updatedOpp : o));
  writeStorage(STORAGE_KEYS.STUDENT_OPPORTUNITIES, updatedList);
  return newApplicant;
}

export function updateStudentOpportunityApplicationStatus(oppId, applicantId, status) {
  const list = getStoredStudentOpportunities();
  const updatedList = list.map((opp) => {
    if (opp.id !== oppId) return opp;
    return {
      ...opp,
      applicants: (opp.applicants || []).map((app) =>
        app.id === applicantId ? { ...app, status } : app
      )
    };
  });
  writeStorage(STORAGE_KEYS.STUDENT_OPPORTUNITIES, updatedList);
  return updatedList;
}

export function cancelStudentOpportunity(oppId) {
  const list = getStoredStudentOpportunities();
  const updated = list.filter((o) => o.id !== oppId);
  writeStorage(STORAGE_KEYS.STUDENT_OPPORTUNITIES, updated);
  return updated;
}

export function cancelStudentApplication(oppId, applicantEmail) {
  const list = getStoredStudentOpportunities();
  const updated = list.map((opp) => {
    if (opp.id !== oppId) return opp;
    return {
      ...opp,
      applicants: (opp.applicants || []).filter((a) => a.studentEmail !== applicantEmail)
    };
  });
  writeStorage(STORAGE_KEYS.STUDENT_OPPORTUNITIES, updated);
  return updated;
}

// ----------------- PEER TALENT & WILLINGNESS TO JOIN TEAMS -----------------
const INITIAL_PEER_TALENT = [
  {
    id: "peer_1",
    name: "Elena Rostova",
    email: "elena.r@stanford.edu",
    phone: "+1 (415) 555-0142",
    whatsapp: "+14155550142",
    institution: "Stanford University",
    roleTitle: "Frontend & UI/UX Specialist",
    willingToJoinTeam: true,
    knowledgeSkills: ["React", "TypeScript", "Tailwind CSS", "UI/UX Design", "Figma"],
    bio: "Passionate about fluid micro-interactions, responsive design systems, and rapid prototyping.",
    contactPreference: "+1 (415) 555-0142 (WhatsApp / SMS)",
    hoursPerWeek: 15,
    xp: 2850
  },
  {
    id: "peer_2",
    name: "David Kalu",
    email: "david.k@mit.edu",
    phone: "+1 (617) 555-0198",
    whatsapp: "+16175550198",
    institution: "MIT",
    roleTitle: "Distributed Systems & Cloud Engineer",
    willingToJoinTeam: true,
    knowledgeSkills: ["Node.js", "Python", "FastAPI", "Docker", "PostgreSQL", "System Design"],
    bio: "Building resilient microservices, high-throughput message queues, and container clusters.",
    contactPreference: "+1 (617) 555-0198 (SMS / Call)",
    hoursPerWeek: 20,
    xp: 2710
  },
  {
    id: "peer_3",
    name: "Sarah Jenkins",
    email: "s.jenkins@berkeley.edu",
    phone: "+1 (510) 555-0183",
    whatsapp: "+15105550183",
    institution: "UC Berkeley",
    roleTitle: "AI/ML & GenAI Researcher",
    willingToJoinTeam: true,
    knowledgeSkills: ["Machine Learning", "PyTorch", "Python", "Gemini API", "Vector Databases"],
    bio: "Experienced in fine-tuning embeddings, RAG pipelines, and generative agent architectures.",
    contactPreference: "+1 (510) 555-0183 (WhatsApp)",
    hoursPerWeek: 18,
    xp: 2420
  },
  {
    id: "peer_4",
    name: "Arjun Nair",
    email: "arjun.n@cmu.edu",
    phone: "+1 (412) 555-0174",
    whatsapp: "+14125550174",
    institution: "Carnegie Mellon",
    roleTitle: "Full Stack Engineer",
    willingToJoinTeam: true,
    knowledgeSkills: ["React", "Node.js", "WebSockets", "Algorithms", "Redis", "TypeScript"],
    bio: "Competitive programmer & builder eager to tackle high-speed collaborative web applications.",
    contactPreference: "+1 (412) 555-0174 (WhatsApp / Telegram)",
    hoursPerWeek: 25,
    xp: 2350
  },
  {
    id: "peer_5",
    name: "Maya Lin",
    email: "maya.l@risd.edu",
    phone: "+1 (401) 555-0165",
    whatsapp: "+14015550165",
    institution: "RISD / Brown",
    roleTitle: "Product Designer & UX Researcher",
    willingToJoinTeam: true,
    knowledgeSkills: ["UI/UX Design", "Figma", "User Research", "Design Systems", "Prototyping"],
    bio: "Obsessed with clean typography, accessibility WCAG compliance, and frictionless onboarding.",
    contactPreference: "+1 (401) 555-0165 (SMS)",
    hoursPerWeek: 12,
    xp: 2180
  },
  {
    id: "peer_current",
    name: "Alex Chen",
    email: "alex.chen@university.edu",
    phone: "+1 (555) 019-2834",
    whatsapp: "+15550192834",
    institution: "UC Berkeley",
    roleTitle: "Full Stack Software Engineer",
    willingToJoinTeam: true,
    knowledgeSkills: ["React", "JavaScript", "Node.js", "Tailwind CSS", "REST APIs", "System Design"],
    bio: "Building high-performance web products with clean architecture and delightful UI.",
    contactPreference: "+1 (555) 019-2834 (WhatsApp / Email)",
    hoursPerWeek: 15,
    xp: 2550
  }
];

function getActiveSessionUser() {
  if (typeof window === "undefined") return null;
  try {
    const a = localStorage.getItem("skillsmap_active_user");
    if (a) return JSON.parse(a);
    const m = localStorage.getItem("skillsmap_mock_user");
    if (m) return JSON.parse(m);
    return null;
  } catch {
    return null;
  }
}

export function getPeerTalentList() {
  const list = readStorage(STORAGE_KEYS.PEER_TALENT, INITIAL_PEER_TALENT);
  const activeUser = getActiveSessionUser();
  if (!activeUser) return list;

  const currentEmail = (activeUser.email || "").toLowerCase();
  const currentName = activeUser.full_name || activeUser.name || (activeUser.email ? activeUser.email.split("@")[0] : "Student Candidate");
  const currentGoal = activeUser.careerGoal || "Full Stack Software Engineer";
  const currentInst = activeUser.institution || "University Institute of Technology";

  // Check if current user is already in talent list
  const existingIdx = list.findIndex((p) => (p.email && p.email.toLowerCase() === currentEmail) || p.id === "peer_current");
  if (existingIdx >= 0) {
    const updated = [...list];
    updated[existingIdx] = {
      ...updated[existingIdx],
      id: "peer_current",
      name: currentName,
      email: activeUser.email || "student@skillsmap.io",
      institution: currentInst,
      roleTitle: currentGoal,
      xp: activeUser.xp || 2150,
      phone: updated[existingIdx].phone || "+1 (555) 019-2834",
      whatsapp: updated[existingIdx].whatsapp || "+15550192834",
      contactPreference: updated[existingIdx].contactPreference || `${activeUser.email || "student@skillsmap.io"} (Email / WhatsApp)`
    };
    return updated;
  }

  // Inject current user dynamically
  const userPeerEntry = {
    id: "peer_current",
    name: currentName,
    email: activeUser.email || "student@skillsmap.io",
    phone: "+1 (555) 019-2834",
    whatsapp: "+15550192834",
    institution: currentInst,
    roleTitle: currentGoal,
    willingToJoinTeam: true,
    knowledgeSkills: ["React", "JavaScript", "Python", "Node.js", "System Design", "PostgreSQL"],
    bio: `Passionate engineer building high-impact software applications and distributed systems.`,
    contactPreference: `${activeUser.email || "student@skillsmap.io"} (Email / WhatsApp)`,
    hoursPerWeek: 15,
    xp: activeUser.xp || 2150,
  };

  return [userPeerEntry, ...list.filter((p) => p.id !== "peer_current")];
}

export function updatePeerTalentProfile(userTalentData) {
  const list = getPeerTalentList();
  const activeUser = getActiveSessionUser();
  const currentEmail = userTalentData.email || activeUser?.email || "student@skillsmap.io";
  const existingIdx = list.findIndex((p) => (p.email && p.email.toLowerCase() === currentEmail.toLowerCase()) || p.id === "peer_current");
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = { ...updated[existingIdx], ...userTalentData };
  } else {
    updated = [{ id: "peer_current", ...userTalentData }, ...list];
  }
  writeStorage(STORAGE_KEYS.PEER_TALENT, updated);
  return updated;
}

// ----------------- TEAM INVITATIONS (from Idea Analyzer) -----------------
export function getTeamInvitations() {
  return readStorage(STORAGE_KEYS.TEAM_INVITATIONS, []);
}

export function sendTeamInvitations(invitationPayload) {
  const list = getTeamInvitations();
  const activeUser = getActiveSessionUser();
  const { ideaTitle, senderName, senderEmail, senderPhone, candidateIds, note } = invitationPayload;
  const talentList = getPeerTalentList();

  const currentSenderName = senderName || activeUser?.full_name || activeUser?.name || "Student Founder";
  const currentSenderEmail = senderEmail || activeUser?.email || "founder@skillsmap.io";
  const currentSenderPhone = senderPhone || "+1 (555) 019-2834";

  const newInvites = candidateIds.map((cid) => {
    const candidate = talentList.find((t) => t.id === cid);
    return {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ideaTitle,
      senderName: currentSenderName,
      senderEmail: currentSenderEmail,
      senderPhone: currentSenderPhone,
      recipientId: cid,
      recipientName: candidate ? candidate.name : "Peer Member",
      recipientEmail: candidate ? candidate.email : "",
      recipientPhone: candidate ? candidate.phone : "",
      recipientWhatsapp: candidate ? candidate.whatsapp : "",
      note: note || `We would love for you to join our team for "${ideaTitle}"!`,
      status: "pending", // 'pending', 'approved', 'rejected'
      sentAt: new Date().toISOString(),
    };
  });

  const updated = [...newInvites, ...list];
  writeStorage(STORAGE_KEYS.TEAM_INVITATIONS, updated);
  return newInvites;
}

export function cancelTeamInvitation(invitationId) {
  const list = getTeamInvitations();
  const updated = list.filter((inv) => inv.id !== invitationId);
  writeStorage(STORAGE_KEYS.TEAM_INVITATIONS, updated);
  return updated;
}

export function respondToTeamInvitation(invitationId, status) {
  const list = getTeamInvitations();
  const updated = list.map((inv) => (inv.id === invitationId ? { ...inv, status } : inv));
  writeStorage(STORAGE_KEYS.TEAM_INVITATIONS, updated);
  return updated;
}

export function approveAllTeamInvitations() {
  const list = getTeamInvitations();
  const updated = list.map((inv) => ({ ...inv, status: "approved" }));
  writeStorage(STORAGE_KEYS.TEAM_INVITATIONS, updated);
  return updated;
}

// ----------------- HACKATHON & EVENT SQUADS / TEAM MATCHING -----------------
const INITIAL_EVENT_TEAMS = [
  {
    id: "evt_team_1",
    eventId: "evt_1", // Global AI Agents & Multi-Modal Challenge 2026
    eventTitle: "Global AI Agents & Multi-Modal Challenge 2026",
    squadName: "Visionary Sentinel Squad",
    leaderName: "Marcus Brody",
    leaderEmail: "marcus.b@stanford.edu",
    leaderPhone: "+1 (415) 555-0142",
    targetMembersCount: 4,
    currentCount: 2,
    projectVision: "Multi-agent swarm evaluating live video and sensor feeds with sub-100ms inference on the edge.",
    rolesNeeded: ["Frontend (React/Tailwind)", "Edge Model Specialist"],
    techStack: ["React", "Python", "Gemini 3 Flash", "FastAPI"],
    applicants: [
      {
        id: "evt_app_1",
        studentName: "Liam Vance",
        studentEmail: "liam.v@cmu.edu",
        studentPhone: "+1 (412) 555-0174",
        role: "Frontend Engineer",
        skills: ["React", "TypeScript", "Tailwind CSS"],
        pitch: "Built low-latency audio visualization dashboards in previous hackathons. Ready to sprint!",
        status: "approved",
        appliedAt: "2026-09-12T10:00:00Z"
      }
    ],
    status: "Recruiting Teammates", // 'Recruiting Teammates', 'Squad Locked', 'Cancelled'
    createdAt: "2026-09-11T09:00:00Z"
  },
  {
    id: "evt_team_2",
    eventId: "evt_2", // PennApps XXVI
    eventTitle: "PennApps XXVI — Flagship Collegiate Hackathon",
    squadName: "BioSynth Neural Core",
    leaderName: "Elena Rostova",
    leaderEmail: "elena.r@stanford.edu",
    leaderPhone: "+1 (415) 555-0142",
    targetMembersCount: 4,
    currentCount: 3,
    projectVision: "Decentralized patient consent & medical imaging anonymizer for clinical trials.",
    rolesNeeded: ["Backend & Smart Contracts", "Mobile UI Dev"],
    techStack: ["Next.js", "Python", "Solidity", "PostgreSQL"],
    applicants: [
      {
        id: "evt_app_2",
        studentName: "David Kalu",
        studentEmail: "david.k@mit.edu",
        studentPhone: "+1 (617) 555-0198",
        role: "Distributed Systems Lead",
        skills: ["Node.js", "Docker", "PostgreSQL"],
        pitch: "Specialized in microservice resilience and zero-knowledge storage engines.",
        status: "approved",
        appliedAt: "2026-09-12T15:00:00Z"
      },
      {
        id: "evt_app_3",
        studentName: "Maya Lin",
        studentEmail: "maya.l@risd.edu",
        studentPhone: "+1 (401) 555-0165",
        role: "UI/UX Designer",
        skills: ["Figma", "UI/UX Design", "Design Systems"],
        pitch: "Will build a hyper-intuitive mobile & web design system in Figma within 6 hours.",
        status: "pending",
        appliedAt: "2026-09-13T11:20:00Z"
      }
    ],
    status: "Recruiting Teammates",
    createdAt: "2026-09-12T11:00:00Z"
  }
];

export function getStoredEventTeams() {
  return readStorage(STORAGE_KEYS.EVENT_TEAMS, INITIAL_EVENT_TEAMS);
}

export function saveStoredEventTeam(teamData) {
  const list = getStoredEventTeams();
  const existingIdx = list.findIndex((t) => t.id === teamData.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = { ...updated[existingIdx], ...teamData, updatedAt: new Date().toISOString() };
  } else {
    const newTeam = {
      ...teamData,
      id: teamData.id || `evt_team_${Date.now()}`,
      applicants: teamData.applicants || [],
      status: teamData.status || "Recruiting Teammates",
      createdAt: new Date().toISOString()
    };
    updated = [newTeam, ...list];
  }
  writeStorage(STORAGE_KEYS.EVENT_TEAMS, updated);
  return updated;
}

export function cancelEventTeamRequest(teamId) {
  const list = getStoredEventTeams();
  const updated = list.filter((t) => t.id !== teamId);
  writeStorage(STORAGE_KEYS.EVENT_TEAMS, updated);
  return updated;
}

export function applyToEventTeam(teamId, applicantData) {
  const list = getStoredEventTeams();
  const team = list.find((t) => t.id === teamId);
  if (!team) return null;

  const activeUser = getActiveSessionUser();
  const defaultName = activeUser?.full_name || activeUser?.name || "Student Candidate";
  const defaultEmail = activeUser?.email || "student@skillsmap.io";

  const newApplicant = {
    id: `evt_app_${Date.now()}`,
    studentName: applicantData.studentName || defaultName,
    studentEmail: applicantData.studentEmail || defaultEmail,
    studentPhone: applicantData.studentPhone || "+1 (555) 019-2834",
    role: applicantData.role || activeUser?.careerGoal || "Full Stack Developer",
    skills: applicantData.skills || ["React", "JavaScript", "Python"],
    pitch: applicantData.pitch || "Excited to team up and build an award-winning project together!",
    status: "pending", // 'pending', 'approved', 'rejected'
    appliedAt: new Date().toISOString()
  };

  const updatedTeam = {
    ...team,
    applicants: [newApplicant, ...(team.applicants || [])]
  };

  const updatedList = list.map((t) => (t.id === teamId ? updatedTeam : t));
  writeStorage(STORAGE_KEYS.EVENT_TEAMS, updatedList);
  return newApplicant;
}

export function cancelEventTeamApplication(teamId, applicantEmail) {
  const list = getStoredEventTeams();
  const updatedList = list.map((team) => {
    if (team.id !== teamId) return team;
    return {
      ...team,
      applicants: (team.applicants || []).filter((a) => a.studentEmail !== applicantEmail)
    };
  });
  writeStorage(STORAGE_KEYS.EVENT_TEAMS, updatedList);
  return updatedList;
}

export function approveEventTeamApplicant(teamId, applicantId) {
  const list = getStoredEventTeams();
  const updatedList = list.map((team) => {
    if (team.id !== teamId) return team;
    const applicants = (team.applicants || []).map((app) =>
      app.id === applicantId ? { ...app, status: "approved" } : app
    );
    const approvedCount = 1 + applicants.filter((a) => a.status === "approved").length;
    const isFull = approvedCount >= (team.targetMembersCount || 4);
    return {
      ...team,
      applicants,
      currentCount: approvedCount,
      status: isFull ? "Squad Locked" : team.status
    };
  });
  writeStorage(STORAGE_KEYS.EVENT_TEAMS, updatedList);
  return updatedList;
}

export function rejectEventTeamApplicant(teamId, applicantId) {
  const list = getStoredEventTeams();
  const updatedList = list.map((team) => {
    if (team.id !== teamId) return team;
    const applicants = (team.applicants || []).map((app) =>
      app.id === applicantId ? { ...app, status: "rejected" } : app
    );
    return { ...team, applicants };
  });
  writeStorage(STORAGE_KEYS.EVENT_TEAMS, updatedList);
  return updatedList;
}

export function approveAllEventTeamApplicants(teamId) {
  const list = getStoredEventTeams();
  const updatedList = list.map((team) => {
    if (team.id !== teamId) return team;
    const applicants = (team.applicants || []).map((app) => ({
      ...app,
      status: "approved"
    }));
    const approvedCount = 1 + applicants.length;
    return {
      ...team,
      applicants,
      currentCount: approvedCount,
      status: "Squad Locked"
    };
  });
  writeStorage(STORAGE_KEYS.EVENT_TEAMS, updatedList);
  return updatedList;
}

// ----------------- STUDENT PORTFOLIO PROJECTS -----------------
const INITIAL_STUDENT_PROJECTS = [
  {
    id: "proj_1",
    title: "Autonomous Code Review Agent",
    description: "Full-stack AI assistant that analyzes pull requests, discovers security vulnerabilities, and comments with idiomatic code refactors.",
    techStack: ["React", "FastAPI", "Gemini API", "Tailwind CSS"],
    liveUrl: "https://code-reviewer-demo.app",
    githubUrl: "https://github.com/alexchen/auto-reviewer",
    teamStatus: "Looking for 1 Backend Dev",
    dateAdded: "2026-08-15"
  },
  {
    id: "proj_2",
    title: "Real-Time Collaborative Markdown Editor",
    description: "Operational Transformation & CRDT-backed editor supporting multi-cursor live editing with zero conflict latency.",
    techStack: ["TypeScript", "WebSockets", "Node.js", "Redis"],
    liveUrl: "https://live-md-editor.app",
    githubUrl: "https://github.com/alexchen/live-md",
    teamStatus: "Solo Project (Completed)",
    dateAdded: "2026-07-20"
  }
];

export function getStudentProjects() {
  return readStorage(STORAGE_KEYS.STUDENT_PROJECTS, INITIAL_STUDENT_PROJECTS);
}

export function saveStudentProject(project) {
  const list = getStudentProjects();
  const existingIdx = list.findIndex((p) => p.id === project.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = { ...updated[existingIdx], ...project, updatedAt: new Date().toISOString() };
  } else {
    const newProj = {
      ...project,
      id: project.id || `proj_${Date.now()}`,
      dateAdded: new Date().toISOString().split("T")[0]
    };
    updated = [newProj, ...list];
  }
  writeStorage(STORAGE_KEYS.STUDENT_PROJECTS, updated);
  return updated;
}

export function deleteStudentProject(id) {
  const list = getStudentProjects();
  const updated = list.filter((p) => p.id !== id);
  writeStorage(STORAGE_KEYS.STUDENT_PROJECTS, updated);
  return updated;
}

// ----------------- STUDENT REMINDERS (Hackathons & Freelance) -----------------
const INITIAL_REMINDERS = [
  {
    id: "rem_1",
    type: "hackathon",
    title: "Global AI Agents & Multi-Modal Challenge 2026",
    targetDate: "2026-10-15",
    daysLeft: 31,
    url: "/events",
    note: "Team registration closes in 2 weeks. Finish MVP architecture proposal.",
    createdAt: "2026-09-10"
  },
  {
    id: "rem_2",
    type: "freelance",
    title: "Interactive WebGL Analytics Dashboard Widget",
    targetDate: "2026-09-20",
    daysLeft: 6,
    url: "/freelance",
    note: "Proposal submission deadline. Complete prototype demo video.",
    createdAt: "2026-09-12"
  }
];

export function getStudentReminders() {
  return readStorage(STORAGE_KEYS.STUDENT_REMINDERS, INITIAL_REMINDERS);
}

export function saveStudentReminder(reminder) {
  const list = getStudentReminders();
  const existingIdx = list.findIndex((r) => r.id === reminder.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = { ...updated[existingIdx], ...reminder, updatedAt: new Date().toISOString() };
  } else {
    const newRem = {
      ...reminder,
      id: reminder.id || `rem_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    updated = [newRem, ...list];
  }
  writeStorage(STORAGE_KEYS.STUDENT_REMINDERS, updated);
  return updated;
}

export function toggleStudentReminder(reminderItem) {
  const list = getStudentReminders();
  const existingIdx = list.findIndex((r) => r.id === reminderItem.id || r.title === reminderItem.title);
  let updated;
  if (existingIdx >= 0) {
    updated = list.filter((_, idx) => idx !== existingIdx);
  } else {
    const newRem = {
      ...reminderItem,
      id: reminderItem.id || `rem_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    updated = [newRem, ...list];
  }
  writeStorage(STORAGE_KEYS.STUDENT_REMINDERS, updated);
  return updated;
}

export function removeStudentReminder(id) {
  const list = getStudentReminders();
  const updated = list.filter((r) => r.id !== id);
  writeStorage(STORAGE_KEYS.STUDENT_REMINDERS, updated);
  return updated;
}

// ----------------- IDEA ANALYSES HISTORY -----------------
export function getStoredIdeaAnalyses() {
  return readStorage(STORAGE_KEYS.IDEA_ANALYSES, []);
}

export function saveStoredIdeaAnalysis(analysis) {
  const list = getStoredIdeaAnalyses();
  const newRecord = {
    id: `idea_${Date.now()}`,
    ...analysis,
    savedAt: new Date().toISOString()
  };
  const updated = [newRecord, ...list];
  writeStorage(STORAGE_KEYS.IDEA_ANALYSES, updated);
  return newRecord;
}

// ----------------- STUDENT CERTIFICATES -----------------
export const INITIAL_CERTIFICATES = [
  {
    id: "cert_fsd_mastery",
    title: "Full-Stack Cloud & Distributed Systems Specialist",
    issuer: "SkillsMap Academic Board & University Institute of Technology",
    issuerLogo: "🎓",
    category: "specialization", // course, specialization, hackathon, external
    issueDate: "2026-08-20",
    expiryDate: "Lifetime / No Expiration",
    credentialId: "SM-2026-FSD-882190",
    verificationUrl: "https://skillsmap.io/verify/SM-2026-FSD-882190",
    grade: "Distinction (Top 0.5%)",
    score: "98.5%",
    skills: ["React 19", "TypeScript", "Node.js Microservices", "Distributed Caching", "Docker", "PostgreSQL", "OAuth 2.0"],
    description: "Awarded for exceptional mastery in architecting, developing, and deploying resilient cloud microservices, reactive frontend architectures, and high-throughput distributed pipelines.",
    signatoryName: "Dr. Elena Rostova",
    signatoryTitle: "Dean of Academic Technology & Computer Science",
    verified: true,
    badgeColor: "indigo",
    accentGlow: "from-indigo-500 to-violet-600"
  },
  {
    id: "cert_bootcamp_30day",
    title: "30-Day Full-Stack Mastery Bootcamp Graduate",
    issuer: "SkillsMap Interactive Learning Division",
    issuerLogo: "🚀",
    category: "course",
    issueDate: "2026-09-02",
    expiryDate: "Lifetime / No Expiration",
    credentialId: "SM-2026-DAY30-771024",
    verificationUrl: "https://skillsmap.io/verify/SM-2026-DAY30-771024",
    grade: "Honor Roll",
    score: "100%",
    skills: ["Full-Stack Engineering", "Daily Coding Labs", "Code Review Mastery", "REST APIs", "Tailwind CSS"],
    description: "Conferred upon successful completion of the rigorous 30-Day intensive software engineering syllabus with verified code challenge submissions and daily streak consistency.",
    signatoryName: "Prof. Arthur Vance",
    signatoryTitle: "Director of Curriculum & Pedagogy",
    verified: true,
    badgeColor: "emerald",
    accentGlow: "from-emerald-500 to-teal-600"
  },
  {
    id: "cert_agentic_ai",
    title: "Agentic AI & Gemini Pro Integration Engineer",
    issuer: "Google AI Studio Developer Partner Program & SkillsMap",
    issuerLogo: "✨",
    category: "specialization",
    issueDate: "2026-08-28",
    expiryDate: "Lifetime / No Expiration",
    credentialId: "SM-2026-AI-902144",
    verificationUrl: "https://skillsmap.io/verify/SM-2026-AI-902144",
    grade: "Grade: A+",
    score: "96.0%",
    skills: ["Gemini SDK", "Agentic Tool Calling", "Structured Outputs", "Multi-Modal AI", "Prompt Engineering"],
    description: "Demonstrated advanced competence in architecting autonomous AI agentic workflows, multi-modal context comprehension, and enterprise-grade generative intelligence.",
    signatoryName: "Dr. Marcus Vance",
    signatoryTitle: "Head of AI Research & Developer Ecosystem",
    verified: true,
    badgeColor: "amber",
    accentGlow: "from-amber-500 to-orange-600"
  },
  {
    id: "cert_hackathon_2026",
    title: "Global Collegiate AI & Multi-Modal Challenge 2026",
    issuer: "Global Collegiate Hackathon League & Tech Guild",
    issuerLogo: "🏆",
    category: "hackathon",
    issueDate: "2026-09-08",
    expiryDate: "Permanent Record",
    credentialId: "SM-HACK-2026-PODIUM-01",
    verificationUrl: "https://skillsmap.io/verify/SM-HACK-2026-PODIUM-01",
    grade: "1st Place Winner (Gold Medal)",
    score: "Podium Standings",
    skills: ["Hackathon Sprint", "Autonomous Agents", "Rapid Prototyping", "Pitch Presentation", "System Resiliency"],
    description: "Secured First Place Global Honors among 1,400+ participating university teams for pioneering autonomous collaborative agent architecture.",
    signatoryName: "Sarah Chen",
    signatoryTitle: "Chairperson, Global Hackathon Organizing Committee",
    verified: true,
    badgeColor: "purple",
    accentGlow: "from-purple-500 to-pink-600"
  },
  {
    id: "cert_aws_practitioner",
    title: "AWS Certified Cloud Architecture - Associate Prep",
    issuer: "Amazon Web Services (AWS) Academy Partner",
    issuerLogo: "☁️",
    category: "external",
    issueDate: "2026-07-15",
    expiryDate: "2029-07-15 (Valid 3 Years)",
    credentialId: "AWS-CERT-99021-CLD",
    verificationUrl: "https://aws.amazon.com/verification/AWS-CERT-99021-CLD",
    grade: "Certified",
    score: "890 / 1000",
    skills: ["AWS S3", "EC2 & Lambda", "IAM Security", "VPC Networking", "CloudFormation"],
    description: "Industry-accredited foundation in cloud concepts, security compliance, high availability multi-AZ architecture, and infrastructure cost optimization.",
    signatoryName: "AWS Certification Board",
    signatoryTitle: "Global Certification Authority",
    verified: true,
    badgeColor: "cyan",
    accentGlow: "from-cyan-500 to-blue-600"
  }
];

export function getStudentCertificates() {
  return readStorage(STORAGE_KEYS.STUDENT_CERTIFICATES, INITIAL_CERTIFICATES);
}

export function saveStudentCertificate(certificate) {
  const list = getStudentCertificates();
  const existingIdx = list.findIndex((c) => c.id === certificate.id || (c.credentialId && c.credentialId === certificate.credentialId));
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = { 
      ...updated[existingIdx], 
      ...certificate, 
      updatedAt: new Date().toISOString() 
    };
  } else {
    const newCert = {
      ...certificate,
      id: certificate.id || `cert_${Date.now()}`,
      credentialId: certificate.credentialId || `SM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      verificationUrl: certificate.verificationUrl || `https://skillsmap.io/verify/SM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      issueDate: certificate.issueDate || new Date().toISOString().split("T")[0],
      verified: true,
      createdAt: new Date().toISOString()
    };
    updated = [newCert, ...list];
  }
  writeStorage(STORAGE_KEYS.STUDENT_CERTIFICATES, updated);
  return updated;
}

export function deleteStudentCertificate(id) {
  const list = getStudentCertificates();
  const updated = list.filter((c) => c.id !== id);
  writeStorage(STORAGE_KEYS.STUDENT_CERTIFICATES, updated);
  return updated;
}


