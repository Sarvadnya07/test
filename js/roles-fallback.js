import { ROLES } from './data/roles-data.js';

export async function getAllRoles() {
  // Return published roles
  return ROLES.filter(r => r.published).map(r => ({ ...r }));
}

export async function getRole(slug) {
  const r = ROLES.find(x => x.slug === slug);
  return r ? { ...r } : null;
}

export async function getStages(roleSlug) {
  const role = ROLES.find(r => r.slug === roleSlug);
  return role ? (role.stages || []).map(s => ({ ...s })) : [];
}

export async function getSkills(roleSlug, stageId) {
  // Minimal: return empty skills array for now
  return [];
}

export async function getTasks(roleSlug, stageId) {
  // Minimal tasks from lessons
  const stages = await getStages(roleSlug);
  const st = stages.find(s => s.id === String(stageId) || String(s.order) === String(stageId));
  if (!st) return [];
  return (st.lessons || []).map((l, idx) => ({ id: l.id || `t${idx+1}`, title: l.title || 'Lesson', minutes: l.minutes || 30 }));
}

export async function getResources(roleSlug) {
  const role = ROLES.find(r => r.slug === roleSlug);
  return role ? (role.resources || []) : [];
}

// Simple task renderer that uses localStorage for progress
export async function renderTaskList(roleSlug, stageId, container) {
  const tasks = await getTasks(roleSlug, stageId);
  const list = document.createElement('ul');
  list.className = 'task-list';
  if (tasks.length === 0) {
    list.innerHTML = '<li class="empty">No tasks available for this stage.</li>';
    container.appendChild(list);
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${roleSlug}-${stageId}-${task.id}`;
    const key = `progress_${roleSlug}_${stageId}_${task.id}`;
    if (localStorage.getItem(key) === '1') {
      checkbox.checked = true;
      li.classList.add('completed');
    }
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        localStorage.setItem(key, '1');
        li.classList.add('completed');
      } else {
        localStorage.removeItem(key);
        li.classList.remove('completed');
      }
    });

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.innerHTML = `<span class="task-title">${task.title}</span> ${task.minutes ? `<span class="task-duration">${task.minutes} min</span>` : ''}`;

    li.appendChild(checkbox);
    li.appendChild(label);
    list.appendChild(li);
  });

  container.appendChild(list);
}

// Export helper
export function getStageBySlug(roleSlug, stageOrder) {
  const role = ROLES.find(r => r.slug === roleSlug);
  if (!role) return null;
  return role.stages.find(s => String(s.order) === String(stageOrder) || String(s.id) === String(stageOrder)) || null;
}
