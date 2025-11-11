// Gamification system: XP, levels, badges, streaks, challenges

import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs, increment } from "firebase/firestore";
// Note: Import getAllUserProgress dynamically to avoid circular dependency
let getAllUserProgress;
async function loadProgressModule() {
  if (!getAllUserProgress) {
    const module = await import("./progress.js");
    getAllUserProgress = module.getAllUserProgress;
  }
  return getAllUserProgress;
}

// Calculate XP for an action
export function getXPForAction(action) {
  const xpMap = {
    'task_complete': 10,
    'stage_complete': 50,
    'role_complete': 200,
    'daily_challenge': 30,
    'streak_day': 5,
    'first_task': 20,
    'week_streak': 50
  };
  return xpMap[action] || 0;
}

// Add XP to user
export async function addXP(amount, reason = '') {
  const user = auth.currentUser;
  if (!user) return;
  
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() || {};
  
  const currentXP = userData.xp || 0;
  const currentLevel = userData.level || 1;
  const newXP = currentXP + amount;
  
  // Calculate level (100 XP per level, exponential after level 10)
  const xpForNextLevel = currentLevel < 10 
    ? currentLevel * 100 
    : Math.floor(100 * Math.pow(1.5, currentLevel - 10));
  
  let newLevel = currentLevel;
  let levelUp = false;
  
  if (newXP >= xpForNextLevel) {
    newLevel = currentLevel + 1;
    levelUp = true;
  }
  
  await updateDoc(userRef, {
    xp: newXP,
    level: newLevel,
    updatedAt: serverTimestamp()
  });
  
  // Log XP gain
  await setDoc(doc(db, "xpLog", `${user.uid}_${Date.now()}`), {
    uid: user.uid,
    amount,
    reason,
    timestamp: serverTimestamp()
  });
  
  return { newXP, newLevel, levelUp };
}

// Get user stats
export async function getUserStats() {
  const user = auth.currentUser;
  if (!user) return null;
  
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.data() || {};
  
  const progressModule = await loadProgressModule();
  const progress = await progressModule();
  const completedTasks = progress.filter(p => p.completed).length;
  
  // Get streak
  const streak = await calculateStreak();
  
  // Get badges
  const badgesSnap = await getDocs(query(collection(db, 'userBadges'), where('uid', '==', user.uid)));
  const badgeCount = badgesSnap.size;
  
  return {
    xp: userData.xp || 0,
    level: userData.level || 1,
    streak,
    completedTasks,
    badgeCount,
    totalXP: userData.totalXP || 0
  };
}

// Calculate streak (enhanced)
async function calculateStreak() {
  const user = auth.currentUser;
  if (!user) return 0;
  
  const progressModule = await loadProgressModule();
  const progress = await progressModule();
  const completedDates = [];
  
  progress.forEach(p => {
    if (p.completed && p.updatedAt) {
      const date = p.updatedAt.toDate ? p.updatedAt.toDate() : new Date(p.updatedAt);
      completedDates.push(date.toDateString());
    }
  });
  
  const uniqueDates = [...new Set(completedDates)].sort((a, b) => new Date(b) - new Date(a));
  
  if (uniqueDates.length === 0) return 0;
  
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }
  
  let streak = 1;
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

// Check and award badges
export async function checkAndAwardBadges() {
  const user = auth.currentUser;
  if (!user) return [];
  
  const stats = await getUserStats();
  const progressModule = await loadProgressModule();
  const progress = await progressModule();
  const completedTasks = progress.filter(p => p.completed).length;
  const streak = stats.streak;
  
  const badgesToAward = [];
  
  // Milestone badges
  if (completedTasks >= 10 && !await hasBadge('milestone_10')) {
    badgesToAward.push({ id: 'milestone_10', title: 'Getting Started', description: 'Completed 10 tasks!' });
  }
  if (completedTasks >= 50 && !await hasBadge('milestone_50')) {
    badgesToAward.push({ id: 'milestone_50', title: 'Half Century', description: 'Completed 50 tasks!' });
  }
  if (completedTasks >= 100 && !await hasBadge('milestone_100')) {
    badgesToAward.push({ id: 'milestone_100', title: 'Centurion', description: 'Completed 100 tasks!' });
  }
  
  // Streak badges
  if (streak >= 7 && !await hasBadge('streak_7')) {
    badgesToAward.push({ id: 'streak_7', title: 'Week Warrior', description: '7 day streak!' });
  }
  if (streak >= 30 && !await hasBadge('streak_30')) {
    badgesToAward.push({ id: 'streak_30', title: 'Monthly Master', description: '30 day streak!' });
  }
  
  // Level badges
  if (stats.level >= 5 && !await hasBadge('level_5')) {
    badgesToAward.push({ id: 'level_5', title: 'Rising Star', description: 'Reached level 5!' });
  }
  if (stats.level >= 10 && !await hasBadge('level_10')) {
    badgesToAward.push({ id: 'level_10', title: 'Expert', description: 'Reached level 10!' });
  }
  
  // Award badges
  for (const badge of badgesToAward) {
    await awardBadge(badge.id, badge.title, badge.description);
  }
  
  return badgesToAward;
}

async function hasBadge(badgeId) {
  const user = auth.currentUser;
  if (!user) return false;
  
  const badgeDoc = await getDoc(doc(db, 'userBadges', `${user.uid}_${badgeId}`));
  return badgeDoc.exists();
}

async function awardBadge(badgeId, title, description) {
  const user = auth.currentUser;
  if (!user) return;
  
  await setDoc(doc(db, 'userBadges', `${user.uid}_${badgeId}`), {
    uid: user.uid,
    badgeId,
    title,
    description,
    earnedAt: serverTimestamp()
  });
  
  // Also create badge definition if it doesn't exist
  const badgeDef = doc(db, 'badges', badgeId);
  if (!(await getDoc(badgeDef)).exists()) {
    await setDoc(badgeDef, {
      slug: badgeId,
      title,
      rule: description
    });
  }
}

// Get daily challenge status
export async function getDailyChallenge() {
  const user = auth.currentUser;
  if (!user) return null;
  
  const today = new Date().toDateString();
  const challengeDoc = await getDoc(doc(db, 'dailyChallenges', `${user.uid}_${today}`));
  
  if (challengeDoc.exists()) {
    return challengeDoc.data();
  }
  
  // Create new daily challenge
  const challenge = {
    uid: user.uid,
    date: today,
    target: 3,
    completed: 0,
    xpReward: 30,
    createdAt: serverTimestamp()
  };
  
  await setDoc(doc(db, 'dailyChallenges', `${user.uid}_${today}`), challenge);
  return challenge;
}

// Update daily challenge progress
export async function updateDailyChallenge() {
  const challenge = await getDailyChallenge();
  if (!challenge) return;
  
  const progressModule = await loadProgressModule();
  const progress = await progressModule();
  const today = new Date().toDateString();
  const todayTasks = progress.filter(p => {
    if (!p.completed || !p.updatedAt) return false;
    const date = p.updatedAt.toDate ? p.updatedAt.toDate() : new Date(p.updatedAt);
    return date.toDateString() === today;
  }).length;
  
  const completed = Math.min(todayTasks, challenge.target);
  const wasCompleted = challenge.completed >= challenge.target;
  const isNowCompleted = completed >= challenge.target;
  
  await updateDoc(doc(db, 'dailyChallenges', `${auth.currentUser.uid}_${today}`), {
    completed
  });
  
  // Award XP if just completed
  if (!wasCompleted && isNowCompleted) {
    await addXP(challenge.xpReward, 'Daily challenge completed');
  }
  
  return { completed, target: challenge.target, completed: isNowCompleted };
}

// Get AI motivational message
export async function getMotivationalMessage() {
  const stats = await getUserStats();
  const challenge = await getDailyChallenge();
  
  const messages = [
    `Great job! You've completed ${stats.completedTasks} tasks. Keep it up! 🚀`,
    `Your ${stats.streak}-day streak is amazing! Don't break it! 💪`,
    `Level ${stats.level} and ${stats.xp} XP - you're on fire! 🔥`,
    challenge && challenge.completed < challenge.target 
      ? `You're ${challenge.target - challenge.completed} tasks away from your daily goal! You've got this! ⭐`
      : `Daily challenge complete! You're unstoppable! 🎉`,
    `Every task you complete brings you closer to your goals. Keep learning! 📚`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

// Get all achievements
export async function getAchievements() {
  const user = auth.currentUser;
  if (!user) return [];
  
  const badgesSnap = await getDocs(query(collection(db, 'userBadges'), where('uid', '==', user.uid)));
  const achievements = [];
  
  badgesSnap.forEach(doc => {
    achievements.push({ id: doc.id, ...doc.data() });
  });
  
  return achievements.sort((a, b) => {
    const aTime = a.earnedAt?.toMillis() || 0;
    const bTime = b.earnedAt?.toMillis() || 0;
    return bTime - aTime;
  });
}

// Get XP needed for next level
export function getXPForNextLevel(level) {
  if (level < 10) {
    return level * 100;
  }
  return Math.floor(100 * Math.pow(1.5, level - 10));
}

// Get progress calendar data
export async function getProgressCalendar(year, month) {
  const user = auth.currentUser;
  if (!user) return {};
  
  const progressModule = await loadProgressModule();
  const progress = await progressModule();
  const calendar = {};
  
  progress.forEach(p => {
    if (p.completed && p.updatedAt) {
      const date = p.updatedAt.toDate ? p.updatedAt.toDate() : new Date(p.updatedAt);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!calendar[dateStr]) {
        calendar[dateStr] = 0;
      }
      calendar[dateStr]++;
    }
  });
  
  return calendar;
}

