import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Firebase configuration - Replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
// Analytics is optional and may be blocked by browser extensions (adblockers).
// We avoid a static import so adblockers don't block the whole module graph.
export let analytics = null;

// Call this to initialize analytics when desired. It uses a dynamic import and
// fails gracefully if the resource is blocked.
export async function initAnalytics() {
  if (typeof window === 'undefined') return null;
  try {
    const mod = await import('firebase/analytics');
    analytics = mod.getAnalytics(app);
    return analytics;
  } catch (e) {
    console.warn('Analytics not available or blocked by client:', e && e.message ? e.message : e);
    analytics = null;
    return null;
  }
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Callable functions
export const callAI = httpsCallable(functions, "aiDispatch");
export const adminCreateRole = httpsCallable(functions, "adminCreateRole");
export const adminUpsertStage = httpsCallable(functions, "adminUpsertStage");
export const adminUpsertTask = httpsCallable(functions, "adminUpsertTask");
export const mentorProposeDraft = httpsCallable(functions, "mentorProposeDraft");
