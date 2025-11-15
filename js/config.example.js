/**
 * Configuration Example File
 * Copy this file to js/config.js and add your actual API keys
 * 
 * Get Gemini API Key: https://makersuite.google.com/app/apikey
 * Get Firebase Config: Firebase Console > Project Settings > General > Your apps
 */

const CONFIG = {
  // Gemini API Key
  GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE",
  
  // Firebase Configuration
  FIREBASE: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}

