// auth-wrapper.js
// Attempts to load the Firebase-backed auth module, falls back to a simple localStorage-based mock.
async function loadFirebaseAuth() {
  try {
    const mod = await import('./auth.js');
    return { impl: mod, type: 'firebase' };
  } catch (e) {
    console.warn('Firebase auth not available, falling back to local mock:', e.message || e);
    return { impl: null, type: 'fallback' };
  }
}

// Simple local auth mock using localStorage
const fallback = (() => {
  const KEY = 'local_users';
  const SESS = 'local_session';

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){ return {}; }
  }
  function saveUsers(u){ localStorage.setItem(KEY, JSON.stringify(u)); }

  // watchAuthState accepts a callback and immediately invokes with current user or null
  function watchAuthState(cb) {
    setTimeout(() => cb(getCurrentUser()), 0);
    // no-op: return unsubscribe
    return () => {};
  }

  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(SESS) || 'null'); } catch(e){ return null; }
  }

  async function signUpEmail(email, password, name) {
    const users = getUsers();
    const id = `u_${Date.now()}`;
    users[id] = { uid: id, email, name: name || email.split('@')[0], displayName: name || null };
    saveUsers(users);
    localStorage.setItem(SESS, JSON.stringify(users[id]));
    return { user: users[id], error: null };
  }

  async function signInEmail(email, password) {
    const users = getUsers();
    const found = Object.values(users).find(u => u.email === email);
    if (!found) return { user: null, error: 'User not found' };
    localStorage.setItem(SESS, JSON.stringify(found));
    return { user: found, error: null };
  }

  async function signOutUser() {
    localStorage.removeItem(SESS);
    return { error: null };
  }

  return { watchAuthState, getCurrentUser, signUpEmail, signInEmail, signOutUser };
})();

// Public API: dynamically resolve to firebase auth or fallback
const resolved = await loadFirebaseAuth();
const api = {};
if (resolved.type === 'firebase' && resolved.impl) {
  api.watchAuthState = resolved.impl.watchAuthState;
  api.signUpEmail = resolved.impl.signUpEmail;
  api.signInEmail = resolved.impl.signInEmail;
  api.signOutUser = resolved.impl.signOutUser;
  api.getCurrentUser = resolved.impl.getCurrentUser;
} else {
  api.watchAuthState = fallback.watchAuthState;
  api.signUpEmail = fallback.signUpEmail;
  api.signInEmail = fallback.signInEmail;
  api.signOutUser = fallback.signOutUser;
  api.getCurrentUser = fallback.getCurrentUser;
}

export const authWrapper = api;
