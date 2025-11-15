// include.js — simple client-side include loader for header/footer partials
(function(){
  async function loadPartial(name, url){
    const nodes = document.querySelectorAll('[data-include="'+name+'"]');
    const tag = name === 'header' ? document.querySelector('header') : name === 'footer' ? document.querySelector('footer') : null;
    try{
      const res = await fetch(url);
      if(!res.ok) throw new Error('fetch failed');
      const html = await res.text();
      // inject into data-include containers
      nodes.forEach(n => n.innerHTML = html);
      // if a semantic tag exists (old pages), replace its innerHTML to avoid duplicates
      if(tag) tag.innerHTML = html;
    }catch(e){
      console.warn('Include load failed for', name, url, e);
    }
  }

  // Initialize UI (theme, keyboard nav, etc) from centralized module
  async function initSharedUI(){
    try{
      // Try dynamic import first (if module is available)
      if (typeof window !== 'undefined' && window.ScriptLoader) {
        // If custom loader available, use it
        const ui = await window.ScriptLoader.load('/js/ui.js');
        if (ui && typeof ui.initUI === 'function') {
          ui.initUI();
        }
      } else {
        // Try regular dynamic import
        const ui = await import('/js/ui.js').catch(() => null);
        if (ui && typeof ui.initUI === 'function') {
          ui.initUI();
        } else {
          // Fallback: check if UI functions are available globally
          if (window.initUI) {
            window.initUI();
          }
        }
      }
    }catch(e){
      console.warn('Failed to initialize shared UI module, using fallback:', e);
      // Fallback: check if UI functions are available globally
      if (window.initUI) {
        window.initUI();
      }
    }
  }

  document.addEventListener('DOMContentLoaded', async function(){
    await Promise.all([
      loadPartial('header','/components/header.html'),
      loadPartial('footer','/components/footer.html')
    ]);
  // Initialize shared UI after header/footer have been injected
  initSharedUI();

    // Populate auth-status using auth-wrapper (works with Firebase or fallback)
    try{
      const mod = await import('./auth-wrapper.js').catch(() => null);
      if (mod && mod.authWrapper && mod.authWrapper.watchAuthState) {
        mod.authWrapper.watchAuthState((user) => {
        // Keep a canonical currentUser in localStorage for the header and other scripts
        if (user) {
          try { localStorage.setItem('currentUser', JSON.stringify(user)); } catch(e) {}
        } else {
          try { localStorage.removeItem('currentUser'); } catch(e) {}
        }

        // Inform header to refresh
        try { window.dispatchEvent(new Event('profileUpdated')); } catch(e) {}

        const authStatus = document.getElementById('auth-status');
        if (!authStatus) return;
        if (user) {
          authStatus.innerHTML = `<a href="/profile.html" class="hover:text-blue-600 dark:hover:text-blue-400">${user.displayName || user.name || 'Profile'}</a>`;
        } else {
          authStatus.innerHTML = `<a href="/auth.html" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign In</a>`;
        }
        // show/hide new-question buttons (forum)
        const newQ = document.getElementById('new-question-btn');
        if (newQ) newQ.style.display = user ? 'block' : 'none';
        });
      } else {
        console.warn('Auth wrapper not available, using localStorage fallback');
        // Fallback: check localStorage for user
        const currentUser = localStorage.getItem('currentUser');
        const authStatus = document.getElementById('auth-status');
        if (authStatus) {
          if (currentUser) {
            try {
              const user = JSON.parse(currentUser);
              authStatus.innerHTML = `<a href="/profile.html" class="hover:text-blue-600 dark:hover:text-blue-400">${user.displayName || user.name || 'Profile'}</a>`;
            } catch (e) {
              authStatus.innerHTML = `<a href="/auth.html" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign In</a>`;
            }
          } else {
            authStatus.innerHTML = `<a href="/auth.html" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign In</a>`;
          }
        }
      }
    }catch(e){
      console.warn('Auth wrapper failed to load, using fallback:', e);
      // Fallback to localStorage
      const currentUser = localStorage.getItem('currentUser');
      const authStatus = document.getElementById('auth-status');
      if (authStatus) {
        if (currentUser) {
          try {
            const user = JSON.parse(currentUser);
            authStatus.innerHTML = `<a href="/profile.html" class="hover:text-blue-600 dark:hover:text-blue-400">${user.displayName || user.name || 'Profile'}</a>`;
          } catch (e) {
            authStatus.innerHTML = `<a href="/auth.html" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign In</a>`;
          }
        } else {
          authStatus.innerHTML = `<a href="/auth.html" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign In</a>`;
        }
      }
    }
  });
})();
