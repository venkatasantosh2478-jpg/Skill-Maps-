// Skills Map Client - powered by Google Gemini AI & local reactive persistence
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_RESOURCES,
  INITIAL_OPPORTUNITIES,
  INITIAL_SESSIONS,
} from "./mockData";

const isBrowser = typeof window !== "undefined";
const TOKEN_KEY = "skillsmap_access_token";

function getStorage(key, defaultValue) {
  if (!isBrowser) return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setStorage(key, value) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

// Initialize tables in localStorage if missing
if (isBrowser) {
  if (!window.localStorage.getItem("skillsmap_students")) {
    setStorage("skillsmap_students", INITIAL_STUDENTS);
  }
  if (!window.localStorage.getItem("skillsmap_resources")) {
    setStorage("skillsmap_resources", INITIAL_RESOURCES);
  }
  if (!window.localStorage.getItem("skillsmap_opportunities")) {
    setStorage("skillsmap_opportunities", INITIAL_OPPORTUNITIES);
  }
  if (!window.localStorage.getItem("skillsmap_sessions")) {
    setStorage("skillsmap_sessions", INITIAL_SESSIONS);
  }
  if (!window.localStorage.getItem("skillsmap_users")) {
    setStorage("skillsmap_users", INITIAL_USERS);
  }
  // Only seed table schemas, DO NOT automatically log in unauthenticated visitors
}

import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

function createEntityStore(collectionName) {
  return {
    async list() {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async get(id) {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) throw new Error(`Entity ${id} not found`);
      return { id: snapshot.id, ...snapshot.data() };
    },
    async create(data) {
      const colRef = collection(db, collectionName);
      const newDocRef = doc(colRef); // Auto-generate ID
      await setDoc(newDocRef, { ...data, created_date: new Date().toISOString() });
      return { id: newDocRef.id, ...data };
    },
    async update(id, data) {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { ...data, updated_date: new Date().toISOString() });
      return { id, ...data };
    },
    async delete(id) {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return { success: true, id };
    },
  };
}

const skillsMapAuth = {
  getCurrentUser() {
    const u = getStorage("skillsmap_active_user", null) || getStorage("skillsmap_mock_user", null);
    if (!u || u === "null") return null;
    return u;
  },

  async me() {
    const user = this.getCurrentUser();
    if (!user) {
      const err = new Error("User not authenticated");
      err.status = 401;
      throw err;
    }
    return user;
  },

  async loginViaEmailPassword(email, _password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    let user;
    if (cleanEmail.includes("admin") || cleanEmail.includes("santosh")) {
      user = {
        id: "admin_venkatasantosh",
        uid: "admin_venkatasantosh",
        email: cleanEmail,
        full_name: "Santosh (Admin)",
        role: "admin",
        institution: "SkillsMap Administration",
        careerGoal: "Institutional Director & Chief Architect",
        xp: 4500,
        streakDays: 14,
        modulesCompleted: 10,
        created_date: "2026-07-15T08:00:00.000Z",
      };
    } else {
      const users = getStorage("skillsmap_users", INITIAL_USERS);
      user = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        user = {
          id: `user_${Date.now()}`,
          uid: `user_${Date.now()}`,
          email: cleanEmail,
          full_name: cleanEmail.split("@")[0].replace(".", " "),
          role: "student",
          institution: "University Institute of Technology",
          careerGoal: "Full Stack Software Engineer",
          xp: 2150,
          streakDays: 5,
          modulesCompleted: 4,
          created_date: new Date().toISOString(),
        };
        setStorage("skillsmap_users", [...users, user]);
      }
    }
    setStorage("skillsmap_active_user", user);
    setStorage("skillsmap_mock_user", user);
    setStorage("skillsmap_user_profile", user);
    if (isBrowser) {
      window.localStorage.setItem(TOKEN_KEY, `token_${user.id}`);
      window.dispatchEvent(new CustomEvent("skillsmap_leaderboard_update"));
      window.dispatchEvent(new CustomEvent("skillsmap_store_update", { detail: { key: "user" } }));
    }
    return { user, access_token: `token_${user.id}` };
  },

  async loginWithProvider(_provider, returnTo) {
    const user = this.getCurrentUser() || INITIAL_USERS[0];
    setStorage("skillsmap_active_user", user);
    setStorage("skillsmap_mock_user", user);
    if (isBrowser) {
      window.localStorage.setItem(TOKEN_KEY, `token_${user.id}`);
      window.location.href = returnTo || "/dashboard";
    }
    return { user, access_token: `token_${user.id}` };
  },

  async register({ email, _password }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const users = getStorage("skillsmap_users", INITIAL_USERS);
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        email: cleanEmail,
        full_name: cleanEmail.split("@")[0].replace(".", " "),
        role: "user",
        created_date: new Date().toISOString(),
      };
      setStorage("skillsmap_users", [...users, user]);
    }
    setStorage("skillsmap_pending_email", cleanEmail);
    return { status: "success" };
  },

  async verifyOtp({ email, otpCode: _otpCode }) {
    const cleanEmail = email || getStorage("skillsmap_pending_email", "demo@skillsmap.io");
    const users = getStorage("skillsmap_users", INITIAL_USERS);
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail.toLowerCase()) || {
      id: `user_${Date.now()}`,
      email: cleanEmail,
      full_name: cleanEmail.split("@")[0],
      role: "user",
    };
    setStorage("skillsmap_active_user", user);
    const token = `token_${user.id}`;
    if (isBrowser) {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
    return { access_token: token, user };
  },

  async resendOtp(_email) {
    return { status: "success" };
  },

  async resetPasswordRequest(_email) {
    return { status: "success" };
  },

  async resetPassword({ _resetToken, _newPassword }) {
    return { status: "success" };
  },

  setToken(token) {
    if (isBrowser && token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
  },

  logout(redirectUrl) {
    setStorage("skillsmap_active_user", null);
    if (isBrowser) {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem("token");
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }
  },

  redirectToLogin(returnTo) {
    if (isBrowser) {
      const dest = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login";
      window.location.href = dest;
    }
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  getAllUsers() {
    return getStorage("skillsmap_users", INITIAL_USERS);
  },

  createUser(userData) {
    const users = this.getAllUsers();
    const cleanEmail = (userData.email || "").trim().toLowerCase();
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      uid: `user_${Date.now()}`,
      email: cleanEmail,
      full_name: userData.full_name || userData.name || cleanEmail.split("@")[0],
      role: userData.role || "student",
      institution: userData.institution || "University Institute of Technology",
      careerGoal: userData.careerGoal || "Software Engineer",
      track: userData.track || "Software Engineering",
      xp: Number(userData.xp) || 2000,
      streakDays: Number(userData.streakDays) || 3,
      modulesCompleted: Number(userData.modulesCompleted) || 2,
      quizzesCompleted: Number(userData.quizzesCompleted) || 4,
      codeChallengesSolved: Number(userData.codeChallengesSolved) || 5,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    const updated = [newUser, ...users.filter((u) => u.email.toLowerCase() !== cleanEmail)];
    setStorage("skillsmap_users", updated);
    if (isBrowser) {
      window.dispatchEvent(new CustomEvent("skillsmap_users_changed"));
    }
    return newUser;
  },

  updateUser(id, updates) {
    const users = this.getAllUsers();
    const idx = users.findIndex((u) => u.id === id || u.uid === id);
    if (idx === -1) return null;
    const current = users[idx];
    const updatedUser = {
      ...current,
      ...updates,
      updated_date: new Date().toISOString()
    };
    users[idx] = updatedUser;
    setStorage("skillsmap_users", [...users]);

    // If active user is updated, sync active session
    const active = this.getCurrentUser();
    if (active && (active.id === id || active.uid === id)) {
      setStorage("skillsmap_active_user", updatedUser);
      setStorage("skillsmap_mock_user", updatedUser);
      setStorage("skillsmap_user_profile", updatedUser);
    }

    if (isBrowser) {
      window.dispatchEvent(new CustomEvent("skillsmap_users_changed"));
      window.dispatchEvent(new CustomEvent("skillsmap_leaderboard_update"));
      window.dispatchEvent(new CustomEvent("skillsmap_store_update", { detail: { key: "user" } }));
    }
    return updatedUser;
  },

  deleteUser(id) {
    const users = this.getAllUsers();
    const filtered = users.filter((u) => u.id !== id && u.uid !== id);
    setStorage("skillsmap_users", filtered);
    if (isBrowser) {
      window.dispatchEvent(new CustomEvent("skillsmap_users_changed"));
      window.dispatchEvent(new CustomEvent("skillsmap_leaderboard_update"));
    }
    return { success: true, id };
  },
};

// Google Gemini AI integrations
const skillsMapIntegrations = {
  Core: {
    async InvokeLLM({ prompt = "", response_json_schema }) {
      try {
        const res = await fetch("/api/ai/invoke-llm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, response_json_schema }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            return data;
          }
        }
      } catch (err) {
        console.warn("Client Gemini AI call failed, using local generation:", err);
      }

      // Local fallback in case network fails
      const p = prompt.toLowerCase();
      if (response_json_schema?.properties?.graph) {
        const skills = [
          "JavaScript", "React", "Node.js", "Databases", "System Design",
          "Algorithms", "Git", "Testing", "API Design", "Cloud Deployment"
        ];
        return {
          graph: skills.map((skill) => ({
            skill,
            level: p.includes(skill.toLowerCase()) ? 0.75 : 0.5,
          })),
        };
      }
      if (response_json_schema?.properties?.suggestion) {
        return { suggestion: "Focus next on System Design — complete the recommended primer and validate with an assessment." };
      }
      if (response_json_schema?.properties?.reply) {
        return { reply: "Based on your competency graph, focusing on high-impact cloud architectures and distributed design patterns will best advance your career goal." };
      }
      return {};
    },

    async UploadPublicFile({ file }) {
      const url = file && typeof URL !== "undefined" && URL.createObjectURL ? URL.createObjectURL(file) : "https://example.com/resume.pdf";
      return { file_url: url };
    },

    async ExtractDataFromUploadedFile({ file_url, textContent, base64Data, mimeType, fileName }) {
      try {
        const res = await fetch("/api/ai/extract-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_url, textContent, base64Data, mimeType, fileName }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn("Resume extraction API warning:", err);
      }
      return {
        output: {
          resumeText: textContent || "Alex Chen\nFull Stack Software Developer\nSkills: JavaScript, React, Node.js, PostgreSQL, Docker, Git, REST APIs, System Design, Unit Testing.",
          detectedSkills: ["JavaScript", "React", "Node.js", "PostgreSQL", "Docker", "Git", "REST APIs", "System Design"],
        },
      };
    },
  },
};

export const skillsMap = {
  app: {
    async getPublicSettings() {
      return {
        id: "skills-map",
        public_settings: {
          name: "Skills Map",
          description: "Student Competency & Career Mapping Platform",
        },
      };
    },
  },
  auth: skillsMapAuth,
  entities: {
    StudentProfile: createEntityStore("users"),
    Resource: createEntityStore("resources"),
    Opportunity: createEntityStore("opportunities"),
    GuidanceSession: createEntityStore("sessions"),
    User: createEntityStore("users"),
  },
  integrations: skillsMapIntegrations,
};

export const appClient = skillsMap;
export default skillsMap;
