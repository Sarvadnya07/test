// AI helper functions for dynamic interactions

import { callAI } from "./firebase.js";
import { getAllUserProgress } from "./progress.js";
import { db } from "./firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";

// Get user context for personalized AI responses
export async function getUserContext() {
  const progress = await getAllUserProgress();
  const completedRoles = [...new Set(progress.filter(p => p.completed).map(p => p.roleSlug))];
  
  // Get role names
  const { doc, getDoc } = await import("firebase/firestore");
  const roleNames = [];
  for (const roleSlug of completedRoles.slice(0, 3)) {
    const roleDoc = await getDoc(doc(db, "roles", roleSlug));
    if (roleDoc.exists()) {
      roleNames.push(roleDoc.data().title);
    }
  }
  
  return {
    completedRoles: roleNames,
    totalProgress: progress.filter(p => p.completed).length
  };
}

// Ask AI with context
export async function askAI(task, input, context = {}) {
  const userContext = await getUserContext();
  
  const result = await callAI({
    task,
    input,
    context: {
      ...context,
      userProgress: userContext
    }
  });
  
  return result.data;
}

// Format AI response based on task type
export function formatAIResponse(response, task) {
  if (task === "plan" && response.plan) {
    return formatPlan(response.plan);
  } else if (task === "recommend" && response.recommendations) {
    return formatRecommendations(response.recommendations);
  } else {
    // Format markdown-like text
    return formatText(response.answer || response.text || "No response");
  }
}

// Format 6-week plan
function formatPlan(plan) {
  if (!plan.weeks || !Array.isArray(plan.weeks)) {
    return '<p class="text-red-600">Invalid plan format</p>';
  }
  
  return `
    <div class="space-y-4">
      <h3 class="text-2xl font-bold mb-4">6-Week Learning Plan</h3>
      ${plan.weeks.map((week, idx) => `
        <div class="border-l-4 border-blue-600 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-r">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl font-bold text-blue-600">Week ${week.week || idx + 1}</span>
            ${week.duration ? `<span class="text-sm text-gray-600 dark:text-gray-400">(${week.duration})</span>` : ''}
          </div>
          ${week.goals && week.goals.length > 0 ? `
            <div class="mb-3">
              <p class="font-semibold mb-1">Goals:</p>
              <ul class="list-disc list-inside space-y-1 text-sm">
                ${week.goals.map(goal => `<li>${goal}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${week.tasks && week.tasks.length > 0 ? `
            <div>
              <p class="font-semibold mb-1">Tasks:</p>
              <ul class="space-y-2">
                ${week.tasks.map(task => `
                  <li class="flex items-start gap-2 text-sm">
                    <span class="text-blue-600">✓</span>
                    <div>
                      <span class="font-medium">${task.title || task.name || 'Task'}</span>
                      ${task.minutes ? `<span class="text-gray-600 dark:text-gray-400 ml-2">(${task.minutes} min)</span>` : ''}
                      ${task.description ? `<p class="text-gray-600 dark:text-gray-400 text-xs mt-1">${task.description}</p>` : ''}
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

// Format career recommendations
function formatRecommendations(recommendations) {
  if (!Array.isArray(recommendations)) {
    return '<p>No recommendations available</p>';
  }
  
  return `
    <div class="space-y-4">
      <h3 class="text-2xl font-bold mb-4">Career Path Recommendations</h3>
      ${recommendations.map((rec, idx) => `
        <div class="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          <h4 class="font-bold text-lg mb-2">${idx + 1}. ${rec.title || rec.career || 'Career'}</h4>
          ${rec.description ? `<p class="text-gray-700 dark:text-gray-300 mb-2">${rec.description}</p>` : ''}
          ${rec.skills ? `
            <div class="mb-2">
              <p class="font-semibold text-sm mb-1">Key Skills:</p>
              <div class="flex flex-wrap gap-2">
                ${rec.skills.map(skill => `<span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          ${rec.requirements ? `
            <div class="mb-2">
              <p class="font-semibold text-sm mb-1">Requirements:</p>
              <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                ${rec.requirements.map(req => `<li>${req}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${rec.salaryRange ? `<p class="text-sm text-gray-600 dark:text-gray-400">Salary Range: ${rec.salaryRange}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

// Format text with markdown-like formatting
function formatText(text) {
  if (!text) return '<p>No response</p>';
  
  // Convert markdown-like formatting to HTML
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</code>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br>');
  
  // Wrap in paragraphs
  html = '<p class="mb-3">' + html + '</p>';
  
  // Wrap lists
  html = html.replace(/(<li.*<\/li>)/g, '<ul class="list-disc list-inside mb-3 space-y-1">$1</ul>');
  
  return html;
}

