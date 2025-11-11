// roles-wrapper.js — try firebase-backed roles, otherwise fallback to local dataset
async function loadFirebaseRoles() {
  try {
    const mod = await import('./roles.js');
    return { impl: mod, type: 'firebase' };
  } catch (e) {
    console.warn('Firebase roles module not available, using fallback:', e.message || e);
    return { impl: null, type: 'fallback' };
  }
}

const resolved = await loadFirebaseRoles();
let api = {};
if (resolved.type === 'firebase' && resolved.impl) {
  api = resolved.impl;
} else {
  const fallback = await import('./roles-fallback.js');
  api = fallback;
}

export const rolesAPI = api;
