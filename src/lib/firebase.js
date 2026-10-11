import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  initializeFirestore,
  getFirestore, 
  persistentLocalCache,
  persistentMultipleTabManager,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

// Standard Firestore initialization as specified by Firebase skill:
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

// Enable immediate local storage persistence for fastest auth hydration
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn("Firebase persistence notice:", err);
  });
} catch (e) {}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.warn("Google Popup Auth Error, attempting redirect:", error);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request' || error.code === 'auth/unauthorized-domain') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectError) {
        console.error("Google Redirect Error:", redirectError);
        throw redirectError;
      }
    }
    throw error;
  }
}

export { getRedirectResult };

export async function loginEmailPassword(email, password) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (error) {
    console.error("Email Login Error:", error);
    throw error;
  }
}

export async function registerEmailPassword(email, password) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
}

export async function firebaseSignOut() {
  return signOut(auth);
}

// Structured error handling as required by Firebase skill
export const OperationType = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LIST: "list",
  GET: "get",
  WRITE: "write",
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Non-blocking background health check
async function testConnection() {
  try {
    // Standard getDoc leverages cache and offline mode seamlessly
    await getDoc(doc(db, "test", "connection"));
    console.log("Firebase Firestore connected successfully.");
  } catch (error) {
    // Silence offline and connection unavailable notices gracefully
    const msg = error?.message || String(error);
    if (msg.includes("unavailable") || msg.includes("offline") || msg.includes("Could not reach")) {
      console.info("Firestore operating in offline/cached persistence mode.");
    } else {
      console.warn("Firestore connection check note:", msg);
    }
  }
}
testConnection();
