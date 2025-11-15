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
      const ui = await import('/js/ui.js');
      if (ui && typeof ui.initUI === 'function') {
        ui.initUI();
      }
    }catch(e){
      console.warn('Failed to initialize shared UI module', e);
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
      const mod = await import('./auth-wrapper.js');
      mod.authWrapper.watchAuthState((user) => {
        const authStatus = document.getElementById('auth-status');
        if (!authStatus) return;
        if (user) {
          authStatus.innerHTML = `<a href="/profile.html" class="hover:text-blue-600 dark:hover:text-blue-400">${user.displayName || user.name || 'Profile'}</a>`;
          // show dashboard link if exists
        } else {
          authStatus.innerHTML = `<a href="/auth.html" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign In</a>`;
        }
        // show/hide new-question buttons (forum)
        const newQ = document.getElementById('new-question-btn');
        if (newQ) newQ.style.display = user ? 'block' : 'none';
      });
    }catch(e){
      console.warn('Auth wrapper failed to load', e);
    }
  });
})();
