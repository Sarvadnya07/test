import { auth, googleProvider } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

import { db } from "./firebase.js";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// ----------------------------------------
// Helper: build safe user object
// ----------------------------------------
async function buildUserWithRole(user) {
  if (!user) return null;

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const data = userDoc.exists() ? userDoc.data() : {};

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || data?.name || "User",
      photoURL: user.photoURL || data?.photoURL || null,
      role: data?.role || "STUDENT"
    };
  } catch (err) {
    console.warn("Failed to fetch user role:", err.message);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "User",
      photoURL: user.photoURL || null,
      role: "STUDENT"
    };
  }
}

// ----------------------------------------
// Auth state observer
// ----------------------------------------
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }

    const safeUser = await buildUserWithRole(user);
    callback(safeUser);
  });
}

// ----------------------------------------
// Email Sign-In
// ----------------------------------------
export async function signInEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const safeUser = await buildUserWithRole(userCredential.user);
    return { user: safeUser, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

// ----------------------------------------
// Email Sign-Up
// ----------------------------------------
export async function signUpEmail(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth profile
    if (name) {
      await updateProfile(user, { displayName: name }).catch(() => {});
    }

    // Ensure Firestore doc exists
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: name || user.displayName || "User",
      photoURL: user.photoURL || null,
      role: "STUDENT",
      createdAt: serverTimestamp()
    });

    const safeUser = await buildUserWithRole(user);
    return { user: safeUser, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

// ----------------------------------------
// Google Sign-In
// ----------------------------------------
export async function signInGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName || "User",
        photoURL: user.photoURL || null,
        role: "STUDENT",
        createdAt: serverTimestamp()
      });
    }

    const safeUser = await buildUserWithRole(user);
    return { user: safeUser, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

// ----------------------------------------
// Sign Out
// ----------------------------------------
export async function signOutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

// ----------------------------------------
// Get Current User
// ----------------------------------------
export function getCurrentUser() {
  const u = auth.currentUser;
  if (!u) return null;

  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName || "User",
    photoURL: u.photoURL || null
  };
}

// ----------------------------------------
// Get user role explicitly
// ----------------------------------------
export async function getUserRole(uid) {
  try {
    const ref = await getDoc(doc(db, "users", uid));
    return ref.exists() ? ref.data().role || "STUDENT" : "STUDENT";
  } catch {
    return "STUDENT";
  }
}
