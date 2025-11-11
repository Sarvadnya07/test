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

  function initThemeToggle(){
    // Initialize theme from storage
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);

    // Delegate click for theme toggle (works with injected header)
    document.addEventListener('click', function(e){
      const el = e.target;
      if(!el) return;
      if(el.id === 'theme-toggle' || el.closest && el.closest('#theme-toggle')){
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', async function(){
    await Promise.all([
      loadPartial('header','/components/header.html'),
      loadPartial('footer','/components/footer.html')
    ]);
    initThemeToggle();

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
