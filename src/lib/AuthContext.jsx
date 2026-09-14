import React, { createContext, useState, useContext, useEffect } from "react";
import { 
  auth, 
  signInWithGoogle, 
  loginEmailPassword, 
  registerEmailPassword, 
  firebaseSignOut, 
  db 
} from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { fetchUserBadges, evaluateAndAwardBadges } from "@/lib/badgeSystem";

const defaultAuthContextValue = {
  user: null,
  isAuthenticated: false,
  isLoadingAuth: false,
  authChecked: false,
  authError: null,
  isLoadingPublicSettings: false,
  checkUserAuth: async () => {},
  navigateToLogin: () => {
    if (typeof window !== "undefined") window.location.href = "/login";
  },
  userBadges: [],
  isAdmin: false,
  loginGoogle: async () => {},
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  loginAsDemo: () => {},
};

const AuthContext = createContext(defaultAuthContextValue);

export const ADMIN_EMAILS = [
  "venkatasantosh2478@gmail.com",
  "admin@skillsmap.io"
];

export const AuthProvider = ({ children }) => {
  // Check if an email or user is an admin
  const isUserAdmin = (email, role) => {
    if (!email && !role) return false;
    const lower = (email || "").toLowerCase().trim();
    return ADMIN_EMAILS.some((admin) => admin.toLowerCase() === lower) || role === "admin";
  };

  // Synchronous cache hydration for instant initial paint
  const getCachedUser = () => {
    try {
      const cached = localStorage.getItem("skillsmap_active_user") || localStorage.getItem("skillsmap_mock_user");
      if (cached) {
        const parsed = JSON.parse(cached);
        const isAdmin = isUserAdmin(parsed.email, parsed.role);
        parsed.role = isAdmin ? "admin" : (parsed.role || "student");
        return parsed;
      }
    } catch (e) {}
    return null;
  };

  const initialCachedUser = getCachedUser();

  const [user, setUser] = useState(initialCachedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialCachedUser));
  const [isLoadingAuth, setIsLoadingAuth] = useState(!initialCachedUser);
  const [authChecked, setAuthChecked] = useState(Boolean(initialCachedUser));
  const [authError, setAuthError] = useState(null);
  const [userBadges, setUserBadges] = useState([]);

  const syncUserFromFirebase = async (firebaseUser) => {
    const isAdmin = isUserAdmin(firebaseUser.email, null);

    let profileData = {
      uid: firebaseUser.uid,
      id: firebaseUser.uid,
      email: firebaseUser.email,
      full_name: firebaseUser.displayName || (firebaseUser.email?.split("@")[0]) || "Student",
      photoURL: firebaseUser.photoURL,
      role: isAdmin ? "admin" : "student",
      institution: isAdmin ? "SkillsMap Administration" : "Stanford University",
      careerGoal: isAdmin ? "Institutional Administrator" : "Full Stack AI Engineer",
      xp: isAdmin ? 4500 : 1800,
      streakDays: isAdmin ? 14 : 5,
      modulesCompleted: isAdmin ? 10 : 3,
      quizzesCompleted: 0,
      codeChallengesSolved: 0,
      communityHelpCount: isAdmin ? 15 : 2,
      promptsGenerated: isAdmin ? 10 : 2,
      teamSquadJoined: isAdmin ? 4 : 1,
    };

    // Instant optimistic state update
    try {
      window.localStorage.setItem("skillsmap_active_user", JSON.stringify(profileData));
      window.localStorage.setItem("skillsmap_mock_user", JSON.stringify(profileData));
      window.localStorage.setItem("skillsmap_user_profile", JSON.stringify(profileData));
      window.localStorage.setItem("skillsmap_access_token", `token_${profileData.id}`);
      window.dispatchEvent(new CustomEvent("skillsmap_leaderboard_update"));
      window.dispatchEvent(new CustomEvent("skillsmap_store_update", { detail: { key: "user" } }));
    } catch (e) {}

    setUser(profileData);
    setIsAuthenticated(true);
    setAuthChecked(true);
    setAuthError(null);
    setIsLoadingAuth(false);

    // Non-blocking background Firestore hydration and badge awards
    (async () => {
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const remoteData = snap.data();
          const merged = { ...profileData, ...remoteData };
          if (isAdmin) merged.role = "admin";
          setUser(merged);
          try {
            window.localStorage.setItem("skillsmap_active_user", JSON.stringify(merged));
            window.localStorage.setItem("skillsmap_mock_user", JSON.stringify(merged));
            window.localStorage.setItem("skillsmap_user_profile", JSON.stringify(merged));
            window.dispatchEvent(new CustomEvent("skillsmap_leaderboard_update"));
          } catch (e) {}
        } else {
          await setDoc(userDocRef, profileData);
        }

        const badges = await fetchUserBadges(firebaseUser.uid);
        setUserBadges(badges);
        await evaluateAndAwardBadges(profileData, profileData);
      } catch (err) {
        console.warn("Background Firestore sync note:", err.message);
      }
    })();

    return profileData;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserFromFirebase(firebaseUser);
      } else {
        // Fallback for session state when not logged in with Firebase yet
        const localActive = localStorage.getItem("skillsmap_active_user");
        const localMock = localStorage.getItem("skillsmap_mock_user");
        const rawUser = localActive || localMock;
        if (rawUser) {
          try {
            const parsed = JSON.parse(rawUser);
            const isAdmin = isUserAdmin(parsed.email, parsed.role);
            parsed.role = isAdmin ? "admin" : (parsed.role || "student");
            setUser(parsed);
            setIsAuthenticated(true);
          } catch {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // Default initial student user session
          const defaultStudent = {
            uid: "student_default",
            id: "student_default",
            email: "student@skillsmap.io",
            full_name: "Student Candidate",
            role: "student",
            institution: "University Institute of Technology",
            careerGoal: "Full Stack Cloud & AI Engineer",
            xp: 2150,
            streakDays: 5,
            modulesCompleted: 4,
            quizzesCompleted: 8,
            codeChallengesSolved: 9,
            communityHelpCount: 3,
            promptsGenerated: 2,
            teamSquadJoined: 1,
          };
          setUser(defaultStudent);
          setIsAuthenticated(true);
          try {
            localStorage.setItem("skillsmap_active_user", JSON.stringify(defaultStudent));
            localStorage.setItem("skillsmap_mock_user", JSON.stringify(defaultStudent));
          } catch (e) {}
        }
        setAuthChecked(true);
        setIsLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkUserAuth = async () => {
    if (auth.currentUser) {
      await syncUserFromFirebase(auth.currentUser);
    }
  };

  const loginGoogle = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        return await syncUserFromFirebase(fbUser);
      }
    } catch (err) {
      setAuthError({ type: 'google_auth_failed', message: err.message });
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const cred = await loginEmailPassword(email, password);
      if (cred?.user) {
        return await syncUserFromFirebase(cred.user);
      }
    } catch (err) {
      setAuthError({ type: 'email_auth_failed', message: err.message });
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const registerWithEmail = async (email, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const cred = await registerEmailPassword(email, password);
      if (cred?.user) {
        return await syncUserFromFirebase(cred.user);
      }
    } catch (err) {
      setAuthError({ type: 'register_failed', message: err.message });
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem("skillsmap_mock_user");
    localStorage.removeItem("skillsmap_active_user");
    localStorage.removeItem("skillsmap_access_token");
    try {
      await firebaseSignOut();
    } catch (e) {}
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = async (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      localStorage.setItem("skillsmap_active_user", JSON.stringify(updated));
      localStorage.setItem("skillsmap_mock_user", JSON.stringify(updated));
      localStorage.setItem("skillsmap_user_profile", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("skillsmap_leaderboard_update"));
      window.dispatchEvent(new CustomEvent("skillsmap_store_update", { detail: { key: "user" } }));
    } catch (e) {}
    if (user?.uid && auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, updated, { merge: true });
      } catch (err) {
        console.warn("Firestore update user profile note:", err.message);
      }
    }
    // Check if new stats unlocked medals in background
    evaluateAndAwardBadges(updated, updated).catch(() => {});
  };

  const loginAsDemo = (role = "student") => {
    const isAdmin = role === "admin";
    const demoUser = isAdmin
      ? {
          uid: "admin_venkatasantosh",
          id: "admin_venkatasantosh",
          email: "venkatasantosh2478@gmail.com",
          full_name: "Santosh (Admin)",
          role: "admin",
          institution: "SkillsMap Faculty Console",
          careerGoal: "Dean / Institutional Administrator",
          xp: 4500,
          streakDays: 14,
          modulesCompleted: 10,
          communityHelpCount: 15,
          promptsGenerated: 10,
          teamSquadJoined: 5,
        }
      : {
          uid: "student_alex_chen",
          id: "student_alex_chen",
          email: "alex.chen@university.edu",
          full_name: "Alex Chen",
          role: "student",
          institution: "Stanford University",
          careerGoal: "Full Stack Cloud Architect",
          xp: 2550,
          streakDays: 5,
          modulesCompleted: 6,
          communityHelpCount: 3,
          promptsGenerated: 2,
          teamSquadJoined: 1,
        };

    localStorage.setItem("skillsmap_mock_user", JSON.stringify(demoUser));
    localStorage.setItem("skillsmap_active_user", JSON.stringify(demoUser));
    setUser(demoUser);
    setIsAuthenticated(true);
    setAuthChecked(true);
    return demoUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        authChecked,
        authError,
        isLoadingPublicSettings: false,
        checkUserAuth,
        navigateToLogin: () => {
          if (typeof window !== "undefined") window.location.href = "/login";
        },
        userBadges,
        isAdmin: isUserAdmin(user?.email, user?.role),
        loginGoogle,
        loginWithGoogle: loginGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateUserProfile,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
