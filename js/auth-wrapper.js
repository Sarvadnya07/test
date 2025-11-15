// auth-wrapper.js
// Attempts to load the Firebase-backed auth module, falls back to a simple localStorage-based mock.

// -------------------------
// Firebase loader
// -------------------------
async function loadFirebaseAuth() {
  try {
    const mod = await import("./auth.js");
    return { impl: mod, type: "firebase" };
  } catch (e) {
    console.warn(
      "Firebase auth not available, falling back to local mock:",
      e?.message || e
    );
    return { impl: null, type: "fallback" };
  }
}

// -------------------------
// LocalStorage fallback auth
// -------------------------
const fallback = (() => {
  const KEY = "local_users";
  const SESS = "local_session";

  function safeParse(json, fallback = null) {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  }

  function getUsers() {
    return safeParse(localStorage.getItem(KEY), {});
  }

  function saveUsers(users) {
    localStorage.setItem(KEY, JSON.stringify(users));
  }

  function getCurrentUser() {
    return safeParse(localStorage.getItem(SESS), null);
  }

  function watchAuthState(cb) {
    // Async to avoid blocking
    setTimeout(() => cb(getCurrentUser()), 0);
    return () => {}; // No unsubscribe for fallback
  }

  async function signUpEmail(email, password, name) {
    const users = getUsers();
    const uid = `u_${Date.now()}_${Math.floor(Math.random() * 9999)}`;

    users[uid] = {
      uid,
      email,
      name: name || email.split("@")[0],
      displayName: name || null
    };

    saveUsers(users);
    localStorage.setItem(SESS, JSON.stringify(users[uid]));
    return { user: users[uid], error: null };
  }

  async function signInEmail(email, password) {
    const users = getUsers();
    const found = Object.values(users).find(u => u.email === email);

    if (!found) {
      return { user: null, error: "User not found" };
    }

    localStorage.setItem(SESS, JSON.stringify(found));
    return { user: found, error: null };
  }

  async function signOutUser() {
    localStorage.removeItem(SESS);
    return { error: null };
  }

  return { watchAuthState, getCurrentUser, signUpEmail, signInEmail, signOutUser };
})();

// -------------------------
// Initialization system
// -------------------------
let api = null;
let apiPromise = null;

async function initAuthWrapper() {
  if (api) return api;
  if (apiPromise) return apiPromise;

  apiPromise = (async () => {
    try {
      const resolved = await loadFirebaseAuth();
      const finalApi = {};

      // Use Firebase if available, otherwise fallback
      const impl = resolved.impl || {};
      const source = resolved.type === "firebase" ? impl : fallback;

      finalApi.watchAuthState = impl.watchAuthState || fallback.watchAuthState;
      finalApi.signUpEmail = impl.signUpEmail || fallback.signUpEmail;
      finalApi.signInEmail = impl.signInEmail || fallback.signInEmail;
      finalApi.signOutUser = impl.signOutUser || fallback.signOutUser;
      finalApi.getCurrentUser = impl.getCurrentUser || fallback.getCurrentUser;

      api = finalApi;
      return api;
    } catch (err) {
      console.warn("Auth initialization failed, using fallback:", err);

      api = {
        watchAuthState: fallback.watchAuthState,
        signUpEmail: fallback.signUpEmail,
        signInEmail: fallback.signInEmail,
        signOutUser: fallback.signOutUser,
        getCurrentUser: fallback.getCurrentUser
      };

      return api;
    }
  })();

  return apiPromise;
}

// Ensure initialization starts early
initAuthWrapper().catch(err =>
  console.warn("Auth wrapper early init error:", err)
);

// -------------------------
// Public API via Proxy
// -------------------------
export const authWrapper = new Proxy(
  {},
  {
    get(_target, prop) {
      // If api is ready, return direct method (fast path)
      if (api && api[prop]) return api[prop];

      // If fallback has it, wrap deferred init
      if (typeof fallback[prop] === "function") {
        return (...args) =>
          initAuthWrapper()
            .then(a => (a[prop] ? a[prop](...args) : fallback[prop](...args)))
            .catch(() => fallback[prop](...args));
      }

      // Non-function property (rare)
      return api?.[prop] || fallback[prop];
    }
  }
);
