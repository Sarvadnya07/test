import { auth, db } from "./firebase.js";
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { addXP, getXPForAction, updateDailyChallenge } from "./gamification.js";
import { checkAndAwardBadges } from "./gamification.js";

// Set progress for a task or stage
export async function setProgress({ roleSlug, stageId, taskId = null, completed }) {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("Not signed in");
  }
  
  const docId = `${uid}_${stageId}_${taskId || "stage"}`;
  
  // Check if this is a new completion
  const existing = await getDoc(doc(db, "progress", docId));
  const wasCompleted = existing.exists() && existing.data().completed;
  const isNewCompletion = completed && !wasCompleted;
  
  try {
    await setDoc(doc(db, "progress", docId), {
      uid,
      roleSlug,
      stageId,
      taskId: taskId || null,
      completed,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Award XP and check badges if task was just completed
    if (isNewCompletion) {
      const xpAmount = getXPForAction('task_complete');
      await addXP(xpAmount, 'Task completed');
      
      // Update daily challenge
      await updateDailyChallenge();
      
      // Check for new badges (async, don't wait)
      checkAndAwardBadges().catch(console.error);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error setting progress:", error);
    throw error;
  }
}

// Get progress for a specific task
export async function getTaskProgress(roleSlug, stageId, taskId) {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  
  const docId = `${uid}_${stageId}_${taskId}`;
  const docRef = doc(db, "progress", docId);
  const docSnap = await getDoc(docRef);
  
  return docSnap.exists() ? docSnap.data() : null;
}

// Get all progress for a role
export async function getRoleProgress(roleSlug) {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];
  
  const q = query(
    collection(db, "progress"),
    where("uid", "==", uid),
    where("roleSlug", "==", roleSlug)
  );
  
  const snapshot = await getDocs(q);
  const progress = [];
  snapshot.forEach((doc) => {
    progress.push({ id: doc.id, ...doc.data() });
  });
  
  return progress;
}

// Get progress for a stage
export async function getStageProgress(roleSlug, stageId) {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];
  
  const q = query(
    collection(db, "progress"),
    where("uid", "==", uid),
    where("roleSlug", "==", roleSlug),
    where("stageId", "==", stageId)
  );
  
  const snapshot = await getDocs(q);
  const progress = [];
  snapshot.forEach((doc) => {
    progress.push({ id: doc.id, ...doc.data() });
  });
  
  return progress;
}

// Check if stage is completed (all tasks done)
export async function isStageCompleted(roleSlug, stageId) {
  const progress = await getStageProgress(roleSlug, stageId);
  const stageProgress = progress.find(p => !p.taskId);
  return stageProgress?.completed || false;
}

// Get all user progress (for dashboard)
export async function getAllUserProgress() {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];
  
  const q = query(collection(db, "progress"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  const progress = [];
  snapshot.forEach((doc) => {
    progress.push({ id: doc.id, ...doc.data() });
  });
  
  return progress;
}

// Calculate current streak (consecutive days with task completion)
export async function calculateStreak() {
  const uid = auth.currentUser?.uid;
  if (!uid) return 0;
  
  const q = query(
    collection(db, "progress"),
    where("uid", "==", uid),
    where("completed", "==", true)
  );
  
  const snapshot = await getDocs(q);
  const completedDates = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.updatedAt) {
      const date = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
      completedDates.push(date.toDateString());
    }
  });
  
  // Get unique dates and sort
  const uniqueDates = [...new Set(completedDates)].sort((a, b) => new Date(b) - new Date(a));
  
  if (uniqueDates.length === 0) return 0;
  
  // Check if today or yesterday has activity
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0; // Streak broken
  }
  
  // Count consecutive days
  let streak = 1;
  let currentDate = new Date(uniqueDates[0]);
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const checkDate = new Date(uniqueDates[i]);
    const diffDays = Math.floor((prevDate - checkDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Get progress timeline (last 30 days)
export async function getProgressTimeline(days = 30) {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];
  
  const q = query(
    collection(db, "progress"),
    where("uid", "==", uid),
    where("completed", "==", true)
  );
  
  const snapshot = await getDocs(q);
  const timeline = {};
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.updatedAt) {
      const date = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
      if (date >= cutoffDate) {
        const dateStr = date.toDateString();
        timeline[dateStr] = (timeline[dateStr] || 0) + 1;
      }
    }
  });
  
  return timeline;
}

