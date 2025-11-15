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
      // helper to build grid from a filtered resources list
      function buildGrid(resourcesList) {
        featured.innerHTML = '';
        let count = 0;
        for (const resItem of resourcesList) {
          const card = document.createElement('div');
          card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden';
          card.innerHTML = `
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-32 flex items-center justify-center text-white text-4xl">📚</div>
            <div class="p-6">
              <h3 class="font-bold text-lg mb-2">${resItem.title}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${resItem.roleTitle || ''} • ${resItem.kind || ''}</p>
              <a href="${resItem.url||'#'}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-sm">Open →</a>
            </div>`;
          featured.appendChild(card);
          count++;
          if (count >= 12) break; // show up to 12 when filtered
        }
        if (resourcesList.length === 0) {
          featured.innerHTML = '<p class="text-center text-gray-600 dark:text-gray-400 col-span-3">No resources found for this category.</p>';
        }
      }

      // Flatten resources with role context
      const flat = [];
      for (const r of roles) {
        for (const res of (r.resources || [])) {
          flat.push(Object.assign({ roleTitle: r.title }, res));
        }
      }

      // Initial build (show first N resources)
      buildGrid(flat.slice(0, 12));

      // Wire up category buttons in the Resources section
      const categoryButtons = Array.from(document.querySelectorAll('#resources button'));
      const map = [
        { name: 'Video Tutorials', kinds: ['video'] },
        { name: 'Articles & Guides', kinds: ['article', 'guide'] },
        { name: 'Online Courses', kinds: ['course'] },
        { name: 'Tools & Platforms', kinds: ['tool', 'platform'] }
      ];

      categoryButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          // visual active state
          categoryButtons.forEach(b => b.classList.remove('ring-2', 'ring-blue-500'));
          btn.classList.add('ring-2', 'ring-blue-500');

          const kinds = (map[idx] && map[idx].kinds) || [];

          // Filter: match by kind OR fuzzy-match title/description keywords
          const filtered = flat.filter(res => {
            const kind = (res.kind || '').toLowerCase();
            const title = (res.title || '').toLowerCase();
            const roleTitle = (res.roleTitle || '').toLowerCase();
            
            // Exact kind match
            if (kinds.some(k => kind === k)) return true;
            
            // Partial match for kind (e.g., 'article' in 'article-guide')
            if (kinds.some(k => kind.includes(k))) return true;
            
            return false;
          });

          // If no matches, show a reasonable subset
          if (filtered.length === 0) {
            buildGrid(flat.slice(0, 12));
          } else {
            buildGrid(filtered);
          }
        });
      });
    }
  }catch(e){
    console.warn('initLearnPage error', e);
  }
}
