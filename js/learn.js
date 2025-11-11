import { rolesAPI } from './roles-wrapper.js';

export async function initLearnPage(){
  try{
    const roles = await rolesAPI.getAllRoles();
    // Build categories based on domains
    const categories = [...new Set(roles.map(r => r.domain || 'General'))];
    const catContainer = document.querySelector('#resources .grid') || null;
    // Render featured resources grid if present
    const featured = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    if (featured) {
      featured.innerHTML = '';
      // populate first 6 resource-like cards from roles
      let count = 0;
      for(const r of roles){
        for(const res of (r.resources||[])){
          const card = document.createElement('div');
          card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden';
          card.innerHTML = `
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-32 flex items-center justify-center text-white text-4xl">📚</div>
            <div class="p-6">
              <h3 class="font-bold text-lg mb-2">${res.title}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${r.title} • ${res.kind || ''}</p>
              <a href="${res.url||'#'}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-sm">Open →</a>
            </div>`;
          featured.appendChild(card);
          count++;
          if (count >= 6) break;
        }
        if (count >= 6) break;
      }
    }
  }catch(e){
    console.warn('initLearnPage error', e);
  }
}
