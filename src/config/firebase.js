import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - Replace with your actual config
// Using demo config for development - app will work but Firebase features won't
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DEMO"
};

let app, auth, db, storage, functions, analytics, googleProvider, aiChat;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
  
  // Google Auth Provider
  googleProvider = new GoogleAuthProvider();
  
  // Callable Functions
  aiChat = httpsCallable(functions, 'aiChat');
} catch (error) {
  console.warn('Firebase initialization error (app will work in demo mode):', error);
  // Create mock objects so imports don't break
  auth = null;
  db = null;
  storage = null;
  functions = null;
  analytics = null;
  googleProvider = null;
  aiChat = null;
}

export { auth, db, storage, functions, analytics, googleProvider, aiChat };
