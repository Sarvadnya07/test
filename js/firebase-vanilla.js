/**
 * Firebase Vanilla JS Wrapper
 * No ES modules - works with script tags
 */

// Firebase configuration - Load from config.js or use defaults
function getFirebaseConfig() {
  // Try to get config from window.CONFIG (loaded from config.js)
  if (typeof window !== 'undefined' && window.CONFIG && window.CONFIG.FIREBASE) {
    const config = window.CONFIG.FIREBASE;
    // Validate config
    if (config.apiKey && config.apiKey !== "YOUR_API_KEY" && config.apiKey !== "YOUR_FIREBASE_API_KEY") {
      return config;
    }
  }
  
  // Return default/empty config
  return {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_DOMAIN.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  };
}

// Initialize Firebase (will be loaded via CDN)
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseStorage = null;
let firebaseFunctions = null;

// Load Firebase SDKs from CDN
function loadFirebase() {
  return new Promise((resolve, reject) => {
    // Check if Firebase is already loaded and initialized
    if (window.firebase && firebaseApp && firebaseAuth) {
      resolve();
      return;
    }
    
    // Get fresh config
    const FIREBASE_CONFIG = getFirebaseConfig();
    
    // Check if config is valid
    if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === "YOUR_API_KEY" || FIREBASE_CONFIG.apiKey === "YOUR_FIREBASE_API_KEY") {
      const error = new Error('Firebase not configured. Please add your Firebase config to js/config.js');
      console.warn(error.message);
      reject(error);
      return;
    }
    
    // If Firebase SDK is already loaded, just initialize
    if (window.firebase) {
      try {
        initializeFirebase();
        // Wait a bit and check if initialization succeeded
        setTimeout(() => {
          if (firebaseApp && firebaseAuth) {
            resolve();
          } else {
            reject(new Error('Firebase initialization failed. Please check your configuration.'));
          }
        }, 100);
      } catch (error) {
        reject(error);
      }
      return;
    }
    
    // Load Firebase scripts
    const scripts = [
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js',
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js',
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js',
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js'
    ];
    
    let loaded = 0;
    let hasError = false;
    const scriptErrors = [];
    
    // Helper to wait for Firebase to be available
    const waitForFirebase = (maxAttempts = 20, attempt = 0) => {
      if (window.firebase && window.firebase.initializeApp) {
        try {
          initializeFirebase();
          // Verify initialization succeeded
          if (firebaseApp && firebaseAuth) {
            console.log('✅ Firebase loaded and initialized successfully');
            resolve();
          } else {
            console.error('Firebase initialized but app/auth not available');
            reject(new Error('Firebase initialization incomplete. Please check your configuration.'));
          }
        } catch (error) {
          console.error('Firebase initialization error:', error);
          reject(error);
        }
        return;
      }
      
      if (attempt < maxAttempts) {
        setTimeout(() => waitForFirebase(maxAttempts, attempt + 1), 100);
      } else {
        console.error('Firebase SDK not available after loading scripts');
        reject(new Error('Firebase SDK failed to load. Please check your internet connection and try refreshing the page.'));
      }
    };
    
    // Helper to check if all scripts loaded and initialize
    const checkAndInitialize = () => {
      if (loaded === scripts.length && !hasError) {
        console.log('All Firebase scripts loaded, waiting for Firebase SDK to be available...');
        // Wait for Firebase to be available
        waitForFirebase();
      }
    };
    
    scripts.forEach((src, index) => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        console.log('Firebase script already exists:', src);
        loaded++;
        checkAndInitialize();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.async = false; // Load sequentially
      script.onload = () => {
        loaded++;
        console.log(`Loaded Firebase script ${loaded}/${scripts.length}:`, src);
        checkAndInitialize();
      };
      script.onerror = (error) => {
        hasError = true;
        const errorMsg = `Failed to load Firebase script: ${src}`;
        console.error(errorMsg, error);
        scriptErrors.push(src);
        reject(new Error(`${errorMsg}. Please check your internet connection and try again.`));
      };
      document.head.appendChild(script);
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (loaded < scripts.length && !hasError) {
        hasError = true;
        reject(new Error(`Firebase scripts took too long to load. Loaded ${loaded}/${scripts.length}. Please check your internet connection.`));
      }
    }, 10000);
  });
}

function initializeFirebase() {
  // Get fresh config
  const FIREBASE_CONFIG = getFirebaseConfig();
  
  console.log('Initializing Firebase with config:', {
    apiKey: FIREBASE_CONFIG.apiKey ? FIREBASE_CONFIG.apiKey.substring(0, 10) + '...' : 'MISSING',
    authDomain: FIREBASE_CONFIG.authDomain,
    projectId: FIREBASE_CONFIG.projectId
  });
  
  if (!window.firebase) {
    console.error('❌ Firebase SDK not loaded. Make sure Firebase scripts are loaded.');
    throw new Error('Firebase SDK not loaded');
  }
  
  if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === "YOUR_API_KEY" || FIREBASE_CONFIG.apiKey === "YOUR_FIREBASE_API_KEY") {
    console.error('❌ Firebase not configured. Please add your Firebase config to js/config.js');
    console.error('Current config:', FIREBASE_CONFIG);
    throw new Error('Firebase not configured. Please check js/config.js');
  }
  
  try {
    // Check if Firebase app already exists
    if (window.firebase.apps && window.firebase.apps.length > 0) {
      firebaseApp = window.firebase.app();
      console.log('✅ Using existing Firebase app');
    } else {
      firebaseApp = window.firebase.initializeApp(FIREBASE_CONFIG);
      console.log('✅ Firebase app initialized');
    }
    
    if (!firebaseApp) {
      throw new Error('Failed to create Firebase app');
    }
    
    firebaseAuth = window.firebase.auth();
    if (!firebaseAuth) {
      throw new Error('Failed to initialize Firebase Auth');
    }
    
    firebaseDb = window.firebase.firestore();
    firebaseStorage = window.firebase.storage();
    firebaseFunctions = window.firebase.functions();
    
    console.log('✅ Firebase initialized successfully - Auth, Firestore, Storage, Functions ready');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      firebaseAvailable: !!window.firebase,
      configValid: !!(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY")
    });
    throw error; // Re-throw so loadFirebase can catch it
  }
}

// Helper function to check if Firebase is initialized
function isFirebaseInitialized() {
  return !!(firebaseApp && firebaseAuth);
}

// Auth functions
const FirebaseAuth = {
  async signInEmail(email, password) {
    // Try to initialize if not already done
    if (!firebaseAuth) {
      await loadFirebase();
      if (!firebaseAuth) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }
    }
    const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  },
  
  async signUpEmail(email, password, name) {
    // Try to initialize if not already done
    if (!firebaseAuth) {
      await loadFirebase();
      if (!firebaseAuth) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }
    }
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    if (name) {
      await userCredential.user.updateProfile({ displayName: name });
    }
    
    // Create user document
    if (firebaseDb) {
      await firebaseDb.collection('users').doc(userCredential.user.uid).set({
        email: userCredential.user.email,
        name: name || userCredential.user.displayName || 'User',
        role: 'student',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return userCredential.user;
  },
  
  async signInGoogle() {
    // Try to initialize if not already done
    if (!firebaseAuth || !window.firebase) {
      try {
        await loadFirebase();
      } catch (error) {
        throw new Error('Firebase not initialized. Please check your configuration in js/config.js');
      }
      
      if (!firebaseAuth || !window.firebase) {
        throw new Error('Firebase not initialized. Please check your configuration in js/config.js');
      }
    }
    
    if (!window.firebase.auth) {
      throw new Error('Firebase Auth not available. Please check your configuration.');
    }
    
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebaseAuth.signInWithPopup(provider);
    
    // Create user document if doesn't exist
    if (firebaseDb) {
      const userDoc = await firebaseDb.collection('users').doc(result.user.uid).get();
      if (!userDoc.exists) {
        await firebaseDb.collection('users').doc(result.user.uid).set({
          email: result.user.email,
          name: result.user.displayName || 'User',
          role: 'student',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    }
    
    return result.user;
  },
  
  async signOut() {
    if (!firebaseAuth) {
      return;
    }
    await firebaseAuth.signOut();
  },
  
  onAuthStateChanged(callback) {
    if (!firebaseAuth) {
      callback(null);
      return () => {};
    }
    return firebaseAuth.onAuthStateChanged(async (user) => {
      if (user && firebaseDb) {
        try {
          const userDoc = await firebaseDb.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            callback({ ...user, role: userDoc.data().role || 'student' });
          } else {
            callback(user);
          }
        } catch (error) {
          callback(user);
        }
      } else {
        callback(user);
      }
    });
  },
  
  getCurrentUser() {
    return firebaseAuth ? firebaseAuth.currentUser : null;
  }
};

// Firestore functions
const FirestoreDB = {
  async getRoles() {
    if (!firebaseDb) {
      return [];
    }
    try {
      const snapshot = await firebaseDb.collection('roles')
        .where('published', '==', true)
        .orderBy('title')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, slug: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },
  
  async getRole(slug) {
    if (!firebaseDb) {
      return null;
    }
    try {
      const doc = await firebaseDb.collection('roles').doc(slug).get();
      if (!doc.exists) return null;
      return { id: doc.id, slug: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error fetching role:', error);
      return null;
    }
  },
  
  async getStages(roleSlug) {
    if (!firebaseDb) {
      return [];
    }
    try {
      const snapshot = await firebaseDb.collection(`roles/${roleSlug}/stages`)
        .orderBy('order')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching stages:', error);
      return [];
    }
  },
  
  async getTasks(roleSlug, stageId) {
    if (!firebaseDb) {
      return [];
    }
    try {
      const snapshot = await firebaseDb.collection(`roles/${roleSlug}/stages/${stageId}/tasks`).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },
  
  async getResources(roleSlug) {
    if (!firebaseDb) {
      return [];
    }
    try {
      const snapshot = await firebaseDb.collection(`roles/${roleSlug}/resources`).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
  },
  
  async saveProgress(uid, roleSlug, stageId, taskId, completed) {
    if (!firebaseDb) {
      return;
    }
    try {
      await firebaseDb.collection(`progress/${uid}/${roleSlug}/taskProgress`).doc(taskId).set({
        completed,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },
  
  async getProgress(uid, roleSlug, stageId, taskId) {
    if (!firebaseDb) {
      return null;
    }
    try {
      const doc = await firebaseDb.collection(`progress/${uid}/${roleSlug}/taskProgress`).doc(taskId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error fetching progress:', error);
      return null;
    }
  }
};

// Debug helper function
function debugFirebase() {
  console.log('=== Firebase Debug Info ===');
  console.log('Config available:', !!window.CONFIG);
  console.log('Firebase config:', window.CONFIG?.FIREBASE || 'NOT FOUND');
  console.log('Firebase SDK loaded:', !!window.firebase);
  console.log('Firebase app:', firebaseApp ? 'Initialized' : 'Not initialized');
  console.log('Firebase auth:', firebaseAuth ? 'Initialized' : 'Not initialized');
  console.log('Config function returns:', getFirebaseConfig());
  return {
    configAvailable: !!window.CONFIG,
    firebaseConfig: window.CONFIG?.FIREBASE,
    firebaseSDKLoaded: !!window.firebase,
    appInitialized: !!firebaseApp,
    authInitialized: !!firebaseAuth
  };
}

// Initialize on load
if (typeof window !== 'undefined') {
  window.FirebaseAuth = FirebaseAuth;
  window.FirestoreDB = FirestoreDB;
  window.loadFirebase = loadFirebase;
  window.isFirebaseInitialized = isFirebaseInitialized;
  window.debugFirebase = debugFirebase; // Add debug helper
  
  // Wait for config to be loaded, then initialize Firebase
  function initFirebaseWhenReady() {
    // Check if config is available
    if (window.CONFIG && window.CONFIG.FIREBASE) {
      const config = window.CONFIG.FIREBASE;
      if (config.apiKey && config.apiKey !== "YOUR_API_KEY" && config.apiKey !== "YOUR_FIREBASE_API_KEY") {
        loadFirebase().catch(err => {
          console.warn('Firebase initialization failed, using localStorage fallback:', err);
        });
        return;
      }
    }
    
    // If config not ready, wait a bit and try again (up to 3 times)
    let attempts = 0;
    const maxAttempts = 3;
    const checkConfig = () => {
      attempts++;
      if (window.CONFIG && window.CONFIG.FIREBASE) {
        const config = window.CONFIG.FIREBASE;
        if (config.apiKey && config.apiKey !== "YOUR_API_KEY" && config.apiKey !== "YOUR_FIREBASE_API_KEY") {
          loadFirebase().catch(err => {
            console.warn('Firebase initialization failed, using localStorage fallback:', err);
          });
          return;
        }
      }
      
      if (attempts < maxAttempts) {
        setTimeout(checkConfig, 200);
      }
    };
    
    setTimeout(checkConfig, 100);
  }
  
  // Auto-load Firebase if config is set
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebaseWhenReady);
  } else {
    initFirebaseWhenReady();
  }
}

