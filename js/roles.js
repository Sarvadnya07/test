import { db } from "./firebase.js";
import { collection, getDocs, getDoc, doc, query, where, orderBy } from "firebase/firestore";
import { getRoleProgress, getTaskProgress } from "./progress.js";

// Get all published roles
export async function getAllRoles() {
  try {
    const rolesRef = collection(db, "roles");
    const q = query(rolesRef, where("published", "==", true), orderBy("title"));
    const snapshot = await getDocs(q);
    
    const roles = [];
    snapshot.forEach((doc) => {
      roles.push({ id: doc.id, slug: doc.id, ...doc.data() });
    });
    
    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

// Get role by slug
export async function getRole(slug) {
  try {
    const roleDoc = await getDoc(doc(db, "roles", slug));
    if (!roleDoc.exists()) {
      return null;
    }
    return { id: roleDoc.id, slug: roleDoc.id, ...roleDoc.data() };
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
}

// Get stages for a role
export async function getStages(roleSlug) {
  try {
    const stagesRef = collection(db, `roles/${roleSlug}/stages`);
    const q = query(stagesRef, orderBy("order"));
    const snapshot = await getDocs(q);
    
    const stages = [];
    snapshot.forEach((doc) => {
      stages.push({ id: doc.id, ...doc.data() });
    });
    
    return stages;
  } catch (error) {
    console.error("Error fetching stages:", error);
    return [];
  }
}

// Get skills for a stage
export async function getSkills(roleSlug, stageId) {
  try {
    const skillsRef = collection(db, `roles/${roleSlug}/stages/${stageId}/skills`);
    const snapshot = await getDocs(skillsRef);
    
    const skills = [];
    snapshot.forEach((doc) => {
      skills.push({ id: doc.id, ...doc.data() });
    });
    
    return skills;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

// Get tasks for a stage
export async function getTasks(roleSlug, stageId) {
  try {
    const tasksRef = collection(db, `roles/${roleSlug}/stages/${stageId}/tasks`);
    const snapshot = await getDocs(tasksRef);
    
    const tasks = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

// Get resources for a role
export async function getResources(roleSlug) {
  try {
    const resourcesRef = collection(db, `roles/${roleSlug}/resources`);
    const snapshot = await getDocs(resourcesRef);
    
    const resources = [];
    snapshot.forEach((doc) => {
      resources.push({ id: doc.id, ...doc.data() });
    });
    
    return resources;
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
}

// Render role card
export function renderRoleCard(role, container) {
  const card = document.createElement('div');
  card.className = 'role-card';
  card.innerHTML = `
    <a href="/role.html?slug=${role.slug}" class="role-card-link">
      ${role.coverImage ? `<img src="${role.coverImage}" alt="${role.title}" class="role-card-image" loading="lazy">` : ''}
      <div class="role-card-content">
        <h3>${role.title}</h3>
        <p>${role.summary || ''}</p>
        <div class="role-card-meta">
          <span class="badge">${role.domain || 'General'}</span>
          <span class="badge">${role.difficulty || 'Intermediate'}</span>
          ${role.estMonths ? `<span class="badge">~${role.estMonths} months</span>` : ''}
        </div>
      </div>
    </a>
  `;
  container.appendChild(card);
}

// Render task list with checkboxes
export async function renderTaskList(roleSlug, stageId, container) {
  const tasks = await getTasks(roleSlug, stageId);
  const list = document.createElement('ul');
  list.className = 'task-list';
  list.setAttribute('role', 'list');
  
  if (tasks.length === 0) {
    list.innerHTML = '<li class="empty">No tasks available for this stage.</li>';
    container.appendChild(list);
    return;
  }
  
  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = 'task-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${task.id}`;
    checkbox.setAttribute('aria-label', `Mark ${task.title} as complete`);
    
    // Check if task is already completed
    const progress = await getTaskProgress(roleSlug, stageId, task.id);
    if (progress?.completed) {
      checkbox.checked = true;
      li.classList.add('completed');
    }
    
    checkbox.addEventListener('change', async () => {
      try {
        const { setProgress } = await import('./progress.js');
        await setProgress({
          roleSlug,
          stageId,
          taskId: task.id,
          completed: checkbox.checked
        });
        
        if (checkbox.checked) {
          li.classList.add('completed');
        } else {
          li.classList.remove('completed');
        }
      } catch (error) {
        console.error("Error updating progress:", error);
        checkbox.checked = !checkbox.checked; // Revert
      }
    });
    
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.innerHTML = `
      <span class="task-title">${task.title}</span>
      ${task.type ? `<span class="task-type badge">${task.type}</span>` : ''}
      ${task.minutes ? `<span class="task-duration">${task.minutes} min</span>` : ''}
    `;
    
    li.appendChild(checkbox);
    li.appendChild(label);
    
    if (task.url) {
      const link = document.createElement('a');
      link.href = task.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'task-link';
      link.textContent = 'Open';
      link.setAttribute('aria-label', `Open ${task.title}`);
      li.appendChild(link);
    }
    
    list.appendChild(li);
  }
  
  container.appendChild(list);
}

