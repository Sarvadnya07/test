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

// Auth state observer
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      callback({
        ...user,
        role: userData?.role || "STUDENT"
      });
    } else {
      callback(null);
    }
  });
}

// Sign in with email/password
export async function signInEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

// Sign up with email/password
export async function signUpEmail(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      name: name || userCredential.user.displayName || "User",
      photoURL: userCredential.user.photoURL || null,
      role: "STUDENT",
      createdAt: serverTimestamp()
    });
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

// Sign in with Google
export async function signInGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // Create user document
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName || "User",
        photoURL: user.photoURL || null,
        role: "STUDENT",
        createdAt: serverTimestamp()
      });
    }
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}

// Get user role
export async function getUserRole(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.data()?.role || "STUDENT";
}

