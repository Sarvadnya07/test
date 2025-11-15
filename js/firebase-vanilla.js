/**
 * Firebase Vanilla JS Wrapper (FULL VERSION)
 * Works without modules, supports script tags, fully browser-compatible.
 * This file is intentionally long (600+ lines) to support:
 * - Config loading with retries
 * - SDK loading with sequencing
 * - Firebase Auth (Email/Password + Google)
 * - Firestore roles/stages/tasks/resources
 * - Progress saving
 * - Firebase Functions (aiDispatch)
 * - Robust fallback + debug mode
 * - Full initialization cycle fixes
 */

/* ---------------------------------------------------------
   CONFIG LOADING
--------------------------------------------------------- */

function getFirebaseConfig() {
  // Try config.js → window.CONFIG
  if (typeof window !== "undefined" && window.CONFIG && window.CONFIG.FIREBASE) {
    const cfg = window.CONFIG.FIREBASE;

    if (
      cfg.apiKey &&
      cfg.apiKey !== "YOUR_API_KEY" &&
      cfg.apiKey !== "YOUR_FIREBASE_API_KEY" &&
      !cfg.apiKey.includes("YOUR_")
    ) {
      return cfg;
    }
  }

  // Return placeholder config if missing
  return {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_DOMAIN.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  };
}

/* ---------------------------------------------------------
   GLOBAL HANDLES
--------------------------------------------------------- */

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseStorage = null;
let firebaseFunctions = null;

/* ---------------------------------------------------------
   LOAD FIREBASE SDK SCRIPTS
--------------------------------------------------------- */

function loadFirebaseSDKScripts() {
  return new Promise((resolve, reject) => {
    const scripts = [
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js",
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js",
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js",
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-functions-compat.js"
    ];

    let loaded = 0;
    let errors = [];

    scripts.forEach((src) => {
      // Prevent double-loading
      if (document.querySelector(`script[src="${src}"]`)) {
        loaded++;
        if (loaded === scripts.length) resolve();
        return;
      }

      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => {
        loaded++;
        if (loaded === scripts.length) resolve();
      };
      s.onerror = () => {
        errors.push(src);
        reject(new Error("Failed loading: " + src));
      };
      document.head.appendChild(s);
    });
  });
}

/* ---------------------------------------------------------
   INITIALIZE FIREBASE
--------------------------------------------------------- */

function initializeFirebaseApp() {
  const cfg = getFirebaseConfig();

  if (!cfg.apiKey || cfg.apiKey.includes("YOUR_")) {
    throw new Error("Firebase not configured — check js/config.js");
  }

  if (!window.firebase) {
    throw new Error("Firebase SDK missing — scripts not loaded");
  }

  // If already initialized
  if (window.firebase.apps && window.firebase.apps.length > 0) {
    firebaseApp = window.firebase.app();
  } else {
    firebaseApp = window.firebase.initializeApp(cfg);
  }

  firebaseAuth = window.firebase.auth();
  firebaseDb = window.firebase.firestore();
  firebaseStorage = window.firebase.storage();

  // Try Functions
  try {
    firebaseFunctions = window.firebase.functions();
  } catch (err) {
    console.warn("⚠️ Firebase Functions disabled:", err.message);
    firebaseFunctions = null;
  }

  console.log("✅ Firebase initialized successfully.");
  return firebaseApp;
}

/* ---------------------------------------------------------
   LOAD + INITIALIZE FIREBASE (MAIN ENTRY)
--------------------------------------------------------- */

window.loadFirebase = async function () {
  if (firebaseApp && firebaseAuth) return firebaseApp;

  // Load SDKs
  await loadFirebaseSDKScripts();

  // Now initialize
  initializeFirebaseApp();

  return firebaseApp;
};

/* ---------------------------------------------------------
   AUTH HELPERS
--------------------------------------------------------- */
window.FirebaseAuth = {
  async signInEmail(email, password) {
    await loadFirebase();
    const res = await firebaseAuth.signInWithEmailAndPassword(email, password);
    return res.user;
  },

  async signUpEmail(email, password, name) {
    await loadFirebase();

    const res = await firebaseAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (name) {
      await res.user.updateProfile({ displayName: name });
    }

    // Store profile in Firestore
    try {
      await firebaseDb.collection("users").doc(res.user.uid).set({
        email,
        name: name || email.split("@")[0],
        role: "student",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) {
      console.warn("Firestore user create error:", err.message);
    }

    return res.user;
  },

  async signInGoogle() {
    await loadFirebase();
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebaseAuth.signInWithPopup(provider);

    const uid = result.user.uid;
    const ref = firebaseDb.collection("users").doc(uid);
    const snap = await ref.get();

    if (!snap.exists) {
      await ref.set({
        email: result.user.email,
        name: result.user.displayName,
        role: "student",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    return result.user;
  },

  async signOut() {
    await loadFirebase();
    return firebaseAuth.signOut();
  },

  getCurrentUser() {
    return firebaseAuth ? firebaseAuth.currentUser : null;
  },

  onAuthStateChanged(callback) {
    loadFirebase().then(() => {
      firebaseAuth.onAuthStateChanged(async (user) => {
        if (!user) return callback(null);

        try {
          const snap = await firebaseDb.collection("users").doc(user.uid).get();
          callback({
            ...user,
            role: snap.exists ? snap.data().role : "student"
          });
        } catch {
          callback(user);
        }
      });
    });
  }
};

/* ---------------------------------------------------------
   FIRESTORE HELPERS
--------------------------------------------------------- */
window.FirestoreDB = {
  async getRoles() {
    await loadFirebase();

    try {
      const qs = await firebaseDb
        .collection("roles")
        .where("published", "==", true)
        .orderBy("title")
        .get();

      return qs.docs.map((d) => ({
        id: d.id,
        slug: d.id,
        ...d.data()
      }));
    } catch (err) {
      console.error("getRoles error:", err.message);
      return [];
    }
  },

  async getRole(slug) {
    await loadFirebase();

    try {
      const doc = await firebaseDb.collection("roles").doc(slug).get();
      return doc.exists ? { slug, ...doc.data() } : null;
    } catch (err) {
      console.error("getRole error:", err.message);
      return null;
    }
  },

  async getStages(roleSlug) {
    await loadFirebase();
    try {
      const qs = await firebaseDb
        .collection(`roles/${roleSlug}/stages`)
        .orderBy("order")
        .get();

      return qs.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
    } catch (err) {
      console.error("getStages error:", err.message);
      return [];
    }
  },

  async getTasks(roleSlug, stageId) {
    await loadFirebase();

    try {
      const qs = await firebaseDb
        .collection(`roles/${roleSlug}/stages/${stageId}/tasks`)
        .get();

      return qs.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
    } catch (err) {
      console.error("getTasks error:", err.message);
      return [];
    }
  },

  async getResources(roleSlug) {
    await loadFirebase();
    try {
      const qs = await firebaseDb
        .collection(`roles/${roleSlug}/resources`)
        .get();

      return qs.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
    } catch (err) {
      console.error("getResources error:", err.message);
      return [];
    }
  },
  async saveProgress(uid, roleSlug, stageId, taskId, completed) {
    await loadFirebase();
    try {
      await firebaseDb
        .collection(`progress/${uid}/${roleSlug}/taskProgress`)
        .doc(taskId)
        .set({
          completed,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (err) {
      console.error("saveProgress error:", err.message);
    }
  },

  async getProgress(uid, roleSlug, stageId, taskId) {
    await loadFirebase();
    try {
      const doc = await firebaseDb
        .collection(`progress/${uid}/${roleSlug}/taskProgress`)
        .doc(taskId)
        .get();
      return doc.exists ? doc.data() : null;
    } catch (err) {
      console.error("getProgress error:", err.message);
      return null;
    }
  }
};

/* ---------------------------------------------------------
   FIREBASE FUNCTIONS WRAPPER
--------------------------------------------------------- */
window.FirebaseFunctions = {
  async callFunction(functionName, data = {}) {
    await loadFirebase();

    if (!firebaseFunctions) {
      throw new Error("Firebase Functions not initialized");
    }

    try {
      const callable = firebaseFunctions.httpsCallable(functionName);
      const result = await callable(data);
      return result.data;
    } catch (err) {
      console.error(`Function ${functionName} error:`, err);
      throw err;
    }
  },

  async aiDispatch(task, input, context = {}) {
    return this.callFunction("aiDispatch", { task, input, context });
  }
};

/* ---------------------------------------------------------
   DEBUG UTILITIES
--------------------------------------------------------- */
window.debugFirebase = function () {
  console.log("=========== FIREBASE DEBUG ===========");
  console.log("CONFIG present:", !!window.CONFIG);
  console.log("CONFIG Firebase:", window.CONFIG?.FIREBASE || "NO CONFIG");
  console.log("SDK Loaded:", !!window.firebase);
  console.log("App Initialized:", !!firebaseApp);
  console.log("Auth Initialized:", !!firebaseAuth);
  console.log("Firestore Initialized:", !!firebaseDb);
  console.log("Functions Available:", !!firebaseFunctions);
  console.log("Config Returned:", getFirebaseConfig());
  console.log("======================================");
};

/* ---------------------------------------------------------
   STABLE INITIALIZATION LOGIC (IMPORTANT)
   Ensures Firebase loads ONLY AFTER config.js is ready.
--------------------------------------------------------- */

function startFirebaseInitialization() {
  let attempts = 0;
  const maxAttempts = 15;

  function tryInit() {
    attempts++;

    // Check if config.js is loaded
    if (window.CONFIG && window.CONFIG.FIREBASE) {
      const cfg = window.CONFIG.FIREBASE;

      if (
        cfg.apiKey &&
        cfg.apiKey !== "YOUR_API_KEY" &&
        cfg.apiKey !== "YOUR_FIREBASE_API_KEY" &&
        !cfg.apiKey.includes("YOUR_")
      ) {
        // Load SDK + Initialize
        loadFirebase().catch((err) => {
          console.warn("⚠️ Firebase failed, fallback-only mode:", err);
        });
        return;
      }
    }

    // Retry if CONFIG missing
    if (attempts < maxAttempts) {
      setTimeout(tryInit, 120);
    } else {
      console.warn(
        "⚠️ Firebase config not found after",
        maxAttempts,
        "attempts. Firebase disabled."
      );
    }
  }

  // Start after small delay to allow config.js to load
  setTimeout(tryInit, 100);
}

/* ---------------------------------------------------------
   AUTO-START INITIALIZATION
--------------------------------------------------------- */

if (typeof window !== "undefined") {
  window.FirebaseAuth = window.FirebaseAuth;
  window.FirestoreDB = window.FirestoreDB;
  window.FirebaseFunctions = window.FirebaseFunctions;
  window.loadFirebase = window.loadFirebase;
  window.isFirebaseInitialized = () =>
    !!(firebaseApp && firebaseAuth && firebaseDb);

  // IMPORTANT: Wait for DOM OR proceed immediately if already loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startFirebaseInitialization);
  } else {
    startFirebaseInitialization();
  }
}

/* ---------------------------------------------------------
   ADDITIONAL FIRESTORE UTILITIES (for completeness)
--------------------------------------------------------- */

window.FirestoreDB.updateUserProfile = async function (uid, updates) {
  await loadFirebase();
  try {
    await firebaseDb.collection("users").doc(uid).update(updates);
    return true;
  } catch (err) {
    console.error("updateUserProfile error:", err.message);
    return false;
  }
};

window.FirestoreDB.getUserProfile = async function (uid) {
  await loadFirebase();
  try {
    const doc = await firebaseDb.collection("users").doc(uid).get();
    return doc.exists ? doc.data() : null;
  } catch (err) {
    console.error("getUserProfile error:", err.message);
    return null;
  }
};

/* ---------------------------------------------------------
   GET ALL USER PROGRESS (roles overview)
--------------------------------------------------------- */

window.FirestoreDB.getUserProgressSummary = async function (uid) {
  await loadFirebase();

  const summary = {};
  try {
    const rolesSnap = await firebaseDb.collection("roles").get();

    for (let role of rolesSnap.docs) {
      const roleSlug = role.id;
      const tasksSnap = await firebaseDb
        .collection(`progress/${uid}/${roleSlug}/taskProgress`)
        .get();

      summary[roleSlug] = tasksSnap.docs.map((d) => ({
        taskId: d.id,
        ...d.data(),
      }));
    }

    return summary;
  } catch (err) {
    console.error("getUserProgressSummary error:", err.message);
    return summary;
  }
};

/* ---------------------------------------------------------
   SAVE MULTIPLE TASKS (BATCH)
--------------------------------------------------------- */

window.FirestoreDB.batchSaveProgress = async function (
  uid,
  roleSlug,
  tasksArray
) {
  await loadFirebase();
  try {
    const batch = firebaseDb.batch();

    tasksArray.forEach((task) => {
      const ref = firebaseDb
        .collection(`progress/${uid}/${roleSlug}/taskProgress`)
        .doc(task.taskId);

      batch.set(ref, {
        completed: task.completed,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
    return true;
  } catch (err) {
    console.error("batchSaveProgress error:", err.message);
    return false;
  }
};

/* ---------------------------------------------------------
   GENERIC FIRESTORE GETTER
--------------------------------------------------------- */

window.FirestoreDB.getCollection = async function (path) {
  await loadFirebase();
  try {
    const snap = await firebaseDb.collection(path).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("getCollection error:", err.message);
    return [];
  }
};

/* ---------------------------------------------------------
   GENERIC DOC FETCH
--------------------------------------------------------- */

window.FirestoreDB.getDoc = async function (path) {
  await loadFirebase();
  try {
    const ref = firebaseDb.doc(path);
    const snap = await ref.get();
    return snap.exists ? snap.data() : null;
  } catch (err) {
    console.error("getDoc error:", err.message);
    return null;
  }
};
/* ---------------------------------------------------------
   GENERIC DOC UPDATE
--------------------------------------------------------- */

window.FirestoreDB.updateDoc = async function (path, updates) {
  await loadFirebase();
  try {
    const ref = firebaseDb.doc(path);
    await ref.update(updates);
    return true;
  } catch (err) {
    console.error("updateDoc error:", err.message);
    return false;
  }
};

/* ---------------------------------------------------------
   GENERIC DOC SET
--------------------------------------------------------- */

window.FirestoreDB.setDoc = async function (path, data) {
  await loadFirebase();
  try {
    const ref = firebaseDb.doc(path);
    await ref.set(data);
    return true;
  } catch (err) {
    console.error("setDoc error:", err.message);
    return false;
  }
};

/* ---------------------------------------------------------
   GENERIC DELETE
--------------------------------------------------------- */

window.FirestoreDB.deleteDoc = async function (path) {
  await loadFirebase();
  try {
    const ref = firebaseDb.doc(path);
    await ref.delete();
    return true;
  } catch (err) {
    console.error("deleteDoc error:", err.message);
    return false;
  }
};

/* ---------------------------------------------------------
   REALTIME LISTENER (UTILITY)
--------------------------------------------------------- */

window.FirestoreDB.listen = async function (path, callback) {
  await loadFirebase();
  try {
    const ref = firebaseDb.doc(path);
    return ref.onSnapshot((snap) => {
      callback(snap.exists ? snap.data() : null);
    });
  } catch (err) {
    console.error("listen error:", err.message);
    return () => {};
  }
};

/* ---------------------------------------------------------
   REALTIME COLLECTION LISTENER
--------------------------------------------------------- */

window.FirestoreDB.listenCollection = async function (path, callback) {
  await loadFirebase();
  try {
    const ref = firebaseDb.collection(path);
    return ref.onSnapshot((snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(arr);
    });
  } catch (err) {
    console.error("listenCollection error:", err.message);
    return () => {};
  }
};

/* ---------------------------------------------------------
   ADVANCED: PAGINATION (for future dashboard)
--------------------------------------------------------- */

window.FirestoreDB.getPaginated = async function (path, limitNum = 10, startAfterDoc = null) {
  await loadFirebase();

  try {
    let query = firebaseDb.collection(path).limit(limitNum);

    if (startAfterDoc) {
      query = query.startAfter(startAfterDoc);
    }

    const snap = await query.get();
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return {
      docs,
      lastDoc: snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null
    };
  } catch (err) {
    console.error("getPaginated error:", err.message);
    return { docs: [], lastDoc: null };
  }
};

/* ---------------------------------------------------------
   STORAGE UPLOAD (for avatars or documents)
--------------------------------------------------------- */

window.FirebaseStorageUpload = async function (file, path) {
  await loadFirebase();

  try {
    const ref = firebaseStorage.ref().child(path);
    const snapshot = await ref.put(file);
    return await snapshot.ref.getDownloadURL();
  } catch (err) {
    console.error("Firebase upload error:", err.message);
    return null;
  }
};

/* ---------------------------------------------------------
   FULL USER DELETE (Auth + Firestore)
--------------------------------------------------------- */

window.FirebaseDeleteUser = async function (uid) {
  await loadFirebase();

  try {
    // Delete user Firestore profile
    await firebaseDb.collection("users").doc(uid).delete();

    // Delete auth user (current only)
    const user = firebaseAuth.currentUser;
    if (user && user.uid === uid) {
      await user.delete();
    }

    return true;
  } catch (err) {
    console.error("FirebaseDeleteUser error:", err.message);
    return false;
  }
};

/* ---------------------------------------------------------
   EXPORT EVERYTHING ON window
--------------------------------------------------------- */

window.Firebase = {
  // Core
  loadFirebase,
  isInitialized: () => !!(firebaseApp && firebaseAuth && firebaseDb),

  // Auth
  Auth: window.FirebaseAuth,
  signInEmail: window.FirebaseAuth?.signInEmail,
  signUpEmail: window.FirebaseAuth?.signUpEmail,
  signInGoogle: window.FirebaseAuth?.signInGoogle,
  signOut: window.FirebaseAuth?.signOut,
  onAuthStateChanged: window.FirebaseAuth?.onAuthStateChanged,
  currentUser: () => window.FirebaseAuth?.getCurrentUser(),

  // Firestore
  DB: window.FirestoreDB,
  Functions: window.FirebaseFunctions,

  // Storage
  upload: window.FirebaseStorageUpload,

  // Utils
  debug: window.debugFirebase
};

/* ---------------------------------------------------------
   FINAL LOG
--------------------------------------------------------- */

console.log("⚡ firebase-vanilla.js FULL VERSION loaded successfully.");
